import {moviesLists} from '../lib/database.js';
import {MovieResultsQuery, MovieResultsQueryType} from '../schema/movies.js';
import type {FastifyInstance, RouteShorthandOptions} from 'fastify';

const movies = async (fastify: FastifyInstance, options: RouteShorthandOptions) => {
  // Get movie lists with pagination and search
  fastify.get<MovieResultsQueryType>('/movies', {...options, schema: MovieResultsQuery}, async (req) => {
    // Extract query parameters using destructuring
    const {limit, page, query} = req.query;

    // Build query object based on search query
    const search = query
      ? {
          $text: {
            $search: query,
            $caseSensitive: false,
          },
        }
      : {};

    // Find movies in the database based on query and pagination
    const totalMovies = await moviesLists.countDocuments(search);
    const movieList = await moviesLists
      .find(search)
      .skip(page > 0 ? (page - 1) * limit : 0)
      .limit(limit)
      .toArray();

    // Return movies
    return {
      results: movieList,
      limit,
      page,
      total: Math.ceil(totalMovies / limit),
    };
  });
};

export default movies;
