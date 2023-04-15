import {usersAccounts} from '../lib/database.js';
import type {FastifyReply, FastifyRequest} from 'fastify';

// Pre-handler to check if user is an admin
export const isAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  // Get user role
  const user = await usersAccounts.findOne({api_key: request.headers['x-api-key']}, {projection: {role: 1}});

  // Return 401 error if user not found or not an admin
  if (!user || user.role !== 'admin') {
    reply.status(401).send({error: 'Unauthorized', message: 'Invalid API key'});
    return;
  }
};

export const isValidApiKey = async (request: FastifyRequest, reply: FastifyReply) => {
  // Retrieve user id
  const user = await usersAccounts.findOne({api_key: request.headers['x-api-key']}, {projection: {_id: 1}});
  if (!user) {
    reply.code(401).send({error: 'Unauthorized', message: 'Invalid API key'});
  }
};
