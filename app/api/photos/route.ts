import { NextRequest, NextResponse } from 'next/server';
import { createPhoto, getAlbumPhotos } from 'app/db';
import { db } from 'app/db';
import { Photo } from 'app/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const photoId = request.nextUrl.searchParams.get('photoId');
  if (photoId) {
    // Fetch a single photo by ID
    const photo = await db.select().from(Photo).where(eq(Photo.id, Number(photoId)));
    return NextResponse.json({ photo: photo[0] || null });
  }
  const albumId = request.nextUrl.searchParams.get('albumId');
  if (!albumId) return NextResponse.json({ photos: [] });
  const photos = await getAlbumPhotos(Number(albumId));
  return NextResponse.json({ photos });
}

export async function POST(request: NextRequest) {
  try {
    const { albumId, userId, url, caption } = await request.json();

    if (!albumId || !userId || !url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const photo = await createPhoto(
      parseInt(albumId),
      parseInt(userId),
      url,
      caption
    );

    return NextResponse.json({
      success: true,
      photo
    });

  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json(
      { error: 'Failed to create photo' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const photoId = request.nextUrl.searchParams.get('photoId');
  if (!photoId) return NextResponse.json({ error: 'Missing photoId' }, { status: 400 });
  await db.delete(Photo).where(eq(Photo.id, Number(photoId)));
  return NextResponse.json({ success: true });
} 