import test from 'ava';
import app from '../../src/app.js';
import argon2 from 'argon2';
import dayjs from 'dayjs';
import {mongo, usersAccounts} from '../../src/lib/database.js';

test.before(async () => {
  // Create an admin user to use in the tests
  const adminPasswordHash = await argon2.hash('adminpassword');
  await usersAccounts.insertOne({
    displayname: 'Admin User',
    username: 'admin',
    password: adminPasswordHash,
    api_key: 'adminapikey',
    role: 'admin',
    created_at: dayjs().toISOString(),
    last_seen_at: dayjs().toISOString(),
    current_status: 'active',
    sex: 'unknown',
  });
});

test.after.always(async () => {
  await mongo.db().dropDatabase();
});

test.serial('GET /users --> returns an array of all users', async (t) => {
  // Send a request to get all users
  const response = await app.inject({
    method: 'GET',
    url: '/users',
    headers: {
      'x-api-key': 'adminapikey',
    },
  });

  t.is(response.statusCode, 200);

  // Check that the response is an array of user objects
  const users = JSON.parse(response.body);
  t.true(Array.isArray(users));
  t.true(users.length > 0);
  t.truthy(users[0].username);
  t.falsy(users[0].password);
});

test.serial('GET /users/me --> returns the current user', async (t) => {
  // Send a request to get the current user
  const response = await app.inject({
    method: 'GET',
    url: '/users/me',
    headers: {
      'x-api-key': 'adminapikey',
    },
  });

  t.is(response.statusCode, 200);

  // Check that the response is the expected user object
  const user = response.json();
  t.is(user.username, 'admin');
  t.falsy(user.password);
});

test.serial('PUT /users/me --> updates the current user', async (t) => {
  // Send a request to update the current user's data
  const response = await app.inject({
    method: 'PUT',
    url: '/users/me',
    headers: {
      'x-api-key': 'adminapikey',
    },
    payload: {
      displayname: 'Updated Admin User',
      sex: 'male',
      password: 'newpassword',
    },
  });

  t.is(response.statusCode, 200);

  // Check that the response is the expected success message with updated user data
  t.is(response.payload, 'User data updated');

  // Check that the user was updated in the database
  const updatedUser = await usersAccounts.findOne({api_key: 'adminapikey'});
  t.is(updatedUser?.displayname, 'Updated Admin User');
  t.is(updatedUser?.sex, 'male');
  const passwordMatches = await argon2.verify(updatedUser!.password, 'newpassword');
  t.true(passwordMatches);
});
