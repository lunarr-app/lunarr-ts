import argon2 from 'argon2';
import {usersAccounts} from '../lib/database.js';
import {Static} from '@sinclair/typebox';
import {UserUpdateSchema} from '../schema/auth.js';
import type {FastifyInstance, RouteShorthandOptions} from 'fastify';

const users = async (fastify: FastifyInstance, options: RouteShorthandOptions) => {
  // Get all users
  fastify.get(
    '/',
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

  // User data update
  fastify.put<{Body: Static<typeof UserUpdateSchema>}>(
    '/me',
    {schema: {body: UserUpdateSchema}},
    async (request, reply) => {
      // Find the user based on the API key provided in the request header
      const user = await usersAccounts.findOne({api_key: request.headers['x-api-key']});

      // If the user is not found, return a 404 error
      if (!user) {
        reply.status(404).send('User not found');
        return;
      }

      // Update the user data based on the values provided in the request body
      user.displayname = request.body.displayname || user.displayname;
      user.sex = request.body.sex || user.sex;

      // If a new password is provided, hash it and update the user's password
      if (request.body.password) {
        const passwordHash = await argon2.hash(request.body.password);
        user.password = passwordHash;
      }

      // Update the user's data in the database
      await usersAccounts.updateOne({_id: user._id}, {$set: user});

      // Return a success message with the updated user data (excluding the password)
      const {password, ...updatedUser} = user;
      reply.send({message: 'User data updated.', user: updatedUser});
    },
  );
};

export default users;
