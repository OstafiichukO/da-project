"use client";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "./UserContext";
import { Toaster } from "react-hot-toast";

export default function Providers({
    children,
    user,
}: {
    children: React.ReactNode;
    user: any;
}) {
    return (
        <SessionProvider>
            <UserProvider initialUser={user}>
                <Toaster
                    position="top-right"
                    toastOptions={{ duration: 3500 }}
                />
                {children}
            </UserProvider>
        </SessionProvider>
    );
}
