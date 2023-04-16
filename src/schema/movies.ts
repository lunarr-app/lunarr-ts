import {Type, Static} from '@sinclair/typebox';
import {API_HEADERS, SCHEMA_SECURITY} from './auth.js';
import {MovieDetails} from '../lib/tmdb/schema/movie.js';

// API schema for movie results with search endpoint
export const MovieResultsQuery = {
  headers: API_HEADERS,
  querystring: Type.Object({
    query: Type.Optional(
      Type.String({
        description:
          'The search query string. If provided, search results will be filtered based on this query string.',
      }),
    ),
    limit: Type.Integer({
      minimum: 1,
      default: 20,
      description: 'The number of results to return per page.',
    }),
    page: Type.Integer({
      minimum: 1,
      default: 1,
      description: 'The page number of results to return.',
    }),
  }),
  response: {
    200: Type.Object({
      results: Type.Array(
        Type.Object({
          tmdb: MovieDetails,
          files: Type.Array(
            Type.String({
              description: 'The file names associated with the movie.',
            }),
          ),
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

export type MovieResultsQueryType = {
  Headers: Static<typeof MovieResultsQuery.headers>;
  Querystring: Static<typeof MovieResultsQuery.querystring>;
  Reply: Static<(typeof MovieResultsQuery.response)[200]>;
};

// API schema for streaming a movie with specified TMDb ID
export const MovieStreamParams = {
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
      description: 'The TMDb ID of the movie to stream',
    }),
  }),
  response: {
    200: Type.Uint8Array({
      description: 'The full stream of the movie if no "range" header is provided',
    }),
    206: Type.Uint8Array({
      description: 'A partial stream of the movie if a "range" header is provided',
    }),
  },
  ...SCHEMA_SECURITY,
};

export type MovieStreamParamsType = {
  Headers: Static<typeof MovieStreamParams.headers>;
  Params: Static<typeof MovieStreamParams.params>;
};
