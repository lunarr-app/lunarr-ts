import fastify from 'fastify';
import auth from './routes/auth.js';
import users from './routes/users.js';
import {usersAccounts} from './lib/database.js';

// Fastify instance
const app = fastify({
  logger: {
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

// Root endpoint for ping
app.get<{Reply: Record<string, string>}>('/', {logLevel: 'error'}, async () => ({hello: 'world'}));

// User auth and info
app.register(auth, {prefix: 'auth'});
app.register(users, {
  prefix: 'api',
  preValidation: async (request, reply) => {
    const user = await usersAccounts.findOne({api_key: request.headers['x-api-key']}, {projection: {_id: 1}});
    if (!user) {
      reply.code(401).send({error: 'Unauthorized', message: 'Invalid API key'});
    }
  },
});

export default app;
