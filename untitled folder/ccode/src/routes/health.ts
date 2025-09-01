import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { checkDatabaseHealth } from '../db/connection';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    });
  });

  fastify.get('/ready', async (request: FastifyRequest, reply: FastifyReply) => {
    const isDatabaseHealthy = await checkDatabaseHealth();
    
    if (!isDatabaseHealthy) {
      return reply.status(503).send({
        status: 'error',
        message: 'Database connection failed',
        timestamp: new Date().toISOString(),
      });
    }

    return reply.send({
      status: 'ready',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  });

  fastify.get('/live', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      status: 'alive',
      timestamp: new Date().toISOString(),
    });
  });
}