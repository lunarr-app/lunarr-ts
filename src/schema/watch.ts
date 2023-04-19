import {Type, Static} from '@sinclair/typebox';

const WatchHistoryMovies = Type.Object({
  user_id: Type.String({
    description: 'The ID of the user who watched the movie.',
  }),
  tmdb_id: Type.String({
    description: 'The ID of the movie on TMDb.',
  }),
  media_type: Type.Literal('movie'),
  watch_count: Type.Integer({
    description: 'The number of times the user has watched the movie.',
  }),
  current_progress_seconds: Type.Number({
    description: 'The number of seconds the user has watched the movie up to.',
  }),
  user_rating: Type.Number({
    minimum: 0,
    maximum: 10,
    description: 'The rating given by the user for the movie.',
  }),
  date_watched: Type.String({
    format: 'date-time',
    description: 'The date and time when the user watched the movie.',
  }),
  created_at: Type.String({
    format: 'date-time',
    description: 'The date and time when the document was created.',
  }),
  updated_at: Type.String({
    format: 'date-time',
    description: 'The date and time when the document was last updated.',
  }),
});

const WatchHistoryTvShow = Type.Object({
  user_id: Type.String({
    description: 'The ID of the user who watched the TV show.',
  }),
  tmdb_id: Type.String({
    description: 'The ID of the TV show on TMDb.',
  }),
  media_type: Type.Union([Type.Literal('tv-show')]),
  watched_seasons: Type.Array(
    Type.Object({
      season: Type.Number({
        description: 'The season number of the TV show.',
      }),
      episodes: Type.Array(
        Type.Object({
          episode: Type.Number({
            description: 'The episode number of the TV show.',
          }),
          watch_count: Type.Integer({
            description: 'The number of times the user has watched the episode.',
          }),
          current_progress_seconds: Type.Number({
            description: 'The number of seconds the user has watched the episode up to.',
          }),
          user_rating: Type.Number({
            description: 'The rating given by the user for the episode.',
            minimum: 0,
            maximum: 10,
          }),
          date_watched: Type.String({
            format: 'date-time',
            description: 'The date and time when the user watched the episode.',
          }),
        }),
      ),
    }),
  ),
  user_rating: Type.Number({
    minimum: 0,
    maximum: 10,
    description: 'The rating given by the user for the TV show.',
  }),
  date_watched: Type.String({
    format: 'date-time',
    description: 'The date and time when the user watched the TV show.',
  }),
  created_at: Type.String({
    format: 'date-time',
    description: 'The date and time when the document was created.',
  }),
  updated_at: Type.String({
    format: 'date-time',
    description: 'The date and time when the document was last updated.',
  }),
});

const WatchHistory = Type.Union([WatchHistoryMovies, WatchHistoryTvShow]);

export type WatchHistoryType = Static<typeof WatchHistory>;
