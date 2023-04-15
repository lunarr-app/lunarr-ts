import {Type, Static} from '@sinclair/typebox';
import {API_HEADERS, SCHEMA_SECUIRTY} from './auth.js';

export const MovieResultsQuery = {
  headers: API_HEADERS,
  querystring: Type.Object({
    limit: Type.Number({
      minimum: 1,
      default: 20,
    }),
    page: Type.Number({
      minimum: 1,
      default: 1,
    }),
  }),
  response: {
    200: Type.Object({
      results: Type.Array(Type.Any()),
      page: Type.Number(),
      total: Type.Number(),
    }),
  },
  ...SCHEMA_SECUIRTY,
};

export type MovieResultsQueryType = {
  Querystring: Static<typeof MovieResultsQuery.querystring>;
  Reply: Static<(typeof MovieResultsQuery.response)[200]>;
};
