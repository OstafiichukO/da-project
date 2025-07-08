import { NextRequest, NextResponse } from 'next/server';
import { createPhoto } from 'app/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const albumId = formData.get('albumId');
    const userId = formData.get('userId');
    const caption = formData.get('caption') as string | undefined;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    if (!albumId || !userId) {
      return NextResponse.json(
        { error: 'Missing albumId or userId' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG and PNG images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Store in database
    const result = await createPhoto(
      Number(albumId),
      Number(userId),
      buffer,
      caption
    );
    const photoId = Array.isArray(result) && result.length > 0 ? result[0].id : null;
    // Return the new photo's ID
    return NextResponse.json({
      success: true,
      photoId,
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 