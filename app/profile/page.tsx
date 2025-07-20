"use client";
import "../i18n";
import { useTranslation } from "react-i18next";
import { useUser } from "../components/UserContext";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { t } = useTranslation("common");
    const { user, setUser } = useUser();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Initialize form data when user is available
    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.name,
                email: user.email,
            }));
        }
    }, [user]);

    if (!user) {
        router.push("/login");
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (
            formData.newPassword &&
            formData.newPassword !== formData.confirmPassword
        ) {
            toast.error(t("passwordsDoNotMatch"));
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setUser(result.user);
                setIsEditing(false);
                setFormData((prev) => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                }));
                toast.success(t("profileUpdated"));
            } else {
                toast.error(result.error || t("updateFailed"));
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error(t("updateFailed"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-light)] pt-20">
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {t("profile")}
                        </h1>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            disabled={isLoading}
                            className="px-4 py-2 bg-[var(--color-blue)] text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                            type="button"
                        >
                            {isEditing ? t("cancel") : t("edit")}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t("fullName")}
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={!isEditing || isLoading}
                                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-black"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t("email")}
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!isEditing || isLoading}
                                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-black"
                                required
                            />
                        </div>

                        {isEditing && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t("currentPassword")}
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                        placeholder={t(
                                            "currentPasswordPlaceholder"
                                        )}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t("newPassword")}
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                        placeholder={t(
                                            "newPasswordPlaceholder"
                                        )}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t("confirmPassword")}
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                        placeholder={t(
                                            "confirmPasswordPlaceholder"
                                        )}
                                    />
                                </div>
                            </>
                        )}

                        {isEditing && (
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-[var(--color-blue)] text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {isLoading ? t("saving") : t("saveChanges")}
                                </button>
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            name: user.name,
                                            email: user.email,
                                            currentPassword: "",
                                            newPassword: "",
                                            confirmPassword: "",
                                        });
                                    }}
                                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition disabled:opacity-50"
                                >
                                    {t("cancel")}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
