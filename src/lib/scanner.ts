import TMDB from 'tmdb-ts';
import {opendir} from 'fs/promises';
import {filenameParse} from '@ctrl/video-filename-parser';
import {moviesLists} from './database.js';
import type {MovieDetailsType} from './tmdb/schema/movie.js';

// List of valid video file extensions
const VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'mkv', 'webm'];

// Create TMDB instance with access token
const tmdb = new TMDB('accessToken');

/**
 * Scans a directory for video files and logs information about each file.
 * @param {string} path - The path of the directory to scan.
 * @returns {Promise<void>} - A promise that resolves when the scanning is complete.
 */
export const scanMediaDirectory = async (path: string): Promise<void> => {
  // Use `opendir` instead of `readdir` to efficiently iterate over the contents of the directory.
  // `opendir` returns an asynchronous iterator that allows us to iterate over the directory's contents one by one,
  // without loading everything into memory at once. This makes it more memory-efficient and less error-prone than `readdir`.
  const directory = await opendir(path);

  // Iterate over each entry in the directory
  for await (const entry of directory) {
    const entryPath = `${path}/${entry.name}`;
    // Recursively call the function if the entry is a directory
    if (entry.isDirectory()) {
      await scanMediaDirectory(entryPath);
    } else {
      // Check if the entry is a valid video file
      const extension = entry.name.split('.').pop()?.toLowerCase();
      if (extension && VIDEO_EXTENSIONS.includes(extension)) {
        // Check if the movie already exists in the database
        const movieData = await moviesLists.findOne({files: entryPath});

        // If the movie doesn't exist, query TMDB for information about the movie
        if (!movieData) {
          const videoInfo = filenameParse(entry.name);
          const movie = await tmdb.search.movies({
            query: videoInfo.title,
            year: videoInfo.year ? Number(videoInfo.year) : undefined,
            include_adult: true,
          });

          // If TMDB returns a valid movie result, get more detailed information and insert it into the database
          if (movie.results.at(0)) {
            const data = await tmdb.movies.details(movie.results[0].id);
            await moviesLists.insertOne({
              tmdb: data as MovieDetailsType,
              files: [entryPath],
            });
          }
        }
      }
    }
  }
};
