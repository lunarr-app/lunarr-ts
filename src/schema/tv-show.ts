import {Type, Static} from '@sinclair/typebox';
import {API_HEADERS, SCHEMA_SECURITY, SEARCH_WITH_PAGINATION} from './common.js';
import {TvShowDetails} from '../lib/tmdb/schema/tv-show.js';

// API schema for TV show search results endpoint.
export const TVShowResultsQuery = {
  headers: API_HEADERS,
  querystring: SEARCH_WITH_PAGINATION,
  response: {
    200: Type.Object({
      results: Type.Array(
        Type.Object({
          show: TvShowDetails,
        }),
      ),
      limit: Type.Integer({
        description: 'The number of results returned per page.',
      }),
      page: Type.Integer({
        description: 'The page number of results returned.',
      }),
      total: Type.Integer({
        description: 'The total number of results that matched the search query.',
      }),
    }),
  },
  ...SCHEMA_SECURITY,
};

export type TVShowResultsQueryType = {
  Headers: Static<typeof TVShowResultsQuery.headers>;
  Querystring: Static<typeof TVShowResultsQuery.querystring>;
  Reply: Static<(typeof TVShowResultsQuery.response)[200]>;
};

// API schema for streaming a TV show episode with specified TMDb ID.
export const TVShowEpisodeStreamParams = {
  headers: Type.Composite([
    API_HEADERS,
    Type.Object({
      range: Type.Optional(
        Type.String({
          description:
            'Specifies which part of the file to send based on byte ranges. Only supported in 206 Partial Content responses.',
        }),
      ),
    }),
  ]),
  params: Type.Object({
    tmdb_id: Type.String({
      description: 'The TMDb ID of the TV show to stream.',
    }),
    season: Type.String({
      description: 'The season number of the TV show episode to stream.',
    }),
    episode: Type.String({
      description: 'The episode number of the TV show episode to stream.',
    }),
  }),
  response: {
    200: Type.Uint8Array({
      description: 'The full stream of the TV show if no "range" header is provided.',
    }),
    206: Type.Uint8Array({
      description: 'A partial stream of the TV show if a "range" header is provided.',
    }),
  },
  ...SCHEMA_SECURITY,
};

export type TVShowEpisodeStreamParamsType = {
  Headers: Static<typeof TVShowEpisodeStreamParams.headers>;
  Params: Static<typeof TVShowEpisodeStreamParams.params>;
};
