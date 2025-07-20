import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/auth";
import { compare, hash } from "bcrypt-ts";
import { db } from "../../db";
import { User } from "../../schema";
import { eq } from "drizzle-orm";

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        console.log("Session:", session); // Debug log

        if (!session?.user?.id) {
            console.log("No session or user ID"); // Debug log
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        console.log("Request body:", body); // Debug log

        const { name, email, currentPassword, newPassword } = body;

        // Get current user data
        const currentUser = await db
            .select()
            .from(User)
            .where(eq(User.id, parseInt(session.user.id)))
            .limit(1);

        console.log("Current user from DB:", currentUser); // Debug log

        if (currentUser.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const user = currentUser[0];

        // Validate current password if changing password
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json(
                    { error: "Current password is required" },
                    { status: 400 }
                );
            }

            const isValidPassword = await compare(
                currentPassword,
                user.password!
            );
            if (!isValidPassword) {
                return NextResponse.json(
                    { error: "Current password is incorrect" },
                    { status: 400 }
                );
            }
        }

        // Check if email is already taken by another user
        if (email !== user.email) {
            const existingUser = await db
                .select()
                .from(User)
                .where(eq(User.email, email))
                .limit(1);

            if (existingUser.length > 0) {
                return NextResponse.json(
                    { error: "Email is already taken" },
                    { status: 400 }
                );
            }
        }

        // Prepare update data
        const updateData: any = {
            name,
            email,
        };

        // Hash new password if provided
        if (newPassword) {
            updateData.password = await hash(newPassword, 10);
        }

        console.log("Update data:", updateData); // Debug log

        // Update user in database
        await db
            .update(User)
            .set(updateData)
            .where(eq(User.id, parseInt(session.user.id)));

        // Return updated user data (without password)
        const updatedUser = {
            id: session.user.id,
            name,
            email,
        };

        console.log("Updated user:", updatedUser); // Debug log

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
