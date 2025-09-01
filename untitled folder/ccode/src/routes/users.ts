import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eq, desc, count } from 'drizzle-orm';
import { db } from '../db/connection';
import { users, insertUserSchema, selectUserSchema } from '../db/schema';
import { z } from 'zod';

const getUserParamsSchema = z.object({
  id: z.coerce.number().positive(),
});

const getUsersQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
});

const updateUserSchema = insertUserSchema.partial().omit({ id: true });

export async function userRoutes(fastify: FastifyInstance) {
  // Create user
  fastify.post('/', {
    schema: {
      body: insertUserSchema,
      response: {
        201: selectUserSchema,
      },
    },
  }, async (request: FastifyRequest<{ Body: z.infer<typeof insertUserSchema> }>, reply: FastifyReply) => {
    try {
      const [newUser] = await db.insert(users).values(request.body).returning();
      
      if (!newUser) {
        return reply.status(500).send({ error: 'Failed to create user' });
      }

      return reply.status(201).send(newUser);
    } catch (error) {
      fastify.log.error('Error creating user:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get all users with pagination
  fastify.get('/', {
    schema: {
      querystring: getUsersQuerySchema,
      response: {
        200: z.object({
          users: z.array(selectUserSchema),
          pagination: z.object({
            page: z.number(),
            limit: z.number(),
            total: z.number(),
            pages: z.number(),
          }),
        }),
      },
    },
  }, async (request: FastifyRequest<{ Querystring: z.infer<typeof getUsersQuerySchema> }>, reply: FastifyReply) => {
    try {
      const { page, limit } = request.query;
      const offset = (page - 1) * limit;

      const [usersList, [totalCount]] = await Promise.all([
        db.select().from(users).limit(limit).offset(offset).orderBy(desc(users.createdAt)),
        db.select({ count: count() }).from(users),
      ]);

      const totalPages = Math.ceil((totalCount?.count ?? 0) / limit);

      return reply.send({
        users: usersList,
        pagination: {
          page,
          limit,
          total: totalCount?.count ?? 0,
          pages: totalPages,
        },
      });
    } catch (error) {
      fastify.log.error('Error fetching users:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get user by ID
  fastify.get('/:id', {
    schema: {
      params: getUserParamsSchema,
      response: {
        200: selectUserSchema,
        404: z.object({ error: z.string() }),
      },
    },
  }, async (request: FastifyRequest<{ Params: z.infer<typeof getUserParamsSchema> }>, reply: FastifyReply) => {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, request.params.id));
      
      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return reply.send(user);
    } catch (error) {
      fastify.log.error('Error fetching user:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Update user
  fastify.put('/:id', {
    schema: {
      params: getUserParamsSchema,
      body: updateUserSchema,
      response: {
        200: selectUserSchema,
        404: z.object({ error: z.string() }),
      },
    },
  }, async (request: FastifyRequest<{ 
    Params: z.infer<typeof getUserParamsSchema>;
    Body: z.infer<typeof updateUserSchema>;
  }>, reply: FastifyReply) => {
    try {
      const [updatedUser] = await db
        .update(users)
        .set({ ...request.body, updatedAt: new Date() })
        .where(eq(users.id, request.params.id))
        .returning();
      
      if (!updatedUser) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return reply.send(updatedUser);
    } catch (error) {
      fastify.log.error('Error updating user:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Delete user
  fastify.delete('/:id', {
    schema: {
      params: getUserParamsSchema,
      response: {
        204: z.undefined(),
        404: z.object({ error: z.string() }),
      },
    },
  }, async (request: FastifyRequest<{ Params: z.infer<typeof getUserParamsSchema> }>, reply: FastifyReply) => {
    try {
      const [deletedUser] = await db
        .delete(users)
        .where(eq(users.id, request.params.id))
        .returning({ id: users.id });
      
      if (!deletedUser) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return reply.status(204).send();
    } catch (error) {
      fastify.log.error('Error deleting user:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}