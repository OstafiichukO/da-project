"use client";
import "./i18n";
import { useTranslation } from "react-i18next";

export function Form({
    action,
    children,
    showNameField = false,
}: {
    action: any;
    children: React.ReactNode;
    showNameField?: boolean;
}) {
    const { t } = useTranslation("common");
    return (
        <form
            action={action}
            className="flex flex-col space-y-4 bg-[var(--color-blue)] px-4 py-8 sm:px-16"
        >
            <div>
                <label htmlFor="email" className="block text-xs uppercase">
                    {t("email")}
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    autoComplete="email"
                    required
                    className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm text-black"
                />
            </div>
            {showNameField && (
                <div>
                    <label htmlFor="name" className="block text-xs uppercase">
                        {t("fullName")}
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder={t("fullNamePlaceholder")}
                        autoComplete="name"
                        required
                        className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm text-black"
                    />
                </div>
            )}
            <div>
                <label htmlFor="password" className="block text-xs uppercase">
                    {t("password")}
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    required
                    className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm text-black"
                />
            </div>
            {children}
        </form>
    );
}
