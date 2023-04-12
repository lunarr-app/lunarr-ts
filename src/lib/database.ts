import {MongoClient} from 'mongodb';
import {env} from './config.js';
import type {UserTypeMongo} from '../schema/auth';
import type {MovieList} from '../types/database';

// Create the database
const mongo = new MongoClient(env.MONGODB_URI, {retryWrites: true, w: 'majority'});

// Connect the database
await mongo.connect();

// Export collections
export const usersAccounts = mongo.db().collection<UserTypeMongo>('users.accounts');
export const moviesLists = mongo.db().collection<MovieList>('movies.lists');

// Create indexes
await usersAccounts.createIndexes([
  {
    key: {username: 1},
  },
  {
    key: {api_key: 1},
  },
]);
