import {Type} from '@sinclair/typebox';

export const RootEndointSchema = Type.Object({
  hello: Type.Literal('world'),
});
