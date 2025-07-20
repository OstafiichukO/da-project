"use server";
import { signOut, signIn } from "./auth";
import { redirect } from "next/navigation";
import { createUser, getUser } from "../db";

export const handleSignOut = async () => {
    try {
        await signOut({ redirectTo: "/" });
    } catch (error) {
        console.error("SignOut error:", error);
        throw error;
    }
};

export const handleSignIn = async (formData: FormData) => {
    await signIn("credentials", {
        redirectTo: "/gallery",
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    });
};

export const handleRegister = async (formData: FormData) => {
    let email = formData.get("email") as string;
    let name = formData.get("name") as string;
    let password = formData.get("password") as string;
    if (!email || !name || !password) {
        throw new Error("All fields are required");
    }
    let user = await getUser(email);
    if (user.length > 0) {
        return "User already exists";
    } else {
        await createUser(email, name, password);
        // Sign in the user after registration
        await signIn("credentials", {
            redirectTo: "/gallery",
            email,
            password,
        });
    }
    // const response = await fetch(
    //     `${process.env.NEXT_PUBLIC_BASE_URL}/api/register`,
    //     {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ email, name, password }),
    //     }
    // );

    // if (!response.ok) {
    //     throw new Error("Failed to register");
    // }

    // Sign in the user after registration
    // await signIn("credentials", {
    //     redirectTo: "/gallery",
    //     email,
    //     password,
    // });
};
