"use client";

import { useRef, useState } from "react";
import type { GallerySection, GalleryMediaItem } from "@/lib/types";
import { uploadFile } from "@/lib/uploadClient";
import { mapWithConcurrencyLimit } from "@/lib/concurrency";
import { useToast } from "@/components/admin/Toast";

interface UploadModalProps {
    open: boolean;
    section: GallerySection;
    onClose: () => void;
    onUploaded: (items: GalleryMediaItem[]) => void;
}

export default function UploadModal({ open, section, onClose, onUploaded }: UploadModalProps) {
    const toast = useToast();
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    if (!open) return null;

    const addFiles = (list: FileList | null) => {
        if (!list) return;
        setFiles((prev) => [...prev, ...Array.from(list)]);
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setUploading(true);
        setProgress(0);

        const perFileProgress = new Array(files.length).fill(0);
        const updateProgress = () => {
            const total = perFileProgress.reduce((sum, value) => sum + value, 0);
            setProgress(total / files.length);
        };

        try {
            // Bounded concurrency prevents overwhelming browser network connections
            // during large batch uploads (see lib/concurrency.ts). Each result already
            // comes back as a full GalleryMediaItem row, persisted server-side.
            const uploaded = await mapWithConcurrencyLimit(files, 3, (file, index) =>
                uploadFile(section, file, file.name || "", (fraction) => {
                    perFileProgress[index] = fraction;
                    updateProgress();
                })
            );

            const items = uploaded
                .map((result) => result.galleryItem)
                .filter((item): item is GalleryMediaItem => item !== undefined);

            toast.success(`${files.length} file${files.length === 1 ? "" : "s"} uploaded.`);
            setFiles([]);
            onUploaded(items);
            onClose();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Upload to <span className="capitalize text-purple-600">{section}</span>
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={uploading}
                        aria-label="Close"
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                            addFiles(e.target.files);
                            e.target.value = "";
                        }}
                    />

                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="w-full border-2 border-dashed border-slate-300 rounded-xl py-8 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-purple-400 hover:text-purple-600 transition-colors disabled:opacity-50"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm font-medium">Click to select one or more images</span>
                        <span className="text-xs">PNG, JPG, WebP, AVIF or GIF — optimized automatically on upload</span>
                    </button>

                    {files.length > 0 && (
                        <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
                            {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between px-3 py-2 text-sm">
                                    <span className="truncate text-slate-700">{file.name}</span>
                                    {!uploading && (
                                        <button
                                            type="button"
                                            onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                                            className="text-slate-400 hover:text-red-500 shrink-0 ml-2"
                                            aria-label={`Remove ${file.name}`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {uploading && (
                        <div>
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                <span>Uploading &amp; optimizing…</span>
                                <span>{Math.round(progress * 100)}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-600 transition-all duration-300"
                                    style={{ width: `${Math.round(progress * 100)}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={uploading}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={uploading || files.length === 0}
                            className="rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm font-semibold text-white transition-colors"
                        >
                            {uploading ? "Uploading…" : `Upload ${files.length > 0 ? `(${files.length})` : ""}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
