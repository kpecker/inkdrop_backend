import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { loginAction, registerAction } from '../../service/auth';


export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', loginAction);
  fastify.post('/register', (request: FastifyRequest, reply: FastifyReply) => registerAction(request, reply));
}
