import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { usersTable } from '../../db/schema';
import { User } from '../../infra/models/User';
import { Value } from '@sinclair/typebox/value';
import { createInsertSchema } from 'drizzle-typebox';
import { FastifyReply, FastifyRequest } from 'fastify';
import { eq } from 'drizzle-orm';

const bcrypt = require('bcrypt');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client);


export async function loginAction(request: FastifyRequest<{ Body: User }>,
  reply: FastifyReply
) {

  const users = await db.select().from(usersTable).where(eq(usersTable.email, request.body.email));
  const user = users[0];

  if (!user) {
    return reply.status(401).send({ error: 'Invalid email' });
  }
  const result = await bcrypt.compare(request.body.password, user.password);
  if (result === false) {
    return reply.status(401).send({ error: 'Invalid password' });
  }

  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword };
}

export async function registerAction(request: FastifyRequest, reply: FastifyReply) {
  const userInsertSchema = createInsertSchema(usersTable);

  const parsed: User = Value.Parse(userInsertSchema, request.body);
  const hashedPassword = await bcrypt.hash(parsed.password, 10);

  parsed.password = hashedPassword;

  const insertedUser = await db.insert(usersTable).values(parsed);
  return { user: insertedUser };
}

export async function uploadProfilePicture() {
  const users = await db.select().from(usersTable);
  console.log(users);
  return { users: users };
}
