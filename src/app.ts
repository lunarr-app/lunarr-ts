import fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerui from '@fastify/swagger-ui';
import {Static} from '@sinclair/typebox';
import auth from './routes/auth.js';
import users from './routes/users.js';
import movies from './routes/movies.js';
import {RootEndointSchema} from './schema/root.js';
import {SCHEMA_SECUIRTY} from './schema/auth.js';
import {isValidApiKey} from './routes/util.js';
import {env} from './lib/config.js';

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
              remoteAddress: req.headers['X-Forwarded-For'] || (req as any).ip,
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
            messageFormat: '{req.method} {res.statusCode} {req.remoteAddress} {req.url} {msg}',
          },
        },
      },
});

// Register swagger to generate openapi specs
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

// Root endpoint for ping
app.get<{Reply: Static<typeof RootEndointSchema>}>(
  '/',
  {
    logLevel: 'error',
    schema: {
      response: {
        200: RootEndointSchema,
      },
    },
  },
  async () => ({hello: 'world'}),
);

// User auth and info
app.register(auth, {prefix: 'auth'});
app.register(users, {
  prefix: 'users',
  schema: SCHEMA_SECUIRTY,
  preValidation: isValidApiKey,
});

// Movies endpoint
app.register(movies, {
  prefix: 'media',
  preValidation: isValidApiKey,
});

export default app;
