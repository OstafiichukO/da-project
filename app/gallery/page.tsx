"use client";
import "../i18n";
import dynamic from "next/dynamic";
import { useUser } from "../components/UserContext";

const GalleryClient = dynamic(() => import("./GalleryClient"), { ssr: false });

export default function GalleryPage() {
    const { user } = useUser();
    return <GalleryClient user={user} />;
}
