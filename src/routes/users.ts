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

  // Get user lists
  fastify.get(
    '/lists',
    {
      ...options,
      // Pre-handler to check if user is an admin
      preHandler: async (request, reply) => {
        // Get the user from the database by api key
        const user = await usersAccounts.findOne({api_key: request.headers['x-api-key']});

        // Return 401 error if user not found or not an admin
        if (user?.role !== 'admin') {
          reply.status(401).send('Unauthorized');
          return;
        }
      },
    },
    async () => {
      // Find all users in the database and exclude password hash from response
      const users = await usersAccounts
        .find(
          {},
          {
            projection: {password: 0},
          },
        )
        .toArray();

      // Return array of user objects
      return users;
    },
  );
};

export default users;
