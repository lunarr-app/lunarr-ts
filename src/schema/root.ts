import {Type, Static} from '@sinclair/typebox';

export const RootEndointSchema = Type.Object({
  hello: Type.Literal('world'),
});

export type RootEndointType = Static<typeof RootEndointSchema>;
