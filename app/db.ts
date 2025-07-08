import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { genSaltSync, hashSync } from 'bcrypt-ts';
import { User, Album, Photo } from './schema';

// Database connection
const client = postgres(process.env.POSTGRES_URL!);
export const db = drizzle(client);

// User functions
export async function getUser(email: string) {
  return await db.select().from(User).where(eq(User.email, email));
}

export async function createUser(email: string, name: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  return await db.insert(User).values({ 
    email, 
    name,
    password: hash 
  });
}

// Album functions
export async function createAlbum(userId: number, title: string, description?: string) {
  const result = await db.insert(Album).values({
    userId,
    title,
    description,
  }).returning();
  return result[0];
}

export async function getUserAlbums(userId: number) {
  return await db.select().from(Album).where(eq(Album.userId, userId));
}

// Photo functions
export async function createPhoto(albumId: number, userId: number, data: Buffer, caption?: string) {
  return await db.insert(Photo).values({
    albumId,
    userId,
    data,
    caption,
  }).returning({ id: Photo.id });
}

export async function getAlbumPhotos(albumId: number) {
  return await db.select().from(Photo).where(eq(Photo.albumId, albumId));
}

export async function getUserPhotos(userId: number) {
  return await db.select().from(Photo).where(eq(Photo.userId, userId));
}
