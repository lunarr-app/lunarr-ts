import fastify from 'fastify';

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

export default app;
