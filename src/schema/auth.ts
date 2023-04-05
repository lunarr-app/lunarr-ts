import {Type, Static} from '@sinclair/typebox';

const usernamePattern = '^[0-9a-zA-Z_-]+$';

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
    pattern: usernamePattern,
    description:
      'Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.',
  }),
  password: Type.String({minLength: 6, maxLength: 32}),
  sex: Type.Union([Type.Literal('male'), Type.Literal('female'), Type.Literal('unknown')], {default: 'unknown'}),
});

export type UserSignupType = Static<typeof UserSignupSchema>;

export const UserSchemaMongo = Type.Object({
  displayname: Type.String({
    minLength: 1,
    maxLength: 48,
  }),
  username: Type.String({
    minLength: 2,
    maxLength: 16,
    pattern: usernamePattern,
    description:
      'Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.',
  }),
  password: Type.String({minLength: 6, maxLength: 32}),
  sex: Type.Union([Type.Literal('male'), Type.Literal('female'), Type.Literal('unknown')], {default: 'unknown'}),
  role: Type.Union([Type.Literal('admin'), Type.Literal('superuser'), Type.Literal('subscriber')]),
  api_key: Type.String(),
});

export type UserTypeMongo = Static<typeof UserSchemaMongo>;
