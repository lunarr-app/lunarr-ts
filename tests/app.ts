import test from 'ava';
import app from '../src/app.js';

test('GET / responds with 200 status and "hello world" message', async (t) => {
  const response = await app.inject({
    method: 'GET',
    url: '/',
  });
  t.is(response.statusCode, 200);
  t.deepEqual(JSON.parse(response.body), {hello: 'world'});
});

test('GET /users without x-api-key header returns 401 Unauthorized error', async (t) => {
  const response = await app.inject({
    method: 'GET',
    url: '/users',
  });
  t.is(response.statusCode, 401);
  t.deepEqual(JSON.parse(response.body), {error: 'Unauthorized', message: 'Invalid API key'});
});
