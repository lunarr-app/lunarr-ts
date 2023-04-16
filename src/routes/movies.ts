import {statSync, createReadStream} from 'fs';
import rangeParser from 'range-parser';
import {moviesLists} from '../lib/database.js';
import {logger} from '../lib/logger.js';
import {MovieResultsQuery, MovieResultsQueryType, MovieStreamParams, MovieStreamParamsType} from '../schema/movies.js';
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

  // Stream media file
  fastify.get<MovieStreamParamsType>(
    '/movies/:tmdb_id/stream',
    {...options, schema: MovieStreamParams},
    async (request, reply) => {
      const movie = await moviesLists.findOne({'tmdb.id': request.params.tmdb_id});
      const filePath = movie?.files.at(0);

      if (!filePath) {
        logger.error(`Movie ${request.params.tmdb_id} not found`);
        reply.status(404).send('Movie not found');
        return;
      }

      const fileStat = statSync(filePath);

      const range = request.headers.range && rangeParser(fileStat.size, request.headers.range, {combine: true});

      reply.headers({
        'Accept-Ranges': fileStat.size ? 'bytes' : 'none',
        'Content-Type': 'application/octet-stream',
        'transferMode.dlna.org': 'Streaming',
        'contentFeatures.dlna.org': 'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000',
      });

      // TODO: Add support for transcoding in the future
      logger.error('Streaming: ' + filePath);
      if (Array.isArray(range)) {
        reply
          .code(206)
          .headers({
            'Content-Length': range[0].end - range[0].start + 1,
            'Content-Range': `bytes ${range[0].start}-${range[0].end}/${fileStat.size}`,
          })
          .send(createReadStream(filePath, range[0]));
      } else {
        reply.code(200).header('Content-Length', fileStat.size).send(createReadStream(filePath));
      }
    },
  );
};

export default movies;
