import {Type, Static} from '@sinclair/typebox';

export const MovieResultsQuerySchema = Type.Object({
  limit: Type.Number({
    minimum: 1,
    default: 20,
  }),
  page: Type.Number({
    minimum: 1,
    default: 20,
  }),
});

export type MovieResultsQueryType = Static<typeof MovieResultsQuerySchema>;
