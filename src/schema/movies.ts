import {Type, Static} from '@sinclair/typebox';
import {API_HEADERS, SCHEMA_SECURITY} from './auth.js';
import {MovieDetails} from '../lib/tmdb/schema/movie.js';

export const MovieResultsQuery = {
  headers: API_HEADERS,
  querystring: Type.Object({
    query: Type.Union([Type.String(), Type.Null(), Type.Undefined()], {
      description: 'Search query string. If provided, search results will be filtered based on this query string.',
    }),
    limit: Type.Integer({
      minimum: 1,
      default: 20,
      description: 'Number of results per page',
    }),
    page: Type.Integer({
      minimum: 1,
      default: 1,
      description: 'Page number of results',
    }),
  }),
  response: {
    200: Type.Object({
      results: Type.Array(
        Type.Object({
          tmdb: MovieDetails,
          files: Type.Array(Type.String()),
        }),
      ),
      limit: Type.Integer(),
      page: Type.Integer(),
      total: Type.Integer(),
    }),
  },
  ...SCHEMA_SECURITY,
};

export type MovieResultsQueryType = {
  Querystring: Static<typeof MovieResultsQuery.querystring>;
  Reply: Static<(typeof MovieResultsQuery.response)[200]>;
};
