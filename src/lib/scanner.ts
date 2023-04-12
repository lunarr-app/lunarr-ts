import {opendir} from 'fs/promises';
import {filenameParse} from '@ctrl/video-filename-parser';

const VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'mkv', 'webm'];

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

  for await (const entry of directory) {
    const entryPath = `${path}/${entry.name}`;
    if (entry.isDirectory()) {
      await scanMediaDirectory(entryPath);
    } else {
      const extension = entry.name.split('.').pop()?.toLowerCase();
      if (extension && VIDEO_EXTENSIONS.includes(extension)) {
        const videoInfo = filenameParse(entry.name);
        console.log(JSON.stringify(videoInfo, null, 2));
        // To-do: Search movies
      }
    }
  }
};
