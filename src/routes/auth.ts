import {v4 as uuidv4} from 'uuid';
import argon2 from 'argon2';
import dayjs from 'dayjs';
import {usersAccounts} from '../lib/database.js';
import {RESTRICTED_USERNAMES} from '../lib/username.js';
import {UserLogin, UserLoginType, UserSignup, UserSignupType} from '../schema/auth.js';
import type {FastifyInstance} from 'fastify';

// Create user index for faster query performance
// Strength 2 means case insensitive search
const collation = {locale: 'en', strength: 2};

const auth = async (fastify: FastifyInstance) => {
  // User login
  fastify.post<UserLoginType>('/login', {schema: UserLogin}, async (req, reply) => {
    const user = await usersAccounts.findOne({username: req.body.username}, {collation});

    // Check if the user exists and password is valid
    if (user && (await argon2.verify(user.password, req.body.password))) {
      return {api_key: user.api_key};
    }

    // Return 401 Unauthorized error if invalid credentials
    return reply.unauthorized('Invalid username or password');
  });

  // User signup
  fastify.post<UserSignupType>('/signup', {schema: UserSignup}, async (req, reply) => {
    const user = await usersAccounts.findOne({username: req.body.username}, {collation});

    // Check if the user already exists
    if (user) {
      return reply.conflict('An user already exists with that username.');
    }

    // Check if the username is restricted
    if (RESTRICTED_USERNAMES.includes(req.body.username.toLowerCase())) {
      return reply.conflict('Username is not allowed. Please choose a different username.');
    }

    // Hash the user password and insert into the database
    const passwordHash = await argon2.hash(req.body.password);
    const totalUsers = await usersAccounts.countDocuments(); // Get the total number of users in the database
    const timeNowIso = dayjs().toISOString();

    await usersAccounts.insertOne({
      ...req.body,
      role: totalUsers === 0 ? 'admin' : 'subscriber', // If this is the first user, set the role to admin, otherwise set it to subscriber
      api_key: uuidv4(),
      created_at: timeNowIso,
      last_seen_at: timeNowIso,
      current_status: 'active',
      password: passwordHash, // Store the password hash in the database
    });

    // Return a success message
    reply.status(201).send('User created successfully.');
  });
};

export default auth;
