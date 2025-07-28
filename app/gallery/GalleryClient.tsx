"use client";
import "../i18n";

import { useState, useEffect } from "react";
import { PhotoUpload } from "app/components/PhotoUpload";
import Image from "next/image";
import LoadingAlbums from "./LoadingAlbums";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface Album {
    id: number;
    title: string;
    description?: string;
    createdAt: string;
}

interface Photo {
    id: number;
    caption?: string;
    createdAt: string;
}

interface EditAlbumModalProps {
    album: Album;
    onClose: () => void;
    onSave: (album: Album) => Promise<void>;
}

function EditAlbumModal({ album, onClose, onSave }: EditAlbumModalProps) {
    const { t } = useTranslation("common");
    const [title, setTitle] = useState(album.title);
    const [description, setDescription] = useState(album.description || "");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSave({ ...album, title, description });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-black">
                    {t("editAlbum")}
                </h2>
                <form onSubmit={handleSubmit}>
                    <input
                        className="w-full p-2 border rounded mb-2 text-black"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t("albumTitle")}
                        required
                    />
                    <textarea
                        className="w-full p-2 border rounded mb-2 text-black"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t("albumDescription")}
                        rows={3}
                    />
                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                        >
                            {t("cancel")}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {t("save")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// PhotoModal component for viewing and flipping through photos
function PhotoModal({
    photos,
    currentIndex,
    onClose,
    onPrev,
    onNext,
}: {
    photos: Photo[];
    currentIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}) {
    const { t } = useTranslation("common");
    if (currentIndex < 0 || currentIndex >= photos.length) return null;
    const photo = photos[currentIndex];
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <button
                className="absolute top-4 right-4 text-white text-2xl font-bold bg-black bg-opacity-40 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
                onClick={onClose}
                aria-label={t("close")}
            >
                <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18 17.94 6M18 18 6.06 6"
                    />
                </svg>
            </button>
            <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl font-bold bg-black bg-opacity-40 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
                onClick={onPrev}
                aria-label={t("previous")}
                disabled={photos.length <= 1}
            >
                <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m15 19-7-7 7-7"
                    />
                </svg>
            </button>
            <div className="max-w-3xl max-h-[80vh] flex flex-col items-center">
                <Image
                    src={`/api/photos/${photo.id}/data`}
                    alt={photo.caption || t("photos")}
                    width={800}
                    height={600}
                    objectFit="contain"
                    className="max-h-[70vh] max-w-full rounded shadow-lg"
                />
                {photo.caption && (
                    <div className="mt-4 text-white text-center text-lg bg-black bg-opacity-40 px-4 py-2 rounded">
                        {photo.caption}
                    </div>
                )}
            </div>
            <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl font-bold bg-black bg-opacity-40 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
                onClick={onNext}
                aria-label={t("next")}
                disabled={photos.length <= 1}
            >
                <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m9 5 7 7-7 7"
                    />
                </svg>
            </button>
        </div>
    );
}

export default function GalleryClient({
    user,
}: {
    user?: { id: string; email: string; name: string } | null;
}) {
    const { t } = useTranslation("common");
    const userId = user?.id;
    const [albums, setAlbums] = useState<Album[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [newAlbumTitle, setNewAlbumTitle] = useState("");
    const [newAlbumDescription, setNewAlbumDescription] = useState("");
    const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openMenuAlbumId, setOpenMenuAlbumId] = useState<number | null>(null);
    const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
    const [modalPhotoIndex, setModalPhotoIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        fetch(`/api/albums?userId=${userId}`)
            .then((res) => res.json())
            .then((data) => setAlbums(data.albums || []))
            .catch(() => {
                setError("Failed to load albums");
                toast.error("Failed to load albums");
            })
            .finally(() => setLoading(false));
    }, [userId]);

    useEffect(() => {
        if (!selectedAlbum) {
            setPhotos([]);
            return;
        }
        fetch(`/api/photos?albumId=${selectedAlbum.id}`)
            .then((res) => res.json())
            .then((data) => setPhotos(data.photos || []))
            .catch(() => {
                toast.error("Failed to load photos");
            });
    }, [selectedAlbum]);

    const createAlbum = async () => {
        if (!newAlbumTitle.trim()) return;

        try {
            const response = await fetch("/api/albums", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    title: newAlbumTitle,
                    description: newAlbumDescription,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setAlbums([...albums, result.album]);
                setNewAlbumTitle("");
                setNewAlbumDescription("");
                setIsCreatingAlbum(false);
                toast.success("Album created successfully");
            } else {
                const result = await response.json();
                toast.error(result.error || "Failed to create album");
            }
        } catch (error) {
            console.error("Error creating album:", error);
        }
    };

    const handlePhotoUpload = async (photoId: number) => {
        if (!selectedAlbum) return;
        // Fetch the new photo from the API and add it to the state
        try {
            const res = await fetch(`/api/photos?photoId=${photoId}`);
            if (res.ok) {
                const data = await res.json();
                if (data.photo) {
                    setPhotos([...photos, data.photo]);
                    toast.success("Photo uploaded successfully");
                }
            } else {
                toast.error("Failed to fetch new photo");
            }
        } catch (error) {
            console.error("Error fetching new photo:", error);
        }
    };

    const handleUploadError = (error: string) => {
        toast.error(`Upload error: ${error}`);
    };

    const handleDeletePhoto = async (photoId: number) => {
        // if (!window.confirm('Are you sure you want to delete this photo?')) return;
        const res = await fetch(`/api/photos?photoId=${photoId}`, {
            method: "DELETE",
        });
        if (res.ok) {
            setPhotos((prev) => prev.filter((p) => p.id !== photoId));
            toast.success("Photo deleted successfully");
        } else {
            toast.error("Failed to delete photo");
        }
    };

    const handleEditAlbum = (album: Album) => {
        setEditingAlbum(album);
        setOpenMenuAlbumId(null);
    };

    const handleSaveAlbum = async (updatedAlbum: Album) => {
        const res = await fetch(`/api/albums?albumId=${updatedAlbum.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: updatedAlbum.title,
                description: updatedAlbum.description,
            }),
        });
        if (res.ok) {
            setAlbums((albums) =>
                albums.map((a) =>
                    a.id === updatedAlbum.id ? { ...a, ...updatedAlbum } : a
                )
            );
            setEditingAlbum(null);
            toast.success("Album updated successfully");
        } else {
            toast.error("Failed to update album");
        }
    };

    const handleDeleteAlbum = async (albumId: number) => {
        const res = await fetch(`/api/albums?albumId=${albumId}`, {
            method: "DELETE",
        });
        if (res.ok) {
            setAlbums((prev) => prev.filter((a) => a.id !== albumId));
            if (selectedAlbum?.id === albumId) setSelectedAlbum(null);
            toast.success("Album deleted successfully");
        } else {
            toast.error("Failed to delete album");
        }
        setOpenMenuAlbumId(null);
    };

    return (
        <div className="container mt-0 mx-auto pt-[40px] w-full">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    {t("photoGallery")}
                </h1>
                {loading && <LoadingAlbums />}
                {!loading && error && (
                    <div className="text-red-500">{t(error)}</div>
                )}
                {/* Albums Section */}
                {!loading && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {t("albums")}
                            </h2>
                            <button
                                onClick={() => setIsCreatingAlbum(true)}
                                className="bg-[var(--color-blue)] text-white  px-4 py-2 rounded-lg "
                            >
                                {t("createAlbum")}
                            </button>
                        </div>

                        {isCreatingAlbum && (
                            <div className="mb-4 p-4 border rounded-lg">
                                <input
                                    type="text"
                                    placeholder={t("albumTitle")}
                                    value={newAlbumTitle}
                                    onChange={(e) =>
                                        setNewAlbumTitle(e.target.value)
                                    }
                                    className="w-full p-2 border rounded mb-2 text-black"
                                />
                                <textarea
                                    placeholder={
                                        t("albumDescription") +
                                        " (" +
                                        t("optional") +
                                        ")"
                                    }
                                    value={newAlbumDescription}
                                    onChange={(e) =>
                                        setNewAlbumDescription(e.target.value)
                                    }
                                    className="w-full p-2 border rounded mb-2 text-black"
                                    rows={3}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={createAlbum}
                                        className="bg-[var(--color-blue)] text-white px-4 py-2 rounded "
                                    >
                                        {t("create")}
                                    </button>
                                    <button
                                        onClick={() =>
                                            setIsCreatingAlbum(false)
                                        }
                                        className="bg-[var(--color-blue)] text-white px-4 py-2 rounded "
                                    >
                                        {t("cancel")}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {albums.map((album) => (
                                <div
                                    key={album.id}
                                    onClick={() => setSelectedAlbum(album)}
                                    className={`aspect-[3/2] flex flex-col overflow-hidden p-4 border  rounded-lg cursor-pointer hover:bg-gray-50 relative ${
                                        selectedAlbum?.id === album.id
                                            ? "border-[var(--color-yellow)] bg-blue-50"
                                            : "border-[var(--color-blue)]"
                                    }`}
                                >
                                    {/* 3 dots button */}
                                    <button
                                        className="absolute top-2 right-2 p-1 rounded text-[var(--color-blue)] bg-white border border-[var(--color-blue)]"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuAlbumId(
                                                openMenuAlbumId === album.id
                                                    ? null
                                                    : album.id
                                            );
                                        }}
                                    >
                                        <svg
                                            className="w-6 h-6 text-gray-800 dark:text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="var(--color-blue)"
                                                strokeLinecap="round"
                                                strokeWidth="2"
                                                d="M12 6h.01M12 12h.01M12 18h.01"
                                            />
                                        </svg>
                                    </button>
                                    {/* Dropdown menu */}
                                    {openMenuAlbumId === album.id && (
                                        <div className="absolute top-8 right-2 bg-white border rounded shadow z-20">
                                            <button
                                                className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-black"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditAlbum(album);
                                                }}
                                            >
                                                {t("edit")}
                                            </button>
                                            <button
                                                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAlbum(album.id);
                                                }}
                                            >
                                                {t("delete")}
                                            </button>
                                        </div>
                                    )}
                                    <h3 className="font-semibold text-[var(--color-blue)] text-lg ">
                                        {album.title}
                                    </h3>
                                    {album.description && (
                                        <p className="text-sm text-[var(--color-yellow)] mt-1">
                                            {album.description}
                                        </p>
                                    )}
                                    <p className="text-xs text-black mt-auto">
                                        {t("created")}{" "}
                                        {new Date(
                                            album.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Photo Upload Section */}
                {selectedAlbum && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-black">
                            {t("uploadPhotosTo", {
                                title: selectedAlbum.title,
                            })}
                        </h2>
                        <PhotoUpload
                            albumId={selectedAlbum.id}
                            userId={Number(userId)}
                            onUploadSuccess={handlePhotoUpload}
                            onUploadError={handleUploadError}
                            className="flex justify-center items-center"
                        />
                    </div>
                )}

                {/* Photos Display */}
                {photos.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-black">
                            {t("photos")}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {photos.map((photo, idx) => (
                                <div
                                    key={photo.id}
                                    className="border rounded-lg relative group cursor-pointer flex justify-center items-center"
                                    onClick={() => setModalPhotoIndex(idx)}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePhoto(photo.id);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-red-600 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg
                                            className="w-6 h-6 text-gray-800 dark:text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18 17.94 6M18 18 6.06 6"
                                            />
                                        </svg>
                                    </button>
                                    <Image
                                        src={`/api/photos/${photo.id}/data`}
                                        alt={photo.caption || t("photos")}
                                        width={400}
                                        height={192}
                                        className="w-full h-48 object-cover rounded-lg shadow-lg bg-white transform duration-500 pointer-events-auto"
                                    />
                                    {photo.caption && (
                                        <div className="p-3">
                                            <p className="text-sm text-gray-700">
                                                {photo.caption}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Photo Modal */}
                        {modalPhotoIndex !== null && (
                            <PhotoModal
                                photos={photos}
                                currentIndex={modalPhotoIndex}
                                onClose={() => setModalPhotoIndex(null)}
                                onPrev={() =>
                                    setModalPhotoIndex((idx) =>
                                        idx !== null
                                            ? (idx - 1 + photos.length) %
                                              photos.length
                                            : 0
                                    )
                                }
                                onNext={() =>
                                    setModalPhotoIndex((idx) =>
                                        idx !== null
                                            ? (idx + 1) % photos.length
                                            : 0
                                    )
                                }
                            />
                        )}
                    </div>
                )}

                {editingAlbum && (
                    <EditAlbumModal
                        album={editingAlbum}
                        onClose={() => setEditingAlbum(null)}
                        onSave={handleSaveAlbum}
                    />
                )}
            </div>
        </div>
    );
}
