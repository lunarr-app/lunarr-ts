import {types, schema} from 'papr';
import {Type, Static} from '@sinclair/typebox';

export const UserLoginSchema = Type.Object({
  username: Type.String({
    minLength: 2,
    maxLength: 16,
  }),
  password: Type.String({
    minLength: 6,
    maxLength: 32,
  }),
});

export type UserLoginType = Static<typeof UserLoginSchema>;

export const UserSignupSchema = Type.Object({
  displayname: Type.String({
    minLength: 1,
    maxLength: 48,
  }),
  username: Type.String({
    minLength: 2,
    maxLength: 16,
    pattern: '^[0-9a-zA-Z_-]+$',
    description:
      'Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.',
  }),
  password: Type.String({minLength: 6, maxLength: 32}),
  sex: Type.Union([Type.Literal('male'), Type.Literal('female'), Type.Literal('unknown')], {default: 'unknown'}),
});

export type UserSignupType = Static<typeof UserSignupSchema>;

export const UserSchemaMongo = schema({
  displayname: types.string({
    minLength: 1,
    maxLength: 48,
  }),
  username: types.string({
    minLength: 2,
    maxLength: 16,
    pattern: '^[0-9a-zA-Z_-]+$',
  }),
  password: types.string({
    minLength: 6,
    maxLength: 32,
  }),
});
