import {cleanEnv, str, num, bool} from 'envalid';
import * as dotenv from 'dotenv';

// load env
dotenv.config();

export const env = cleanEnv(process.env, {
  PORT: num({default: 3000}),
  MONGODB_URI: str({default: 'mongodb://127.0.0.1:27017/lunarr'}),
  DISABLE_FASTIFY_LOGGING: bool({default: false}),
});
