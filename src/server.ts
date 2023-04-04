import server from './app.js';
import {env} from './lib/config.js';

try {
  // Start server
  await server.listen({port: env.PORT});
} catch (err: any) {
  console.error(err.message);
  process.exit(1);
}
