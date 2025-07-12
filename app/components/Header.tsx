"use client";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Link from "next/link";

export const Header = ({
    user,
}: {
    user: { email: string; name: string } | null;
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const { handleSignOut } = useAuth();

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
                        Digital album
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link
                                href="/gallery"
                                className="text-[16px] transition-all duration-180 pt-[4px] pb-[4px] pl-[12px] pr-[12px]"
                            >
                                Gallery
                            </Link>
                            <div className="relative">
                                <span
                                    className="text-[1rem] text-[var(--color-light)] border border-[var(--color-yellow)] rounded-[4px] px-[12px] py-[4px] cursor-pointer"
                                    onClick={() => setShowMenu((prev) => !prev)}
                                >
                                    {user.name}
                                </span>
                                {showMenu && (
                                    <div className="absolute right-0 top-[50px] z-50">
                                        <ul className="list-none bg-[var(--color-light)] text-black rounded-[12px] box-shadow-[0px 2px 8px 0px #1a1a1a29] w-[230px] right-0">
                                            <li className="pt-[12px] pb-[12px] pl-[16px] pr-[16px] cursor-pointer hover:bg-[var(--color-blue)] hover:text-[var(--color-light)] transition-all duration-180 rounded-t-[12px]">
                                                My account
                                            </li>
                                            <li className="pt-[12px] pb-[12px] pl-[16px] pr-[16px] cursor-pointer hover:bg-[var(--color-blue)] hover:text-[var(--color-light)] transition-all duration-180 rounded-b-[12px]">
                                                <form
                                                    action={handleSignOut}
                                                    style={{
                                                        display: "inline-block",
                                                    }}
                                                >
                                                    <button type="submit">
                                                        Logout
                                                    </button>
                                                </form>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/register"
                                className="text-[18px] rounded-[4px] pt-[4px] pb-[4px] pl-[12px] pr-[12px] bg-[var(--color-light)] text-[var(--color-blue)] text-base transition-all duration-180"
                            >
                                Register
                            </Link>
                            <Link
                                href="/login"
                                className="text-[18px] rounded-[4px] pt-[4px] pb-[4px] pl-[12px] pr-[12px] bg-[var(--color-light)] text-[var(--color-blue)] text-base transition-all duration-180"
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
