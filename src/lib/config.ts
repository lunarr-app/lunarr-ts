import {program} from 'commander';
import {logger} from './logger.js';

interface Commands {
  port: number;
  mongodbUri: string;
  disableFastifyLogging: boolean;
}

program
  .option('-p, --port <number>', 'The port number', parseFloat, 3000)
  .option('--mongodb-uri <string>', 'The MongoDB connection URI', 'mongodb://127.0.0.1:27017/lunarr')
  .option('--disable-fastify-logging', 'Disable Fastify logging', false)
  .parse(process.argv);

// Get the parsed options
const options = program.opts<Commands>();

// Log the commander options
logger.info('Commander options:');
logger.info(options);

// Create the env object
export const env = {
  PORT: options.port,
  MONGODB_URI: options.mongodbUri,
  DISABLE_FASTIFY_LOGGING: options.disableFastifyLogging,
};
