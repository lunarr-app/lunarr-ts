import {Type, Static} from '@sinclair/typebox';

const usernamePattern = '^[0-9a-zA-Z_-]+$';

export const API_HEADERS = Type.Object({
  'x-api-key': Type.String(),
});

export type API_HEADERS_TYPE = Static<typeof API_HEADERS>;

export const SCHEMA_SECURITY = {
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
};

export const UserLogin = {
  body: Type.Object({
    username: Type.String({
      minLength: 2,
      maxLength: 16,
    }),
    password: Type.String({
      minLength: 6,
      maxLength: 32,
    }),
  }),
  response: {
    200: Type.Object({
      api_key: Type.String(),
    }),
  },
};

export type UserLoginType = {
  Body: Static<typeof UserLogin.body>;
  Reply: Static<(typeof UserLogin.response)[200]>;
};

export const UserSignup = {
  body: Type.Object({
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
  }),
  response: {
    201: Type.Literal('User created successfully.'),
  },
};

export type UserSignupType = {
  Body: Static<typeof UserSignup.body>;
  Reply: Static<(typeof UserSignup.response)[201]>;
};

export const UserUpdate = {
  headers: API_HEADERS,
  body: Type.Object(
    {
      displayname: Type.Optional(
        Type.String({
          minLength: 1,
          maxLength: 48,
        }),
      ),
      password: Type.Optional(Type.String({minLength: 6, maxLength: 32})),
      sex: Type.Optional(Type.Union([Type.Literal('male'), Type.Literal('female'), Type.Literal('unknown')])),
    },
    {additionalProperties: false},
  ),
  response: {
    200: Type.Literal('User data updated'),
  },
  ...SCHEMA_SECURITY,
};

export type UserUpdateType = {
  Headers: Static<typeof UserUpdate.headers>;
  Body: Static<typeof UserUpdate.body>;
  Reply: Static<(typeof UserUpdate.response)[200]>;
};

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
  created_at: Type.String(),
  last_seen_at: Type.String(),
  current_status: Type.Union([
    Type.Literal('active'),
    Type.Literal('restricted'),
    Type.Literal('disabled'),
    Type.Literal('banned'),
  ]),
});
