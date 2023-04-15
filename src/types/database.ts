import type {MovieDetailsType} from '../lib/tmdb/schema/movie.js';

export interface MovieList {
  tmdb: MovieDetailsType;
  files: string[];
}
