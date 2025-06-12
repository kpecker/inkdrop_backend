import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { loginAction } from "../../service/auth";


export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', loginAction) ;
}