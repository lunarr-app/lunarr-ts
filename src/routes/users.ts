import {usersAccounts} from '../lib/database.js';
import type {FastifyInstance, RouteShorthandOptions} from 'fastify';

const users = async (fastify: FastifyInstance, options: RouteShorthandOptions) => {
  fastify.get('/me', options, async (res) => {
    const user = await usersAccounts.findOne(
      {api_key: res.headers['x-api-key']},
      {
        projection: {password: 0}, // emit password hash
      },
    );
    return user;
  });
};

export default users;
