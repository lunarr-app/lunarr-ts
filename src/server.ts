import server from './app.js';
import {env} from './lib/config.js';
import {logger} from './lib/logger.js';

try {
  // Start server
  await server.listen({port: env.PORT});
} catch (err: any) {
  logger.fatal(err);
  process.exit(1);
}
