import fastify from 'fastify';
import jwt from '@fastify/jwt';
import auth from './routes/auth.js';
import {env} from './lib/config.js';

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

// Register json web token
app.register(jwt, {
  secret: env.JWT_SECRET,
  sign: {expiresIn: '30d'},
});

// Root endpoint for ping
app.get<{Reply: Record<string, string>}>('/', {logLevel: 'error'}, async () => ({hello: 'world'}));

// User auth
app.register(auth, {prefix: 'auth'});

export default app;
