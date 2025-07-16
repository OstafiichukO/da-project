"use client";
import React, { createContext, useContext, useState } from "react";

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
