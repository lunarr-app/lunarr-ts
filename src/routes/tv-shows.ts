import {tvShowsLists} from '../lib/database.js';
import {TVShowResultsQuery, TVShowResultsQueryType} from '../schema/tv-show.js';
import type {FastifyInstance, RouteShorthandOptions} from 'fastify';
import type {TvShowsList} from '../types/database';

const tvShows = async (fastify: FastifyInstance, options: RouteShorthandOptions) => {
  // Get TV show lists with pagination and search
  fastify.get<TVShowResultsQueryType>('/', {...options, schema: TVShowResultsQuery}, async (req) => {
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

    // Find TV shows in the database based on query and pagination
    const totalShows = await tvShowsLists.countDocuments(search);
    const showList = await tvShowsLists
      .find(search)
      .project<Pick<TvShowsList, 'show'>>({show: 1})
      .skip(page > 0 ? (page - 1) * limit : 0)
      .limit(limit)
      .toArray();

    // Return TV shows
    return {
      results: showList,
      limit,
      page,
      total: Math.ceil(totalShows / limit),
    };
  });
};

export default tvShows;
