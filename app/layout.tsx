import "./globals.css";

import { GeistSans } from "geist/font/sans";
import { auth } from "./auth/auth";
import Providers from "./components/Providers";
import Header from "./components/Header";

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
    params,
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const session = await auth();
    const user = session?.user as {
        id: string;
        email: string;
        name: string;
    } | null;
    return (
        <html lang={params.locale}>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </head>
            <body
                className={`${GeistSans.variable} leading-normal tracking-normal text-white gradient`}
            >
                <Providers user={user}>
                    <Header />
                    <div className="mt-[50px]">{children}</div>
                </Providers>
            </body>
        </html>
    );
}
