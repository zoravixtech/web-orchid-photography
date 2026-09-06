"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createFilm, updateFilm, validateYouTubeLink } from "@/app/admin/actions/films";
import { useToast } from "@/components/admin/Toast";
import type { Film } from "@/lib/types";

interface FilmDialogProps {
    initialFilm?: Film;
    onClose: () => void;
    onSaved: (film: Film) => void;
}

export default function FilmDialog({ initialFilm, onClose, onSaved }: FilmDialogProps) {
    const toast = useToast();
    const isEditing = Boolean(initialFilm);

    const [youtubeUrl, setYoutubeUrl] = useState(initialFilm?.youtubeUrl ?? "");
    const [title, setTitle] = useState(initialFilm?.title ?? "");
    const [thumbnailUrl, setThumbnailUrl] = useState(initialFilm?.thumbnailUrl ?? "");
    const [videoId, setVideoId] = useState(initialFilm?.videoId ?? "");

    const [validating, setValidating] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(Boolean(initialFilm));

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUrlChange = (val: string) => {
        setYoutubeUrl(val);
        const trimmed = val.trim();
        if (!trimmed) {
            setIsValid(false);
            setValidationError(null);
            if (!isEditing) {
                setThumbnailUrl("");
                setVideoId("");
            }
        } else if (isEditing && trimmed === initialFilm?.youtubeUrl) {
            setIsValid(true);
            setValidationError(null);
            setVideoId(initialFilm.videoId);
            setThumbnailUrl(initialFilm.thumbnailUrl);
        }
    };

    // Auto-validate URL when user changes it
    useEffect(() => {
        const trimmed = youtubeUrl.trim();
        if (!trimmed) return;
        if (isEditing && trimmed === initialFilm?.youtubeUrl) return;

        let cancelled = false;
        const timer = setTimeout(async () => {
            setValidating(true);
            setValidationError(null);
            try {
                const res = await validateYouTubeLink(trimmed);
                if (cancelled) return;
                if (res.valid && res.videoId && res.thumbnailUrl) {
                    setIsValid(true);
                    setVideoId(res.videoId);
                    setThumbnailUrl(res.thumbnailUrl);
                    if (!title.trim() && res.title) {
                        setTitle(res.title);
                    }
                } else {
                    setIsValid(false);
                    setValidationError(res.error || "Invalid YouTube link or video not found.");
                }
            } catch {
                if (cancelled) return;
                setIsValid(false);
                setValidationError("Could not verify YouTube link. Check network connection.");
            } finally {
                if (!cancelled) setValidating(false);
            }
        }, 500);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [youtubeUrl, isEditing, initialFilm, title]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!youtubeUrl.trim()) {
            setError("YouTube URL is required.");
            return;
        }

        if (!isValid) {
            setError(validationError || "Please provide a valid, accessible YouTube link.");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            if (isEditing && initialFilm) {
                const res = await updateFilm(initialFilm.id, {
                    youtubeUrl: youtubeUrl.trim(),
                    title: title.trim() || undefined,
                });
                if (res.error || !res.film) {
                    setError(res.error ?? "Failed to update film.");
                    toast.error(res.error ?? "Failed to update film.");
                    return;
                }
                toast.success("Film updated successfully.");
                onSaved(res.film);
                onClose();
            } else {
                const res = await createFilm({
                    youtubeUrl: youtubeUrl.trim(),
                    title: title.trim() || undefined,
                });
                if (res.error || !res.film) {
                    setError(res.error ?? "Failed to save film.");
                    toast.error(res.error ?? "Failed to save film.");
                    return;
                }
                toast.success("Film added successfully.");
                onSaved(res.film);
                onClose();
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to save film.";
            setError(msg);
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col border border-slate-100 overflow-hidden"
                role="dialog"
                aria-modal="true"
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {isEditing ? "Edit Film" : "Add YouTube Film"}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        aria-label="Close dialog"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {error && (
                        <div className="p-3.5 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200 flex items-start gap-2">
                            <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* YouTube URL input */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                            YouTube Link <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={youtubeUrl}
                                onChange={(e) => handleUrlChange(e.target.value)}
                                placeholder="e.g. https://www.youtube.com/watch?v=dK7miuzlq7w or https://youtu.be/..."
                                className={`w-full text-sm rounded-xl border px-3.5 py-2.5 transition-all focus:outline-hidden ${
                                    validationError
                                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/20"
                                        : isValid
                                        ? "border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                        : "border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                }`}
                                required
                            />
                            {validating && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <svg className="animate-spin h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            )}
                            {!validating && isValid && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5">
                            Paste any public YouTube link. The system will verify its structure and check that the video exists.
                        </p>
                        {validationError && (
                            <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {validationError}
                            </p>
                        )}
                    </div>

                    {/* Verified Video Preview */}
                    {isValid && thumbnailUrl && (
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                            <div className="flex items-center justify-between text-xs text-slate-600">
                                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Verified YouTube Video
                                </span>
                                <span className="font-mono text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                    ID: {videoId}
                                </span>
                            </div>

                            <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-black group shadow-xs">
                                <Image
                                    src={thumbnailUrl}
                                    alt={title || "YouTube Film Preview"}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/80 text-white flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 fill-current translate-x-0.5" viewBox="0 0 448 512">
                                            <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Title field (prefilled from oEmbed or customizable) */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                            Film Title <span className="text-slate-400 font-normal text-xs">(optional override)</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Royal Marwari Wedding Film || Kolkata"
                            className="w-full text-sm rounded-xl border border-slate-300 px-3.5 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-hidden"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Auto-fetched from YouTube, but you can customize it if you wish.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving || !isValid || validating}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-sm font-semibold text-white transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving…
                                </>
                            ) : (
                                <>{isEditing ? "Save Changes" : "Add Film"}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
