import {Type} from '@sinclair/typebox';

// root endpoint which responds with a static string "world"
export const RootEndpointSchema = Type.Object({
  hello: Type.Literal('world', {
    description: 'Static string response for the root endpoint',
  }),
});
