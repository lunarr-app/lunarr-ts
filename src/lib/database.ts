import {MongoClient} from 'mongodb';
import {env} from './config.js';
import {Static} from '@sinclair/typebox';
import {UserSchemaMongo} from '../schema/auth';
import type {MovieList, TvShowsList} from '../types/database';
import {logger} from './logger.js';

logger.info('Creating new MongoClient instance');
export const mongo = new MongoClient(env.MONGODB_URI, {retryWrites: true, w: 'majority'});

logger.info(`Connecting to MongoDB database at ${env.MONGODB_URI}`);
await mongo.connect();

// Ping the database to verify the connection
logger.info('Pinging MongoDB database');
await mongo.db().command({ping: 1});

logger.info('Exporting MongoDB collections as typed objects');
export const usersAccounts = mongo.db().collection<Static<typeof UserSchemaMongo>>('users.accounts');
export const moviesLists = mongo.db().collection<MovieList>('movies.lists');
export const tvShowsLists = mongo.db().collection<TvShowsList>('tv_shows.lists');

logger.info('Creating indexes on relevant fields for improved query performance');
await usersAccounts.createIndexes([
  {
    key: {username: 1},
  },
  {
    key: {api_key: 1},
  },
]);

logger.info('Creating text indexes for improved searching performance');
await moviesLists.createIndexes([
  {
    // Index for text search on movie titles and collection names
    key: {
      'tmdb.title': 'text',
      'tmdb.original_title': 'text',
      'tmdb.belongs_to_collection.name': 'text',
      files: 'text',
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
      files: 1,
    },
  },
]);
await tvShowsLists.createIndexes([
  {
    // Index for text search on TV show titles and tagline
    key: {
      'tmdb.name': 'text',
      'tmdb.original_name': 'text',
      'tmdb.tagline': 'text',
      files: 'text',
    },
    // Set a name for easy management or removal of the index later
    name: 'tvshow_text_search_index',
    // Enable text search on case-insensitive strings with language-specific rules for English
    default_language: 'english',
    // Set weights to prioritize results based on field importance
    weights: {
      'tmdb.name': 10,
      'tmdb.original_name': 5,
      'tmdb.tagline': 2,
      files: 1,
    },
  },
]);
