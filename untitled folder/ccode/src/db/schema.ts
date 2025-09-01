import { pgTable, serial, varchar, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  bio: text('bio'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
  nameIdx: index('name_idx').on(table.name),
}));

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  authorId: serial('author_id').references(() => users.id).notNull(),
  published: boolean('published').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  authorIdx: index('author_idx').on(table.authorId),
  publishedIdx: index('published_idx').on(table.published),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  name: z.string().min(1, 'Name is required').max(255),
  bio: z.string().max(1000).optional(),
});

export const selectUserSchema = createSelectSchema(users);

export const insertPostSchema = createInsertSchema(posts, {
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().min(1, 'Content is required'),
});

export const selectPostSchema = createSelectSchema(posts);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;