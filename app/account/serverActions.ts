"use server";
import { db } from "../db";
import { User } from "../schema";
import { eq } from "drizzle-orm";
import { auth } from "../auth/auth";

export async function updateUserName(formData: FormData) {
    const session = await auth();
    const user = session?.user as {
        id: string;
        email: string;
        name: string;
    } | null;
    if (!user) {
        return { error: "Not authenticated" };
    }
    const name = formData.get("name") as string;
    if (!name || name.length < 2) {
        return { error: "Name is too short" };
    }
    try {
        await db
            .update(User)
            .set({ name })
            .where(eq(User.id, Number(user.id)));
        return { success: true };
    } catch (e) {
        return { error: "Failed to update name" };
    }
}
