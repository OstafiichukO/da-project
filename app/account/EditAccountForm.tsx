"use client";
import { useState, useTransition } from "react";
import { updateUserName } from "./serverActions";
import { useUser } from "../components/UserContext";
import { toast } from "react-hot-toast";

export default function EditAccountForm({
    user,
}: {
    user: { id: string; email: string; name: string };
}) {
    const [name, setName] = useState(user.name);
    const [isPending, startTransition] = useTransition();
    const { setUser } = useUser();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            const result = await updateUserName(formData);
            if (result.success) {
                toast.success("Profile updated successfully.");
                setUser({ ...user, name });
            } else {
                toast.error(result.error || "Failed to update profile.");
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Full Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
                />
            </div>
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    disabled
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-500 shadow-sm sm:text-sm"
                />
            </div>
            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[var(--color-blue)] text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isPending ? "Saving..." : "Save Changes"}
            </button>
        </form>
    );
}
