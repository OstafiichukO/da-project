import { NextRequest, NextResponse } from "next/server";
import { createAlbum, getUserAlbums } from "app/db";
import { db } from "app/db";
import { Album } from "app/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) return NextResponse.json({ albums: [] });
    const albums = await getUserAlbums(Number(userId));
    return NextResponse.json({ albums });
}

export async function POST(request: NextRequest) {
    try {
        const { userId, title, description } = await request.json();

        if (!userId || !title) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const album = await createAlbum(
            typeof userId === "string" ? parseInt(userId) : userId,
            title,
            description
        );

        return NextResponse.json({
            success: true,
            album,
        });
    } catch (error) {
        console.error("Error creating album:", error);
        if (error instanceof Error) {
            return NextResponse.json(
                {
                    error: "Failed to create album",
                    details: error.message,
                    stack: error.stack,
                },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: "Failed to create album" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    const albumId = request.nextUrl.searchParams.get("albumId");
    const { title, description } = await request.json();
    if (!albumId || !title)
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    await db
        .update(Album)
        .set({ title, description })
        .where(eq(Album.id, Number(albumId)));
    return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
    try {
        const albumId = request.nextUrl.searchParams.get("albumId");
        if (!albumId) {
            return NextResponse.json(
                { error: "Missing albumId" },
                { status: 400 }
            );
        }
        await db.delete(Album).where(eq(Album.id, Number(albumId)));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting album:", error);
        return NextResponse.json(
            { error: "Failed to delete album" },
            { status: 500 }
        );
    }
}
