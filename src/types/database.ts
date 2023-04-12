import type {MovieDetails} from 'tmdb-ts';

export interface MovieList {
  tmdb: MovieDetails;
  files: string[];
}
