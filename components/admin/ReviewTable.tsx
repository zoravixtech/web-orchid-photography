"use client";

import { useState } from "react";
import Image from "next/image";
import { deleteReview, togglePinReview } from "@/app/admin/actions/reviews";
import { useToast } from "@/components/admin/Toast";
import ReviewDialog from "@/components/admin/ReviewDialog";
import { PlatformLogo } from "@/components/PlatformLogo";
import type { Review } from "@/lib/types";

export default function ReviewTable({ initialReviews }: { initialReviews: Review[] }) {
    const toast = useToast();
    const [reviews, setReviews] = useState(initialReviews);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [togglingPinId, setTogglingPinId] = useState<string | null>(null);
    const [dialogReview, setDialogReview] = useState<Review | "new" | null>(null);

    const handleDelete = async (review: Review) => {
        if (!window.confirm(`Delete review from "${review.name}"?`)) return;
        setDeletingId(review.id);
        try {
            const res = await deleteReview(review.id);
            if (res.error) {
                toast.error(res.error);
                return;
            }
            setReviews((prev) => prev.filter((r) => r.id !== review.id));
            toast.success("Review deleted successfully.");
        } catch {
            toast.error("Failed to delete review.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleTogglePin = async (review: Review) => {
        setTogglingPinId(review.id);
        try {
            const res = await togglePinReview(review.id);
            if (res.error || !res.review) {
                toast.error(res.error ?? "Failed to toggle pin.");
                return;
            }
            setReviews((prev) =>
                prev.map((r) => (r.id === review.id ? res.review! : r))
            );
            toast.success(res.review.pinned ? "Review pinned to landing page." : "Review unpinned.");
        } catch {
            toast.error("Failed to update pin status.");
        } finally {
            setTogglingPinId(null);
        }
    };

    const handleSaved = (saved: Review) => {
        setReviews((prev) => {
            const exists = prev.some((r) => r.id === saved.id);
            return exists ? prev.map((r) => (r.id === saved.id ? saved : r)) : [saved, ...prev];
        });
    };

    return (
        <div className="w-full">
            <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Client testimonials and video stories shown on the /reviews page and landing page carousel.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setDialogReview("new")}
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Review
                </button>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                            <tr>
                                <th className="px-4 py-3.5">Reviewer</th>
                                <th className="px-4 py-3.5">Type</th>
                                <th className="px-4 py-3.5">Rating</th>
                                <th className="px-4 py-3.5">Content / Platform</th>
                                <th className="px-4 py-3.5 text-center">Pinned</th>
                                <th className="px-4 py-3.5 text-right w-56">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                                        No reviews created yet. Click{" "}
                                        <button
                                            type="button"
                                            onClick={() => setDialogReview("new")}
                                            className="text-purple-600 font-semibold hover:underline"
                                        >
                                            New Review
                                        </button>{" "}
                                        to add one.
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review) => (
                                    <tr key={review.id} className="hover:bg-slate-50/70 transition-colors">
                                        {/* Reviewer info */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                                    {review.userImage ? (
                                                        <Image
                                                            src={review.userImage}
                                                            alt={review.name}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    ) : review.type === "video" ? (
                                                        <div className="w-full h-full bg-purple-600 text-white flex items-center justify-center">
                                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                                <path d="M8 5v14l11-7z" />
                                                            </svg>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs font-bold text-slate-500">
                                                            {review.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-800">
                                                        {review.name}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Type badge */}
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                    review.type === "video"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-blue-100 text-blue-700"
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        review.type === "video" ? "bg-purple-500" : "bg-blue-500"
                                                    }`}
                                                />
                                                {review.type === "video" ? "Video" : "Text"}
                                            </span>
                                        </td>

                                        {/* Stars */}
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <div className="flex items-center gap-1 text-amber-400">
                                                {"★".repeat(review.stars)}
                                                <span className="text-xs font-semibold text-slate-600 ml-1">
                                                    ({review.stars})
                                                </span>
                                            </div>
                                        </td>

                                        {/* Content / Platform */}
                                        <td className="px-4 py-3.5 max-w-xs">
                                            {review.type === "text" ? (
                                                <div className="flex items-center gap-2">
                                                    <PlatformLogo platform={review.platform} className="w-4 h-4 shrink-0" />
                                                    <span className="text-xs text-slate-600 truncate max-w-[200px]" title={review.message ?? ""}>
                                                        {review.message}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-xs text-purple-600 font-medium">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                    <a
                                                        href={review.videoUrl ?? "#"}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline truncate max-w-[180px]"
                                                    >
                                                        Watch video
                                                    </a>
                                                </div>
                                            )}
                                        </td>

                                        {/* Pinned Indicator */}
                                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                            {review.pinned ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200/80">
                                                    <svg className="w-3 h-3 fill-amber-500" viewBox="0 0 24 24">
                                                        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" />
                                                    </svg>
                                                    Pinned
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400">—</span>
                                            )}
                                        </td>

                                        {/* Actions: Pin, Edit, Delete */}
                                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {/* Pin / Unpin Action */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleTogglePin(review)}
                                                    disabled={togglingPinId === review.id}
                                                    title={review.pinned ? "Unpin from landing page" : "Pin to landing page"}
                                                    className={`p-1.5 rounded-lg border text-xs font-medium transition-colors ${
                                                        review.pinned
                                                            ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                                            : "border-slate-200 text-slate-600 hover:bg-slate-100"
                                                    }`}
                                                >
                                                    <svg className="w-4 h-4" fill={review.pinned ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" />
                                                    </svg>
                                                </button>

                                                {/* Edit Action */}
                                                <button
                                                    type="button"
                                                    onClick={() => setDialogReview(review)}
                                                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                                >
                                                    Edit
                                                </button>

                                                {/* Delete Action */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(review)}
                                                    disabled={deletingId === review.id}
                                                    className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-medium transition-colors"
                                                >
                                                    {deletingId === review.id ? "…" : "Delete"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Dialog modal for create and edit */}
            {dialogReview && (
                <ReviewDialog
                    initialReview={dialogReview === "new" ? undefined : dialogReview}
                    onClose={() => setDialogReview(null)}
                    onSaved={handleSaved}
                />
            )}
        </div>
    );
}
