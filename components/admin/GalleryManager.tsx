"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { deleteGalleryMedia } from "@/app/admin/actions/gallery";
import UploadModal from "@/components/admin/UploadModal";
import { useToast } from "@/components/admin/Toast";
import type { GalleryMediaItem, GallerySection } from "@/lib/types";

interface GalleryManagerProps {
    initialGallery: GalleryMediaItem[];
    initialKids: GalleryMediaItem[];
}

const sections: { value: GallerySection; label: string }[] = [
    { value: "gallery", label: "Gallery" },
    { value: "kids", label: "Kids Area" },
];

export default function GalleryManager({ initialGallery, initialKids }: GalleryManagerProps) {
    const router = useRouter();
    const toast = useToast();
    const [section, setSection] = useState<GallerySection>("gallery");
    const [modalOpen, setModalOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const images = section === "gallery" ? initialGallery : initialKids;

    const handleDelete = (id: string) => {
        startTransition(async () => {
            const result = await deleteGalleryMedia(id);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Image deleted.");
                router.refresh();
            }
        });
    };

    const handleUploaded = () => {
        router.refresh();
    };

    return (
        <div className="max-w-6xl">
            <header className="mb-6">
                <h1 className="text-2xl font-serif font-bold text-slate-900">Gallery</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Manage images for the home page gallery and the kids area gallery.
                </p>
            </header>

            {/* Full-width nav card with destination selector + upload button */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-medium text-slate-500 shrink-0">Upload to:</span>
                    <div className="flex rounded-lg border border-slate-300 overflow-hidden">
                        {sections.map((s) => (
                            <button
                                key={s.value}
                                type="button"
                                onClick={() => setSection(s.value)}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${
                                    section === s.value
                                        ? "bg-purple-600 text-white"
                                        : "bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 transition-colors shrink-0"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Upload
                </button>
            </div>

            {/* Selected section label */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    {section === "gallery" ? "Gallery" : "Kids Area"} images ({images.length})
                </h2>
            </div>

            {images.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                    <p className="text-sm text-slate-500">
                        No images yet. Click <span className="font-semibold text-purple-600">Upload</span> to add some.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((item) => (
                        <div
                            key={item.id}
                            className="group relative aspect-4/3 rounded-xl overflow-hidden bg-slate-200 border border-slate-200"
                        >
                            <Image
                                src={item.url}
                                alt={item.alt || "Gallery image"}
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="object-cover"
                            />

                            {/* Delete overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                {pendingDeleteId === item.id ? (
                                    <span className="text-xs text-white">Deleting…</span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPendingDeleteId(item.id);
                                            handleDelete(item.id);
                                        }}
                                        disabled={isPending}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 transition-colors disabled:opacity-60"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <UploadModal
                open={modalOpen}
                section={section}
                onClose={() => setModalOpen(false)}
                onUploaded={handleUploaded}
            />
        </div>
    );
}