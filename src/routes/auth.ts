import {v4 as uuidv4} from 'uuid';
import argon2 from 'argon2';
import dayjs from 'dayjs';
import {usersAccounts} from '../lib/database.js';
import {RESTRICTED_USERNAMES} from '../lib/username.js';
import {UserLoginSchema, UserLoginType, UserSignupSchema, UserSignupType} from '../schema/auth.js';
import type {FastifyInstance} from 'fastify';

/**
 * Create user index for faster query performance
 * Strength 2 means case insensitive search
 */
const collation = {locale: 'en', strength: 2};

const auth = async (fastify: FastifyInstance) => {
  // User login
  fastify.post<{Body: UserLoginType}>('/login', {schema: {body: UserLoginSchema}}, async (res, reply) => {
    const user = await usersAccounts.findOne({username: res.body.username}, {collation});
    if (user) {
      const isValidPass = await argon2.verify(user.password, res.body.password);
      if (isValidPass) {
        return {api_key: user.api_key};
      }
    }

    reply.code(401).send('Invalid credentials');
  });

  // User signup
  fastify.post<{Body: UserSignupType}>('/signup', {schema: {body: UserSignupSchema}}, async (res, reply) => {
    const user = await usersAccounts.findOne({username: res.body.username}, {collation});
    if (user) {
      reply.code(409).send('An user already exists with that username.');
      return;
    }

    if (RESTRICTED_USERNAMES.includes(res.body.username.toLowerCase())) {
      reply.code(409).send('Username forbidden. Try different usernames.');
      return;
    }

    const totalUsers = await usersAccounts.countDocuments();
    const timeNowIso = dayjs().toISOString();

    res.body.password = await argon2.hash(res.body.password);
    const created = await usersAccounts.insertOne({
      ...res.body,
      role: totalUsers === 0 ? 'admin' : 'subscriber',
      api_key: uuidv4(),
      created_at: timeNowIso,
      last_seen_at: timeNowIso,
      current_status: 'active',
    });
    reply.code(201).send(created);
  });
};

export default auth;
