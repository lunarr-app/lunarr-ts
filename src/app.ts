import fastify, {FastifyRequest, FastifyReply} from 'fastify';
import swagger from '@fastify/swagger';
import swaggerui from '@fastify/swagger-ui';
import auth from './routes/auth.js';
import users from './routes/users.js';
import movies from './routes/movies.js';
import {usersAccounts} from './lib/database.js';
import {RootEndointSchema, RootEndointType} from './schema/root.js';
import {env} from './lib/config.js';

const preValidation = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = await usersAccounts.findOne({api_key: request.headers['x-api-key']}, {projection: {_id: 1}});
  if (!user) {
    reply.code(401).send({error: 'Unauthorized', message: 'Invalid API key'});
  }
};

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
      apiKey: {
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
app.get<{Reply: RootEndointType}>(
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
  preValidation,
});

// Movies endpoint
app.register(movies, {
  prefix: 'media',
  preValidation,
});

export default app;
