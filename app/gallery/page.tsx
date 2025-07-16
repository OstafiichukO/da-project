import dynamic from "next/dynamic";
const GalleryClient = dynamic(() => import("./GalleryClient"), { ssr: false });

export default function GalleryPage() {
    return <GalleryClient />;
}
