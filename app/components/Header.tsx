"use client";
import "../i18n";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Link from "next/link";
import { useUser } from "./UserContext";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "uk", label: "Українська", flag: "🇺🇦" },
];

function LanguageSwitcher() {
    const { i18n, t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(i18n.language);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // On mount, sync with localStorage
        const storedLang = localStorage.getItem("lang");
        if (storedLang && storedLang !== i18n.language) {
            i18n.changeLanguage(storedLang);
            setSelected(storedLang);
        }
    }, []);

    const handleChange = (lang: string) => {
        i18n.changeLanguage(lang);
        setSelected(lang);
        localStorage.setItem("lang", lang);
        setOpen(false);
    };

    if (!mounted) return null;

    return (
        <div className="relative">
            <button
                className="flex items-center gap-2 px-3 py-1 rounded border bg-white shadow text-black"
                onClick={() => setOpen((o) => !o)}
                aria-label={t("language")}
                type="button"
            >
                <span>
                    {languages.find((l) => l.code === i18n.language)?.flag}
                </span>
                <span className="font-semibold">
                    {languages.find((l) => l.code === i18n.language)?.label}
                </span>
                <svg
                    className="w-4 h-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M5 8l5 5 5-5H5z" />
                </svg>
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-black ${
                                i18n.language === lang.code
                                    ? "font-bold bg-gray-100"
                                    : ""
                            }`}
                            onClick={() => handleChange(lang.code)}
                            type="button"
                        >
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Header() {
    const [showMenu, setShowMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { handleSignOut } = useAuth();
    const { user, setUser } = useUser();
    const { t, i18n } = useTranslation("common");
    const router = useRouter();
    const pathname = usePathname();

    // Close user menu when pathname changes
    useEffect(() => {
        setShowUserMenu(false);
    }, [pathname]);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest(".user-menu-container")) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut({
                redirect: true,
                callbackUrl: "/",
            });
            setUser(null); // Clear user state immediately
            setShowUserMenu(false); // Close menu
            toast.success(t("logoutSuccess"), { id: "logout-toast" });
        } catch (error) {
            console.error("Logout error:", error);
            toast.error(t("logoutFailed"));
        }
    };

    return (
        <nav
            id="header"
            className="fixed w-full z-30 top-0 bg-[var(--color-blue)] text-[var(--color-light)]"
        >
            <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-4">
                <div className="flex items-center">
                    <Link
                        href="/gallery"
                        className="toggleColour text-white no-underline hover:no-underline font-medium text-2xl"
                    >
                        {t("siteTitle")}
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {/* Language Switcher */}
                    <LanguageSwitcher />
                    {/* End Language Switcher */}
                    {user ? (
                        <div className="relative user-menu-container">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-3 py-1 rounded border bg-white shadow text-black hover:bg-gray-100 transition"
                                type="button"
                            >
                                <div className="w-6 h-6 bg-[var(--color-blue)] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-sm">
                                    {user.name}
                                </span>
                                <svg
                                    className="w-4 h-4 ml-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M5 8l5 5 5-5H5z" />
                                </svg>
                            </button>
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-20">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <p className="text-sm text-gray-600">
                                            {user.email}
                                        </p>
                                    </div>
                                    <Link
                                        href="/profile"
                                        className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-black transition"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        {t("profile")}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition"
                                        type="button"
                                    >
                                        {t("logout")}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/register"
                                className="text-[18px] rounded-[4px] pt-[4px] pb-[4px] pl-[12px] pr-[12px] bg-[var(--color-light)] text-[var(--color-blue)] text-base transition-all duration-180"
                            >
                                {t("register")}
                            </Link>
                            <Link
                                href="/login"
                                className="text-[18px] rounded-[4px] pt-[4px] pb-[4px] pl-[12px] pr-[12px] bg-[var(--color-light)] text-[var(--color-blue)] text-base transition-all duration-180"
                            >
                                {t("login")}
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
