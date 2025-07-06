import { signOut } from "../auth";
import Link from "next/link";

export const Header = ({ user }: { user: { email: string, name: string } | null }) => {
    return (
        <header className='w-full bg-neutral-200 shadow absolute top-0 left-0'>
            <div className='container mx-auto flex items-center justify-between px-6 py-4'>
                <Link
                    href='/gallery'
                    className='text-2xl font-extrabold tracking-tight text-black rounded-lg w-52 p-1 flex items-center justify-center'
                >
                    Digital album
                </Link>
                <nav className='flex items-center gap-4'>
                    {user ? (
                        <>
                            <Link href="/gallery" className='text-black w-24 text-[18px] flex items-center justify-center rounded-lg p-1 hover:bg-blue-600 hover:text-white transition-all duration-200'>Gallery</Link>
                            <span style={{ display: 'inline-block', marginLeft: '2rem', verticalAlign: 'middle' }}>
                                <span style={{ fontSize: '1rem', marginRight: '1rem', color: '#555' }}>{user.name}</span>
                                <form
                                    action={async () => {
                                        'use server';
                                        await signOut();
                                    }}
                                    style={{ display: 'inline-block' }}
                                >
                                    <button type="submit" className='rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600'>
                                        Logout
                                    </button>
                                </form>
                            </span>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className='text-black w-24 text-[18px] flex items-center justify-center rounded-lg p-1 hover:bg-blue-600 hover:text-white transition-all duration-200'>Login</Link>
                            <Link href="/register" className='text-black w-24 text-[18px] flex items-center justify-center rounded-lg p-1 hover:bg-blue-600 hover:text-white transition-all duration-200'>Register</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}