import {MongoClient} from 'mongodb';
import {env} from './config.js';
import type {UserSignupType} from '../schema/auth';

// Create the database
const mongo = new MongoClient(env.MONGODB_URI, {retryWrites: true, w: 'majority'});

// Connect the database
await mongo.connect();

// Export collections
export const usersAccounts = mongo.db().collection<UserSignupType>('users.accounts');

// Create indexes
await usersAccounts.createIndexes([
  {
    key: {username: 1},
  },
  {
    key: {email: 1},
  },
]);
