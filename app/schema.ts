import { pgTable, serial, varchar, integer, timestamp, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// User table
export const User = pgTable('User', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Album table
export const Album = pgTable('Album', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => User.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Photo table
export const Photo = pgTable('Photo', {
  id: serial('id').primaryKey(),
  albumId: integer('album_id').notNull().references(() => Album.id),
  userId: integer('user_id').notNull().references(() => User.id),
  url: varchar('url', { length: 500 }).notNull(),
  caption: text('caption'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(User, ({ many }) => ({
  albums: many(Album),
  photos: many(Photo),
}));

export const albumsRelations = relations(Album, ({ one, many }) => ({
  user: one(User, {
    fields: [Album.userId],
    references: [User.id],
  }),
  photos: many(Photo),
}));

export const photosRelations = relations(Photo, ({ one }) => ({
  album: one(Album, {
    fields: [Photo.albumId],
    references: [Album.id],
  }),
  user: one(User, {
    fields: [Photo.userId],
    references: [User.id],
  }),
})); 