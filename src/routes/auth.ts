import type {FastifyInstance} from 'fastify';
import {UserLoginSchema, UserLoginType, UserSignupSchema, UserSignupType} from '../schema/auth.js';

const auth = async (fastify: FastifyInstance) => {
  // User login
  fastify.post<{Body: UserLoginType}>('/login', {schema: {body: UserLoginSchema}}, async (res, reply) => {
    // To-do
    reply.code(401).send('Invalid credentials');
  });

  // User signup
  fastify.post<{Body: UserSignupType}>('/signup', {schema: {body: UserSignupSchema}}, async (res, reply) => {
    // To-do
    reply.code(201).send('created');
  });
};

export default auth;
