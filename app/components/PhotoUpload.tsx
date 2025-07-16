"use client";
import "../i18n";

import { useState, useRef } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface PhotoUploadProps {
    albumId: number;
    userId: number;
    onUploadSuccess: (photoId: number) => void;
    onUploadError: (error: string) => void;
    className?: string;
}

export function PhotoUpload({
    albumId,
    userId,
    onUploadSuccess,
    onUploadError,
    className = "",
}: PhotoUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation("common");

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("albumId", String(albumId));
            formData.append("userId", String(userId));

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                onUploadSuccess(result.photoId);
                // Clear file input and preview after successful upload
                if (fileInputRef.current) fileInputRef.current.value = "";
                setPreview(null);
            } else {
                onUploadError(result.error || "Upload failed");
            }
        } catch (error) {
            onUploadError("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {!isUploading && (
                <div className="flex items-center justify-center w-[50%]">
                    <label
                        htmlFor="photo-upload"
                        className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt={t("preview")}
                                    width={192}
                                    height={192}
                                    className="max-h-48 max-w-full object-contain"
                                />
                            ) : (
                                <>
                                    <svg
                                        className="w-8 h-8 mb-4 text-gray-500"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.197 5.017 5.195 5.012 5.195 5.012A4.5 4.5 0 0 0 4.5 13.5H13Z"
                                        />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">
                                            {t("clickToUpload")}
                                        </span>{" "}
                                        {t("orDragAndDrop")}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {t("uploadFileTypes")}
                                    </p>
                                </>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            id="photo-upload"
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={handleFileSelect}
                            disabled={isUploading}
                        />
                    </label>
                </div>
            )}

            {isUploading && (
                <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-800 bg-blue-100 rounded-lg">
                        <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-800"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        {t("uploading")}
                    </div>
                </div>
            )}
        </div>
    );
}
