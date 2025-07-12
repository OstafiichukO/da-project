import { auth } from "@/app/auth/auth";
import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
    const session = await auth();
    const user = session?.user as {
        id: string;
        email: string;
        name: string;
    } | null;
    return <GalleryClient user={user} />;
}
