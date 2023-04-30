import {Type, Static} from '@sinclair/typebox';
import {API_HEADERS, SCHEMA_SECURITY, SEARCH_WITH_PAGINATION, RESPONSE_FILE_STREAM} from './common.js';
import {MovieDetails} from '../lib/tmdb/schema/movie.js';

// API schema for movie results with search endpoint
export const MovieResultsQuery = {
  headers: API_HEADERS,
  querystring: SEARCH_WITH_PAGINATION,
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
  response: RESPONSE_FILE_STREAM,
  ...SCHEMA_SECURITY,
};

export type MovieStreamParamsType = {
  Headers: Static<typeof MovieStreamParams.headers>;
  Params: Static<typeof MovieStreamParams.params>;
};
