import type {MovieDetailsType} from '../lib/tmdb/schema/movie.js';
import type {TvShowDetailsType, TvSeasonDetailsType} from '../lib/tmdb/schema/tv-show.js';

export interface MovieList {
  tmdb: MovieDetailsType;
  files: string[];
}

export interface TvShowsList {
  show: TvShowDetailsType;
  seasons: TvSeasonDetailsType[];
  files: string[];
}
