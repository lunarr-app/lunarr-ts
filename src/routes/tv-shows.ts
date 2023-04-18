import type {FastifyInstance, RouteShorthandOptions} from 'fastify';

const tvShows = async (fastify: FastifyInstance, options: RouteShorthandOptions) => {
  // Get tv show lists with pagination and search
  fastify.get('/', options, async () => {
    return {to: 'do'};
  });
};

export default tvShows;
