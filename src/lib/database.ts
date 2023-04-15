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

// Create a text index for improved text searching performanc
await moviesLists.createIndexes([
  {
    // Index for text search on movie titles and collection names
    key: {
      'tmdb.title': 'text',
      'tmdb.original_title': 'text',
      'tmdb.belongs_to_collection.name': 'text',
    },
    // Set name to easily drop or manage the index later
    name: 'movie_text_search_index',
    // Enable text search on case-insensitive strings with language-specific rules for English
    default_language: 'english',
    // Set weights to prioritize results based on field importance
    weights: {
      'tmdb.title': 10,
      'tmdb.original_title': 5,
      'tmdb.belongs_to_collection.name': 2,
    },
    // Set case-insensitive flag to true
    collation: {
      locale: 'en',
      strength: 2,
    },
  },
]);
