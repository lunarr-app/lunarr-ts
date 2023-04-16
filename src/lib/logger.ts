import pino from 'pino';

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      levelFirst: true,
      translateTime: 'h:MM:ss TT',
    },
  },
});
