import {Type, Static} from '@sinclair/typebox';

export const TvSeasonDetails = Type.Object({
  _id: Type.String(),
  air_date: Type.String({format: 'date-time'}),
  episodes: Type.Array(
    Type.Object({
      air_date: Type.String({format: 'date-time'}),
      crew: Type.Array(
        Type.Object({
          id: Type.Integer(),
          credit_id: Type.String(),
          name: Type.String(),
          department: Type.String(),
          job: Type.String(),
          profile_path: Type.Union([Type.String(), Type.Null()]),
        }),
      ),
      episode_number: Type.Integer(),
      guest_stars: Type.Array(
        Type.Object({
          id: Type.Integer(),
          name: Type.String(),
          credit_id: Type.String(),
          character: Type.String(),
          order: Type.Integer(),
          profile_path: Type.Union([Type.String(), Type.Null()]),
        }),
      ),
      id: Type.Integer(),
      name: Type.String(),
      overview: Type.String(),
      production_code: Type.String(),
      season_number: Type.Integer(),
      still_path: Type.Union([Type.String(), Type.Null()]),
      vote_average: Type.Number(),
      vote_count: Type.Integer(),
    }),
  ),
  name: Type.String(),
  overview: Type.String(),
  id: Type.Integer(),
  poster_path: Type.Union([Type.String(), Type.Null()]),
  season_number: Type.Integer(),
});

export type TvSeasonDetailsType = Static<typeof TvSeasonDetails>;
