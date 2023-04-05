import {types, schema} from 'papr';
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

export const UserSchemaMongo = schema({
  displayname: types.string({
    minLength: 1,
    maxLength: 48,
    required: true,
  }),
  username: types.string({
    minLength: 2,
    maxLength: 16,
    pattern: usernamePattern,
    required: true,
  }),
  password: types.string({
    minLength: 6,
    maxLength: 32,
    required: true,
  }),
  sex: types.oneOf(['male', 'female', 'unknown'], {required: true}),
  role: types.oneOf(['admin', 'superuser', 'subscriber'], {required: true}),
  api_key: types.string({required: true}),
});
