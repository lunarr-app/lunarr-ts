import test from 'ava';
import app from '../../src/app.js';
import {mongo, usersAccounts} from '../../src/lib/database.js';

test.after.always(async () => {
  await mongo.db().dropDatabase();
});

// Test the user signup functionality
test.serial('POST /auth/signup --> register a new user', async (t) => {
  // Create a mock request body
  const requestBody = {
    displayname: 'test user',
    username: 'testuser',
    password: 'testpassword',
  };

  // Send a request to create a new user
  const response = await app.inject({
    method: 'POST',
    url: '/auth/signup',
    payload: requestBody,
  });

  t.is(response.statusCode, 200);
  t.is(response.body, 'User created successfully.');

  // Check that the user was inserted into the database
  const user = await usersAccounts.findOne({username: 'testuser'});
  t.truthy(user);
  t.is(user!.username, 'testuser');
});

// Test the user login functionality
test.serial('POST /auth/login  --> login returns an api_key if the credentials are valid', async (t) => {
  // Send a request to log in
  const response = await app.inject({
    method: 'POST',
    url: '/auth/login',
    payload: {
      username: 'testuser',
      password: 'testpassword',
    },
  });

  t.is(response.statusCode, 200);
  t.truthy(response.json().api_key);
});

// Test that restricted usernames cannot be used during signup
test.serial('POST /auth/signup --> signup rejects restricted usernames', async (t) => {
  // Create a mock request body with a restricted username
  const requestBody = {
    displayname: 'admin user',
    username: 'admin',
    password: 'testpassword',
  };

  // Send a request to create a new user with a restricted username
  const response = await app.inject({
    method: 'POST',
    url: '/auth/signup',
    payload: requestBody,
  });

  t.is(response.statusCode, 409);
  t.is(response.body, 'Username is not allowed. Please choose a different username.');
});
