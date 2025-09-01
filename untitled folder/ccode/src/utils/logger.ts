import type { FastifyBaseLogger } from 'fastify';

export const loggerConfig = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: {
    level: 'info',
  },
  test: {
    level: 'silent',
  },
};

export function getLoggerConfig(env: string) {
  return loggerConfig[env as keyof typeof loggerConfig] || loggerConfig.production;
}