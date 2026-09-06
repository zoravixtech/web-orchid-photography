"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createReview, updateReview } from "@/app/admin/actions/reviews";
import { uploadFile } from "@/lib/uploadClient";
import { useToast } from "@/components/admin/Toast";
import { PlatformLogo } from "@/components/PlatformLogo";
import type { Review, ReviewPlatform, ReviewType } from "@/lib/types";

interface ReviewDialogProps {
    initialReview?: Review;
    onClose: () => void;
    onSaved: (review: Review) => void;
}

const PLATFORMS: { id: ReviewPlatform; label: string }[] = [
    { id: "google", label: "Google" },
    { id: "facebook", label: "Facebook" },
    { id: "wedmegood", label: "WedMeGood" },
];

export default function ReviewDialog({ initialReview, onClose, onSaved }: ReviewDialogProps) {
    const toast = useToast();
    const isEditing = Boolean(initialReview);

    const [type, setType] = useState<ReviewType>(initialReview?.type ?? "text");
    const [name, setName] = useState(initialReview?.name ?? "");
    const [stars, setStars] = useState<number>(initialReview?.stars ?? 5);
    const [platform, setPlatform] = useState<ReviewPlatform>(initialReview?.platform ?? "google");
    const [message, setMessage] = useState(initialReview?.message ?? "");
    const [pinned, setPinned] = useState(initialReview?.pinned ?? false);

    // Media states
    const [userImage, setUserImage] = useState<string | null>(initialReview?.userImage ?? null);
    const [userImageStoragePath, setUserImageStoragePath] = useState<string | null>(
        initialReview?.userImageStoragePath ?? null
    );

    const [videoUrl, setVideoUrl] = useState<string | null>(initialReview?.videoUrl ?? null);
    const [videoStoragePath, setVideoStoragePath] = useState<string | null>(
        initialReview?.videoStoragePath ?? null
    );

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStage, setUploadStage] = useState<string>("");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadProgress(0);
        setUploadStage("Compressing & uploading avatar…");
        setError(null);

        try {
            const res = await uploadFile(
                "reviewAvatar",
                file,
                `${name || "User"} Avatar`,
                {},
                (fraction) => {
                    setUploadProgress(Math.round(fraction * 100));
                }
            );
            setUserImage(res.publicUrl);
            setUserImageStoragePath(res.storagePath);
            toast.success("Avatar compressed and uploaded.");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to upload avatar.";
            setError(msg);
            toast.error(msg);
        } finally {
            setUploading(false);
            setUploadStage("");
            if (avatarInputRef.current) avatarInputRef.current.value = "";
        }
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadProgress(0);
        setUploadStage("Compressing video client-side…");
        setError(null);

        try {
            const res = await uploadFile(
                "reviewVideo",
                file,
                `${name || "Video"} Review`,
                {},
                (fraction) => {
                    setUploadProgress(Math.round(fraction * 100));
                    if (fraction > 0.4) {
                        setUploadStage("Uploading compressed video…");
                    }
                }
            );
            setVideoUrl(res.publicUrl);
            setVideoStoragePath(res.storagePath);
            toast.success("Video compressed and uploaded.");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to upload video.";
            setError(msg);
            toast.error(msg);
        } finally {
            setUploading(false);
            setUploadStage("");
            if (videoInputRef.current) videoInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError("Please enter the reviewer name.");
            return;
        }

        if (type === "text") {
            if (!message.trim()) {
                setError("Please enter the review message.");
                return;
            }
            if (!platform) {
                setError("Please select a review platform.");
                return;
            }
        } else if (type === "video") {
            if (!videoUrl) {
                setError("Please upload a video file for this review.");
                return;
            }
        }

        setSaving(true);
        try {
            if (isEditing && initialReview) {
                const res = await updateReview(initialReview.id, {
                    name,
                    stars,
                    userImage,
                    userImageStoragePath,
                    message,
                    platform,
                    videoUrl,
                    videoStoragePath,
                    pinned,
                });
                if (res.error || !res.review) {
                    setError(res.error ?? "Failed to update review.");
                    return;
                }
                onSaved(res.review);
                toast.success("Review updated successfully.");
                onClose();
            } else {
                const res = await createReview({
                    type,
                    name,
                    stars,
                    userImage,
                    userImageStoragePath,
                    message,
                    platform,
                    videoUrl,
                    videoStoragePath,
                    pinned,
                });
                if (res.error || !res.review) {
                    setError(res.error ?? "Failed to create review.");
                    return;
                }
                onSaved(res.review);
                toast.success("Review created successfully.");
                onClose();
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
        >
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {isEditing ? "Edit Review" : "Create New Review"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {isEditing
                                ? "Update reviewer details and ratings."
                                : "Add a text or video review to showcase across the site."}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                            {error}
                        </div>
                    )}

                    {/* Review Type Selector (Locked if editing) */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Review Type
                            {isEditing && (
                                <span className="ml-2 font-normal text-slate-400">
                                    (Cannot be modified after creation)
                                </span>
                            )}
                        </label>
                        {isEditing ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase">
                                <span
                                    className={`w-2 h-2 rounded-full ${
                                        type === "video" ? "bg-purple-500" : "bg-blue-500"
                                    }`}
                                />
                                {type} Review
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setType("text")}
                                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                                        type === "text"
                                            ? "border-purple-600 bg-purple-50 text-purple-700 font-semibold shadow-xs"
                                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                    Text Review
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType("video")}
                                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                                        type === "video"
                                            ? "border-purple-600 bg-purple-50 text-purple-700 font-semibold shadow-xs"
                                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Video Review
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Reviewer Name */}
                    <div>
                        <label htmlFor="rev-name" className="block text-xs font-semibold text-slate-700 mb-1">
                            Reviewer Name *
                        </label>
                        <input
                            id="rev-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="e.g. Riya Chakraborty"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Rating (Stars) */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Rating *
                        </label>
                        <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((starVal) => (
                                <button
                                    key={starVal}
                                    type="button"
                                    onClick={() => setStars(starVal)}
                                    className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <span className={starVal <= stars ? "text-amber-400" : "text-slate-200"}>
                                        ★
                                    </span>
                                </button>
                            ))}
                            <span className="text-xs font-semibold text-slate-500 ml-2">
                                {stars} of 5 Stars
                            </span>
                        </div>
                    </div>

                    {/* TEXT-SPECIFIC FIELDS */}
                    {type === "text" && (
                        <>
                            {/* Platform selector */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Platform *
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {PLATFORMS.map((p) => {
                                        const isSelected = platform === p.id;
                                        return (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => setPlatform(p.id)}
                                                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                                    isSelected
                                                        ? "border-purple-600 bg-purple-50 text-purple-900 shadow-xs ring-1 ring-purple-600"
                                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                <PlatformLogo platform={p.id} className="w-5 h-5" />
                                                <span>{p.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* User Image / Logo (Bare-minimum compression) */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Reviewer Photo / Avatar
                                    <span className="font-normal text-slate-400 ml-1">
                                        (Auto-compressed to ultra-lightweight bare minimum)
                                    </span>
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                        {userImage ? (
                                            <Image
                                                src={userImage}
                                                alt={name || "Reviewer"}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <span className="text-lg font-bold text-slate-400">
                                                {name ? name.charAt(0).toUpperCase() : "?"}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <input
                                            ref={avatarInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp,image/avif"
                                            onChange={handleAvatarUpload}
                                            className="hidden"
                                            id="avatar-upload"
                                            disabled={uploading}
                                        />
                                        <div className="flex items-center gap-2">
                                            <label
                                                htmlFor="avatar-upload"
                                                className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors ${
                                                    uploading ? "opacity-50 pointer-events-none" : ""
                                                }`}
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                </svg>
                                                {userImage ? "Change Photo" : "Upload Photo"}
                                            </label>
                                            {userImage && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setUserImage(null);
                                                        setUserImageStoragePath(null);
                                                    }}
                                                    className="px-2 py-1.5 text-xs text-red-600 hover:text-red-700 hover:underline"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-400 mt-1">
                                            Recommended square portrait. Converted to &lt; 15 KB WebP automatically.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="rev-message" className="block text-xs font-semibold text-slate-700 mb-1">
                                    Review Message *
                                </label>
                                <textarea
                                    id="rev-message"
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    placeholder="Write or paste client feedback here…"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </>
                    )}

                    {/* VIDEO-SPECIFIC FIELDS */}
                    {type === "video" && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Video Review File *
                                <span className="font-normal text-slate-400 ml-1">
                                    (Compressed client-side via ffmpeg.wasm before upload)
                                </span>
                            </label>

                            {videoUrl ? (
                                <div className="space-y-3">
                                    <div className="relative rounded-xl overflow-hidden bg-black aspect-9/16 max-w-[200px] shadow-sm">
                                        <video
                                            src={videoUrl}
                                            controls
                                            playsInline
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <label
                                            htmlFor="video-upload"
                                            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            Replace Video
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setVideoUrl(null);
                                                setVideoStoragePath(null);
                                            }}
                                            className="text-xs text-red-600 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        ref={videoInputRef}
                                        type="file"
                                        accept="video/mp4,video/webm,video/quicktime"
                                        onChange={handleVideoUpload}
                                        className="hidden"
                                        id="video-upload"
                                        disabled={uploading}
                                    />
                                    <label
                                        htmlFor="video-upload"
                                        className={`cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-purple-500 hover:bg-purple-50/30 transition-all text-center ${
                                            uploading ? "opacity-50 pointer-events-none" : ""
                                        }`}
                                    >
                                        <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm font-semibold text-slate-700">
                                            Click to select video
                                        </span>
                                        <span className="text-xs text-slate-400 mt-1">
                                            MP4, WebM, MOV supported (client-side compressed)
                                        </span>
                                    </label>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Upload progress indicator */}
                    {uploading && (
                        <div className="rounded-xl bg-purple-50 border border-purple-200 p-4 space-y-2">
                            <div className="flex items-center justify-between text-xs font-semibold text-purple-900">
                                <span>{uploadStage || "Processing upload…"}</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-600 transition-all duration-300 rounded-full"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Pinned toggle */}
                    <div className="pt-2 border-t border-slate-100">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={pinned}
                                onChange={(e) => setPinned(e.target.checked)}
                                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                            />
                            <div>
                                <span className="text-xs font-semibold text-slate-800">
                                    Pin to Landing Page Carousel
                                </span>
                                <p className="text-[11px] text-slate-400">
                                    Featured in the continuous marquee carousel on the homepage.
                                </p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving || uploading}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving || uploading}
                        className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 transition-colors shadow-xs"
                    >
                        {saving ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Saving…
                            </>
                        ) : isEditing ? (
                            "Update Review"
                        ) : (
                            "Create Review"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
