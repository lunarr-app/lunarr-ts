import {Static} from '@sinclair/typebox';
import {moviesLists} from '../lib/database.js';
import {MovieResultsQuerySchema} from '../schema/movies.js';
import type {FastifyInstance, RouteShorthandOptions} from 'fastify';

const movies = async (fastify: FastifyInstance, options: RouteShorthandOptions) => {
  // Get movie lists with pagination
  fastify.get<{Querystring: Static<typeof MovieResultsQuerySchema>}>(
    '/movies',
    {...options, schema: {querystring: MovieResultsQuerySchema}},
    async (req) => {
      // Extract query parameters using destructuring
      const {limit, page} = req.query;

      // Find movies in the database
      const totalMovies = await moviesLists.countDocuments();
      const movieList = await moviesLists
        .find()
        .skip(page > 0 ? (page - 1) * limit : 0)
        .limit(limit)
        .toArray();

      // Return  movies
      return {
        results: movieList,
        page: page,
        total: Math.ceil(totalMovies / limit),
      };
    },
  );
};

export default movies;
