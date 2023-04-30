// Define the API headers object schema
import {Type, Static} from '@sinclair/typebox';

// Define the security schema
export const SCHEMA_SECURITY = {
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
};

// Define the API headers object schema
export const API_HEADERS = Type.Object({
  'x-api-key': Type.String({
    description: 'The API key to authenticate requests',
  }),
});

export type API_HEADERS_TYPE = Static<typeof API_HEADERS>;

// Define the search with pagination schema
export const SEARCH_WITH_PAGINATION = Type.Object({
  query: Type.Optional(
    Type.String({
      description: 'The search query string. If provided, search results will be filtered based on this query string.',
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
});
