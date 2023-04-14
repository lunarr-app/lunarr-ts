import {MongoClient} from 'mongodb';
import {env} from './config.js';
import {Static} from '@sinclair/typebox';
import {UserSchemaMongo} from '../schema/auth';
import type {MovieList} from '../types/database';

// Create a new MongoClient instance with the MongoDB URI and options
export const mongo = new MongoClient(env.MONGODB_URI, {retryWrites: true, w: 'majority'});

// Connect to the MongoDB database
await mongo.connect();

// Ping the database to verify the connection
await mongo.db().command({ping: 1});

// Export MongoDB collections as typed objects
export const usersAccounts = mongo.db().collection<Static<typeof UserSchemaMongo>>('users.accounts');
export const moviesLists = mongo.db().collection<MovieList>('movies.lists');

// Create indexes on relevant fields for improved query performance
await usersAccounts.createIndexes([
  {
    key: {username: 1},
  },
  {
    key: {api_key: 1},
  },
]);
