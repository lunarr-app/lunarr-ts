import {cleanEnv, num} from 'envalid';
import * as dotenv from 'dotenv';

// load env
dotenv.config();

export const env = cleanEnv(process.env, {
  PORT: num({default: 3000}),
});
