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

    // Close album menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest(".album-menu-container")) {
                setOpenMenuAlbumId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <svg
                        className="w-8 h-8 text-[var(--color-blue)]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                        />
                    </svg>
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
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <svg
                                    className="w-6 h-6 text-[var(--color-blue)]"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                </svg>
                                {t("albums")}
                            </h2>
                            <button
                                onClick={() => setIsCreatingAlbum(true)}
                                className="bg-[var(--color-blue)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
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
                                        className="bg-[var(--color-blue)] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition-colors"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {t("create")}
                                    </button>
                                    <button
                                        onClick={() =>
                                            setIsCreatingAlbum(false)
                                        }
                                        className="bg-[var(--color-blue)] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition-colors"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
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
                                    className={`aspect-[3/2] flex flex-col overflow-hidden p-4 border rounded-lg cursor-pointer relative transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                                        selectedAlbum?.id === album.id
                                            ? "border-[var(--color-yellow)] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                                            : "border-[var(--color-blue)] bg-gradient-to-br from-white to-gray-50 shadow-md hover:border-blue-400"
                                    }`}
                                >
                                    {/* Album Icon */}
                                    <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                                        <svg
                                            className="w-5 h-5 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                        </svg>
                                    </div>

                                    {/* 3 dots button */}
                                    <div className="album-menu-container relative">
                                        <button
                                            className="absolute top-2 right-2 p-1 rounded text-[var(--color-blue)] bg-white border border-[var(--color-blue)] hover:bg-blue-50 transition-colors duration-200 shadow-sm"
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
                                            <div className="absolute top-8 right-2 bg-white border rounded shadow-lg z-20 animate-in fade-in duration-200">
                                                <button
                                                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-black flex items-center gap-2 transition-colors duration-150"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditAlbum(album);
                                                    }}
                                                >
                                                    <svg
                                                        className="w-4 h-4 text-[var(--color-blue)]"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                    {t("edit")}
                                                </button>
                                                <button
                                                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 flex items-center gap-2 transition-colors duration-150"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteAlbum(
                                                            album.id
                                                        );
                                                    }}
                                                >
                                                    <svg
                                                        className="w-4 h-4 text-red-600"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {t("delete")}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Album Content */}
                                    <div className="mt-8 flex-1 flex flex-col">
                                        <h3 className="font-semibold text-[var(--color-blue)] text-lg mb-2">
                                            {album.title}
                                        </h3>
                                        {album.description && (
                                            <p className="text-sm text-[var(--color-yellow)] mb-2 flex items-center gap-1">
                                                <svg
                                                    className="w-3 h-3"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                {album.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-600 mt-auto flex items-center gap-1">
                                            <svg
                                                className="w-3 h-3 text-gray-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {t("created")}{" "}
                                            {new Date(
                                                album.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Photo Upload Section */}
                {selectedAlbum && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-black flex items-center gap-2">
                            <svg
                                className="w-6 h-6 text-[var(--color-blue)]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
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
                        <h2 className="text-xl font-semibold mb-4 text-black flex items-center gap-2">
                            <svg
                                className="w-6 h-6 text-[var(--color-blue)]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                    clipRule="evenodd"
                                />
                            </svg>
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
