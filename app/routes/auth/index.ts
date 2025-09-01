import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getUsers, loginAction, registerAction } from '../../service/auth';


export async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/user', getUsers);
  fastify.post('/login', getUsers);
  fastify.post('/register', (request: FastifyRequest, reply: FastifyReply) => registerAction(request, reply));
}
