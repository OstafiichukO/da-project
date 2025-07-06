import { NextRequest, NextResponse } from 'next/server';
import { createPhoto } from 'app/db';

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