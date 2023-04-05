import type {FastifyInstance} from 'fastify';
import {usersAccounts} from '../lib/database.js';
import {UserLoginSchema, UserLoginType, UserSignupSchema, UserSignupType} from '../schema/auth.js';

/**
 * Create user index for faster query performance
 * Strength 2 means case insensitive search
 */
const collation = {locale: 'en', strength: 2};

const auth = async (fastify: FastifyInstance) => {
  // User login
  fastify.post<{Body: UserLoginType}>('/login', {schema: {body: UserLoginSchema}}, async (res, reply) => {
    // To-do
    reply.code(401).send('Invalid credentials');
  });

  // User signup
  fastify.post<{Body: UserSignupType}>('/signup', {schema: {body: UserSignupSchema}}, async (res, reply) => {
    res.body.email = res.body.email.toLowerCase(); // ensure email is in lower case
    const user = await usersAccounts.findOne(
      {$or: [{email: res.body.email}, {username: res.body.username}]}, // find user by either email or username
      {collation},
    );
    if (user || res.body.username.toLowerCase().trim() === 'ghost') {
      reply.code(409).send('User already exists with that username or email.');
      return;
    }

    const created = await usersAccounts.insertOne(res.body);
    reply.code(201).send(created);
  });
};

export default auth;
