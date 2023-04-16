import {Type, Static} from '@sinclair/typebox';
import {API_HEADERS, SCHEMA_SECURITY} from './auth.js';
import {MovieDetails} from '../lib/tmdb/schema/movie.js';

export const MovieResultsQuery = {
  headers: API_HEADERS,
  querystring: Type.Object({
    query: Type.Optional(
      Type.String({
        description: 'Search query string. If provided, search results will be filtered based on this query string.',
      }),
    ),
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
  Headers: Static<typeof MovieResultsQuery.headers>;
  Querystring: Static<typeof MovieResultsQuery.querystring>;
  Reply: Static<(typeof MovieResultsQuery.response)[200]>;
};

export const MovieStreamParams = {
  headers: Type.Composite([
    API_HEADERS,
    Type.Object({
      range: Type.Optional(Type.String()),
    }),
  ]),
  params: Type.Object({
    tmdb_id: Type.String(),
  }),
  response: {
    200: Type.Uint8Array(),
    206: Type.Uint8Array(),
    404: Type.Literal('Movie not found'),
  },
  ...SCHEMA_SECURITY,
};

export type MovieStreamParamsType = {
  Headers: Static<typeof MovieStreamParams.headers>;
  Params: Static<typeof MovieStreamParams.params>;
};
