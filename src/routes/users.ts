import {usersAccounts} from '../lib/database.js';
import type {FastifyInstance, RouteShorthandOptions} from 'fastify';

const users = async (fastify: FastifyInstance, options: RouteShorthandOptions) => {
  // Get user by api key
  fastify.get('/me', options, async (res, reply) => {
    // Get the user from the database by api key
    const user = await usersAccounts.findOne(
      {api_key: res.headers['x-api-key']},
      {
        projection: {password: 0}, // Exclude password hash from response
      },
    );

    if (!user) {
      // Return 404 error if user not found
      reply.status(404).send('User not found');
      return;
    }

    // Return user object if found
    return user;
  });
};

export default users;
