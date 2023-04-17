import {Type, Static} from '@sinclair/typebox';

export const TvShowDetails = Type.Object({
  backdrop_path: Type.Union([Type.String(), Type.Null()]),
  created_by: Type.Array(
    Type.Object({
      id: Type.Integer(),
      credit_id: Type.String(),
      name: Type.String(),
      gender: Type.Integer(),
      profile_path: Type.Union([Type.String(), Type.Null()]),
    }),
  ),
  episode_run_time: Type.Array(Type.Integer()),
  first_air_date: Type.String({format: 'date'}),
  genres: Type.Array(
    Type.Object({
      id: Type.Integer(),
      name: Type.String(),
    }),
  ),
  homepage: Type.Union([Type.String(), Type.Null()]),
  id: Type.Integer(),
  in_production: Type.Boolean(),
  languages: Type.Array(Type.String()),
  last_air_date: Type.String({format: 'date'}),
  last_episode_to_air: Type.Union([
    Type.Object({
      air_date: Type.String({format: 'date'}),
      episode_number: Type.Integer(),
      id: Type.Integer(),
      name: Type.String(),
      overview: Type.Union([Type.String(), Type.Null()]),
      production_code: Type.String(),
      season_number: Type.Integer(),
      still_path: Type.Union([Type.String(), Type.Null()]),
      vote_average: Type.Number(),
      vote_count: Type.Integer(),
    }),
    Type.Null(),
  ]),
  name: Type.String(),
  next_episode_to_air: Type.Union([
    Type.Object({
      air_date: Type.String({format: 'date'}),
      episode_number: Type.Integer(),
      id: Type.Integer(),
      name: Type.String(),
      overview: Type.Union([Type.String(), Type.Null()]),
      production_code: Type.String(),
      season_number: Type.Integer(),
      still_path: Type.Union([Type.String(), Type.Null()]),
      vote_average: Type.Number(),
      vote_count: Type.Integer(),
    }),
    Type.Null(),
  ]),
  networks: Type.Array(
    Type.Object({
      name: Type.String(),
      id: Type.Integer(),
      logo_path: Type.Union([Type.String(), Type.Null()]),
      origin_country: Type.String(),
    }),
  ),
  number_of_episodes: Type.Integer(),
  number_of_seasons: Type.Integer(),
  origin_country: Type.Array(Type.String()),
  original_language: Type.String(),
  original_name: Type.String(),
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
  seasons: Type.Array(
    Type.Object({
      air_date: Type.Union([Type.String({format: 'date'}), Type.Null()]),
      episode_count: Type.Integer(),
      id: Type.Integer(),
      name: Type.String(),
      overview: Type.Union([Type.String(), Type.Null()]),
      poster_path: Type.Union([Type.String(), Type.Null()]),
      season_number: Type.Integer(),
    }),
  ),
  status: Type.String(),
  type: Type.String(),
  vote_average: Type.Number(),
  vote_count: Type.Integer(),
});

export type TvShowDetailsType = Static<typeof TvShowDetails>;
