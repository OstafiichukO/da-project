"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type User = {
    id: string;
    email: string;
    name: string;
} | null;

interface UserContextType {
    user: User;
    setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
    initialUser,
    children,
}: {
    initialUser: User;
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User>(initialUser);

    // Sync user state with server session
    useEffect(() => {
        const syncUser = async () => {
            try {
                const response = await fetch("/api/auth/session");
                if (response.ok) {
                    const session = await response.json();
                    console.log("Session sync result:", session); // Debug log
                    if (session.user) {
                        setUser(session.user);
                    } else {
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error("Failed to sync user state:", error);
            }
        };

        // Sync on mount and after navigation
        syncUser();

        // Listen for auth state changes
        const handleStorageChange = () => {
            syncUser();
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within a UserProvider");
    return ctx;
}
