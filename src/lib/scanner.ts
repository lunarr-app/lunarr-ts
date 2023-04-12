import {opendir} from 'fs/promises';
import {filenameParse} from '@ctrl/video-filename-parser';

const VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'mkv', 'webm'];

export const scanMediaDirectory = async (path: string): Promise<void> => {
  const directory = await opendir(path);
  for await (const entry of directory) {
    const entryPath = `${path}/${entry.name}`;
    if (entry.isDirectory()) {
      await scanMediaDirectory(entryPath);
    } else {
      const extension = entry.name.split('.').pop()?.toLowerCase();
      if (extension && VIDEO_EXTENSIONS.includes(extension)) {
        const videoName = entry.name.replace(/\.[^/.]+$/, '');
        const videoInfo = filenameParse(videoName);
        console.log(JSON.stringify(videoInfo, null, 2));
        // To-do: Search movies
      }
    }
  }
};
