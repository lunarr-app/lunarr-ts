import * as fs from 'fs';
import {movieList} from './file-list.js';

const moviesDir = './sample/movies';

try {
  fs.mkdirSync(moviesDir, {recursive: true});
} catch (err) {
  if (err.code !== 'EEXIST') {
    console.error(`Failed to create "${moviesDir}" directory:`, err);
    process.exit(1);
  }
}

for (const file of movieList) {
  const filePath = `${moviesDir}/${file}.mp4`;
  try {
    fs.writeFileSync(filePath, '');
    console.log(`Created: ${filePath}`);
  } catch (err) {
    console.error(`Failed to create file "${filePath}":`, err);
  }
}
