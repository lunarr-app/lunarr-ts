import {TMDB} from 'tmdb-ts';
import {opendir} from 'fs/promises';
import {filenameParse} from '@ctrl/video-filename-parser';
import {moviesLists} from './database.js';
import {logger} from './logger.js';
import type {MovieDetailsType} from './tmdb/schema/movie.js';

// List of valid video file extensions
const VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'mkv', 'webm'];

// IMPORTANT: The following access token is for production usage only and should NOT be shared or used in third-party repositories.
const accessToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMGVlMjVjNzg4OGQ3MGU4NTg3ODU5YzUwNjBhZmYwMCIsInN1YiI6IjVlMzVhMzdmNzZlZWNmMDAxNThmNjliZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._Ati2D39oQJy6sSPwF4-1ooinjEjvuqqMbhXkPqDA6I';

// Create TMDB instance with read access token (v4 auth)
const tmdb = new TMDB(accessToken);

/**
 * Scans a directory for video files and logs information about each file.
 * @param {string} path - The path of the directory to scan.
 * @returns {Promise<void>} - A promise that resolves when the scanning is complete.
 */
export const scanMediaDirectory = async (path: string): Promise<void> => {
  logger.info(`Scanning directory ${path}`);

  try {
    const directory = await opendir(path);

    // Iterate over each entry in the directory
    for await (const entry of directory) {
      const entryPath = `${path}/${entry.name}`;

      // Recursively call the function if the entry is a directory
      if (entry.isDirectory()) {
        await scanMediaDirectory(entryPath);
      } else {
        const extension = entry.name.split('.').pop()?.toLowerCase();

        // Check if the entry is a valid video file
        if (extension && VIDEO_EXTENSIONS.includes(extension)) {
          // Check if the movie already exists in the database
          const movieData = await moviesLists.findOne({files: entryPath});

          if (!movieData) {
            const videoInfo = filenameParse(entry.name);
            const movie = await tmdb.search.movies({
              query: videoInfo.title,
              year: videoInfo.year ? Number(videoInfo.year) : undefined,
              include_adult: true,
            });

            if (movie.results.at(0)) {
              const data = await tmdb.movies.details(movie.results[0].id);
              await moviesLists.insertOne({
                tmdb: data as MovieDetailsType,
                files: [entryPath],
              });
              logger.info(`Added movie ${entry.name} to database`);
            } else {
              logger.warn(`No valid TMDB result for ${entry.name}`);
            }
          } else {
            logger.info(`Movie ${entryPath} already exists in the database`);
          }
        }
      }
    }
  } catch (error) {
    logger.error(`Error scanning directory ${path}: ${error}`);
  }
};
