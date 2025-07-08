import { NextRequest, NextResponse } from 'next/server';
import { db } from 'app/db';
import { Photo } from 'app/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { photoId: string } }
) {
  const photoId = params.photoId;
  if (!photoId) {
    return new NextResponse('Missing photoId', { status: 400 });
  }
  const photo = await db.select().from(Photo).where(eq(Photo.id, Number(photoId)));
  if (!photo[0] || !photo[0].data) {
    return new NextResponse('Photo not found', { status: 404 });
  }
  // Try to guess the content type (default to jpeg)
  let contentType = 'image/jpeg';
  // Optionally, you could store the file type in the DB for more accuracy
  return new NextResponse(photo[0].data as Buffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
} 