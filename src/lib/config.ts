import {cleanEnv, str, num, bool} from 'envalid';
import * as dotenv from 'dotenv';
import {logger} from './logger.js';

logger.info('Loading environment variables');
dotenv.config();

// Clean and validate environment variables with envalid
export const env = cleanEnv(process.env, {
  PORT: num({default: 3000}),
  MONGODB_URI: str({default: 'mongodb://127.0.0.1:27017/lunarr'}),
  DISABLE_FASTIFY_LOGGING: bool({default: false}),
});

logger.info('Environment variables loaded and validated successfully');
