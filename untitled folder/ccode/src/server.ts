import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { validateEnv } from './types/env';
import { getLoggerConfig } from './utils/logger';
import { healthRoutes } from './routes/health';
import { userRoutes } from './routes/users';

const env = validateEnv();

const server = Fastify({
  logger: getLoggerConfig(env.NODE_ENV),
  trustProxy: true,
});

async function buildApp() {
  // Security plugins
  await server.register(helmet, {
    contentSecurityPolicy: env.NODE_ENV === 'production',
  });

  await server.register(cors, {
    origin: env.NODE_ENV === 'production' ? false : true,
  });

  await server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Documentation
  if (env.NODE_ENV !== 'production') {
    await server.register(swagger, {
      swagger: {
        info: {
          title: 'Fastify Drizzle API',
          description: 'Production-ready Fastify API with Drizzle ORM',
          version: '1.0.0',
        },
        host: `localhost:${env.PORT}`,
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],
      },
    });

    await server.register(swaggerUi, {
      routePrefix: '/docs',
    });
  }

  // Routes
  await server.register(healthRoutes, { prefix: '/health' });
  await server.register(userRoutes, { prefix: '/api/users' });

  // Global error handler
  server.setErrorHandler((error, request, reply) => {
    const { validation, statusCode = 500 } = error;
    
    if (validation) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Request validation failed',
        details: validation,
      });
    }

    request.log.error(error);
    
    if (env.NODE_ENV === 'production') {
      return reply.status(statusCode).send({
        error: 'Internal Server Error',
        message: 'Something went wrong',
      });
    }

    return reply.status(statusCode).send({
      error: error.name || 'Internal Server Error',
      message: error.message,
      stack: error.stack,
    });
  });

  return server;
}

async function start() {
  try {
    const app = await buildApp();
    
    await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    app.log.info(`🚀 Server listening on http://${env.HOST}:${env.PORT}`);
    
    if (env.NODE_ENV !== 'production') {
      app.log.info(`📚 Swagger docs available at http://${env.HOST}:${env.PORT}/docs`);
    }
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Gracefully shutting down...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Gracefully shutting down...');
  process.exit(0);
});

if (require.main === module) {
  start();
}

export { buildApp };