import { pgTable, serial, varchar, integer, timestamp, text, customType } from 'drizzle-orm/pg-core';
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

// Custom bytea type for binary data
const bytea = customType<{ data: Buffer }>({
  dataType() {
    return 'bytea';
  },
});

// Photo table
export const Photo = pgTable('Photo', {
  id: serial('id').primaryKey(),
  albumId: integer('album_id').notNull().references(() => Album.id),
  userId: integer('user_id').notNull().references(() => User.id),
  data: bytea('data').notNull(), // Store image binary data
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