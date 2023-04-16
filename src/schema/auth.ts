import {Type, Static} from '@sinclair/typebox';

// Regular expression pattern for valid usernames
const usernamePattern = '^[0-9a-zA-Z_-]+$';

// Define the API headers object schema
export const API_HEADERS = Type.Object({
  'x-api-key': Type.String({
    description: 'The API key to authenticate requests',
  }),
});

export type API_HEADERS_TYPE = Static<typeof API_HEADERS>;

// Define the security schema
export const SCHEMA_SECURITY = {
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
};

// Define the UserLogin schema
export const UserLogin = {
  body: Type.Object({
    username: Type.String({
      minLength: 2,
      maxLength: 16,
      description: "The user's username",
    }),
    password: Type.String({
      minLength: 6,
      maxLength: 32,
      description: "The user's password",
    }),
  }),
  response: {
    200: Type.Object({
      api_key: Type.String({
        description: 'The API key to use for authenticated requests',
      }),
    }),
  },
};

export type UserLoginType = {
  Body: Static<typeof UserLogin.body>;
  Reply: Static<(typeof UserLogin.response)[200]>;
};

// Define the UserSignup schema
export const UserSignup = {
  body: Type.Object({
    displayname: Type.String({
      minLength: 1,
      maxLength: 48,
      description: "The user's display name",
    }),
    username: Type.String({
      minLength: 2,
      maxLength: 16,
      pattern: usernamePattern,
      description:
        "The user's username. Must contain only alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.",
    }),
    password: Type.String({
      minLength: 6,
      maxLength: 32,
      description: "The user's password",
    }),
    sex: Type.Union([Type.Literal('male'), Type.Literal('female'), Type.Literal('unknown')], {
      default: 'unknown',
      description: "The user's gender",
    }),
  }),
  response: {
    201: Type.Literal('User created successfully.', {
      description: 'The success message after a user has been created',
    }),
  },
};

export type UserSignupType = {
  Body: Static<typeof UserSignup.body>;
  Reply: Static<(typeof UserSignup.response)[201]>;
};

// Define the UserUpdate schema
export const UserUpdate = {
  headers: API_HEADERS,
  body: Type.Object(
    {
      displayname: Type.Optional(
        Type.String({
          minLength: 1,
          maxLength: 48,
          description: "The user's updated display name",
        }),
      ),
      password: Type.Optional(
        Type.String({
          minLength: 6,
          maxLength: 32,
          description: "The user's updated password",
        }),
      ),
      sex: Type.Optional(
        Type.Union([Type.Literal('male'), Type.Literal('female'), Type.Literal('unknown')], {
          description: "The user's updated gender",
        }),
      ),
    },
    {additionalProperties: false},
  ),
  response: {
    200: Type.Literal('User data updated', {
      description: "The success message after a user's data has been updated",
    }),
  },
  ...SCHEMA_SECURITY,
};

export type UserUpdateType = {
  Headers: Static<typeof UserUpdate.headers>;
  Body: Static<typeof UserUpdate.body>;
  Reply: Static<(typeof UserUpdate.response)[200]>;
};

// Define the UserSchemaMongo schema for MongoDB storage
export const UserSchemaMongo = Type.Object({
  displayname: Type.String({
    minLength: 1,
    maxLength: 48,
    description: 'User display name.',
  }),
  username: Type.String({
    minLength: 2,
    maxLength: 16,
    pattern: usernamePattern,
    description:
      'Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.',
  }),
  password: Type.String({
    minLength: 6,
    maxLength: 32,
    description: 'User password, hashed before storage.',
  }),
  sex: Type.Union([Type.Literal('male'), Type.Literal('female'), Type.Literal('unknown')], {
    default: 'unknown',
    description: 'User gender.',
  }),
  role: Type.Union([Type.Literal('admin'), Type.Literal('superuser'), Type.Literal('subscriber')], {
    description: 'User role.',
  }),
  api_key: Type.String({
    description: 'API key used for authentication.',
  }),
  created_at: Type.String({
    description: 'Date and time when user account was created.',
  }),
  last_seen_at: Type.String({
    description: 'Date and time when user was last active.',
  }),
  current_status: Type.Union(
    [Type.Literal('active'), Type.Literal('restricted'), Type.Literal('disabled'), Type.Literal('banned')],
    {
      description: 'Current status of user account.',
    },
  ),
});
