import { NextRequest, NextResponse } from 'next/server';
import { createAlbum, getUserAlbums } from 'app/db';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ albums: [] });
  const albums = await getUserAlbums(Number(userId));
  return NextResponse.json({ albums });
}

export async function POST(request: NextRequest) {
  try {
    const { userId, title, description } = await request.json();

    if (!userId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const album = await createAlbum(
      parseInt(userId),
      title,
      description
    );

    return NextResponse.json({
      success: true,
      album
    });

  } catch (error) {
    console.error('Error creating album:', error);
    return NextResponse.json(
      { error: 'Failed to create album' },
      { status: 500 }
    );
  }
} 