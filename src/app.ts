import fastify from 'fastify';
import sensible from '@fastify/sensible';
import swagger from '@fastify/swagger';
import swaggerui from '@fastify/swagger-ui';
import {Static} from '@sinclair/typebox';

import auth from './routes/auth.js';
import users from './routes/users.js';
import movies from './routes/movies.js';
import tvShows from './routes/tv-shows.js';

import {RootEndpointSchema} from './schema/root.js';
import {SCHEMA_SECURITY} from './schema/common.js';
import {isValidApiKey} from './routes/util.js';

import {env} from './lib/config.js';
import {logger} from './lib/logger.js';

// Fastify instance
const app = fastify({
  logger: env.DISABLE_FASTIFY_LOGGING
    ? false
    : {
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
              remoteAddress: req.headers['x-forwarded-for'] || (req as any).ip,
            };
          },
        },
        transport: {
          target: 'pino-pretty',
          options: {
            levelFirst: true,
            translateTime: 'h:MM:ss TT',
            errorProps: 'message',
            ignore: 'pid,hostname,req,reqId,err,res,responseTime',
            messageFormat: 'fastify {req.method} {res.statusCode} {req.remoteAddress} {req.url} {msg}',
          },
        },
      },
});

// Register swagger to generate openapi specs
logger.info('Registering swagger and swagger UI');
await app.register(swagger, {
  swagger: {
    info: {
      title: 'Lunarr',
      description: 'swagger api specs',
      version: '0.0.1',
    },
    securityDefinitions: {
      ApiKeyAuth: {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      },
    },
  },
});
await app.register(swaggerui, {
  routePrefix: '/documentation',
});

// Register sensible plugin
logger.info('Registering sensible plugin');
await app.register(sensible);

// Root endpoint for ping
app.get<{Reply: Static<typeof RootEndpointSchema>}>(
  '/',
  {
    logLevel: 'error',
    schema: {
      response: {
        200: RootEndpointSchema,
      },
    },
  },
  async () => ({hello: 'world'}),
);

// User auth and info
logger.info('Registering auth and users routes');
app.register(auth, {prefix: 'auth'});
app.register(users, {
  prefix: 'users',
  schema: SCHEMA_SECURITY,
  preValidation: isValidApiKey,
});

// Media endpoints
logger.info('Registering media routes');
app.register(movies, {
  prefix: 'media/movies',
  preValidation: isValidApiKey,
});
app.register(tvShows, {
  prefix: 'media/tv-shows',
  preValidation: isValidApiKey,
});

logger.info('All endpoints registered successfully');

export default app;
