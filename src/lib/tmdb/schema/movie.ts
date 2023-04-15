import {Type, Static} from '@sinclair/typebox';

export const MovieDetails = Type.Object({
  adult: Type.Boolean(),
  backdrop_path: Type.Union([Type.String(), Type.Null()]),
  belongs_to_collection: Type.Union([
    Type.Object({
      id: Type.Integer(),
      name: Type.String(),
      poster_path: Type.Union([Type.String(), Type.Null()]),
      backdrop_path: Type.Union([Type.String(), Type.Null()]),
    }),
    Type.Null(),
  ]),
  budget: Type.Integer(),
  genres: Type.Array(
    Type.Object({
      id: Type.Integer(),
      name: Type.String(),
    }),
  ),
  homepage: Type.Union([Type.String(), Type.Null()]),
  id: Type.Integer(),
  imdb_id: Type.Union([
    Type.String({
      minLength: 9,
      maxLength: 9,
      pattern: '^tt[0-9]{7}',
    }),
    Type.Null(),
  ]),
  original_language: Type.String(),
  original_title: Type.String(),
  overview: Type.Union([Type.String(), Type.Null()]),
  popularity: Type.Number(),
  poster_path: Type.Union([Type.String(), Type.Null()]),
  production_companies: Type.Array(
    Type.Object({
      id: Type.Integer(),
      logo_path: Type.Union([Type.String(), Type.Null()]),
      name: Type.String(),
      origin_country: Type.String(),
    }),
  ),
  production_countries: Type.Array(
    Type.Object({
      iso_3166_1: Type.String(),
      name: Type.String(),
    }),
  ),
  release_date: Type.String({format: 'date'}),
  revenue: Type.Integer(),
  runtime: Type.Union([Type.Integer(), Type.Null()]),
  spoken_languages: Type.Array(
    Type.Object({
      iso_639_1: Type.String(),
      name: Type.String(),
      english_name: Type.Union([Type.String(), Type.Null()]),
    }),
  ),
  status: Type.Union([
    Type.Literal('Rumored'),
    Type.Literal('Planned'),
    Type.Literal('In Production'),
    Type.Literal('Post Production'),
    Type.Literal('Released'),
    Type.Literal('Canceled'),
  ]),
  tagline: Type.Union([Type.String(), Type.Null()]),
  title: Type.String(),
  video: Type.Boolean(),
  vote_average: Type.Number(),
  vote_count: Type.Integer(),
});

export type MovieDetailsType = Static<typeof MovieDetails>;
