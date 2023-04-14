import {moviesLists} from '../lib/database.js';
import {MovieResultsQuerySchema, MovieResultsQueryType} from '../schema/movies.js';
import type {FastifyInstance, RouteShorthandOptions} from 'fastify';

const movies = async (fastify: FastifyInstance, options: RouteShorthandOptions) => {
  // Get movie lists with pagination
  fastify.get<{Querystring: MovieResultsQueryType}>(
    '/movies',
    {...options, schema: {querystring: MovieResultsQuerySchema}},
    async (req) => {
      // Extract query parameters using destructuring
      const {limit, page} = req.query;

      // Find movies in the database
      const movieList = await moviesLists
        .find()
        .skip(page > 0 ? (page - 1) * limit : 0)
        .limit(limit)
        .toArray();

      // Return array of movies
      return movieList;
    },
  );
};

export default movies;
