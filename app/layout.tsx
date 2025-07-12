import "./globals.css";

import { GeistSans } from "geist/font/sans";
import { auth } from "./auth/auth";
import { Header } from "./components/Header";

// let title = 'Next.js + Postgres Auth Starter';
// let description =
//   'This is a Next.js starter kit that uses NextAuth.js for simple email + password login and a Postgres database to persist the data.';

// export const metadata = {
//   title,
//   description,
//   twitter: {
//     card: 'summary_large_image',
//     title,
//     description,
//   },
//   metadataBase: new URL('https://nextjs-postgres-auth.vercel.app'),
// };

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const user = session?.user as {
        id: string;
        email: string;
        name: string;
    } | null;
    return (
        <html lang="en">
            <head></head>
            <body
                className={`${GeistSans.variable} leading-normal tracking-normal text-white gradient`}
            >
                <Header user={user} />
                <div className="mt-[50px]">{children}</div>
            </body>
        </html>
    );
}
