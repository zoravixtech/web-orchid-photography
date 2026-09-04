"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import UploadModal from "@/components/admin/UploadModal";
import { useToast } from "@/components/admin/Toast";
import { useAdminGalleryStore } from "@/stores/adminGalleryStore";
import type { Category, GalleryMediaItem, Org } from "@/lib/types";

interface MediaLibraryManagerProps {
    org: Org;
    categories: Category[];
    activeCategoryId: string | null;
    initialImages: GalleryMediaItem[];
    initialHeroCarouselIds: string[];
}

// Stable reference so the zustand selector below never returns a fresh
// object literal when a category hasn't been hydrated yet — returning a new
// object on every call would make useSyncExternalStore think the snapshot
// changed on every render, triggering React's "getSnapshot should be
// cached" infinite-loop warning.
const EMPTY_STATE: { images: GalleryMediaItem[]; heroCarouselIds: Set<string> } = {
    images: [],
    heroCarouselIds: new Set(),
};

export default function MediaLibraryManager({
    org,
    categories,
    activeCategoryId,
    initialImages,
    initialHeroCarouselIds,
}: MediaLibraryManagerProps) {
    const toast = useToast();
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmDeleteAllOpen, setConfirmDeleteAllOpen] = useState(false);
    const [isDeletingAll, setIsDeletingAll] = useState(false);
    const [isBulkPending, setIsBulkPending] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const categoryId = activeCategoryId ?? "";
    const { images, heroCarouselIds } = useAdminGalleryStore((state) => state.byCategory[categoryId] ?? EMPTY_STATE);
    const hydrate = useAdminGalleryStore((state) => state.hydrate);
    const addImages = useAdminGalleryStore((state) => state.addImages);
    const deleteAllImages = useAdminGalleryStore((state) => state.deleteAllImages);
    const bulkTogglePinned = useAdminGalleryStore((state) => state.bulkTogglePinned);
    const bulkToggleHero = useAdminGalleryStore((state) => state.bulkToggleHero);
    const bulkDelete = useAdminGalleryStore((state) => state.bulkDelete);

    useEffect(() => {
        if (!activeCategoryId) return;
        hydrate(activeCategoryId, initialImages, initialHeroCarouselIds);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCategoryId, initialImages, initialHeroCarouselIds]);

    // Selection resets when switching category tabs so stale ids from
    // another category's grid never linger in the selection set. Adjusted
    // synchronously during render (not in an effect) to avoid an extra
    // render pass with the stale selection still visible.
    const [prevCategoryId, setPrevCategoryId] = useState(activeCategoryId);
    if (prevCategoryId !== activeCategoryId) {
        setPrevCategoryId(activeCategoryId);
        setSelectedIds(new Set());
    }

    const activeCategory = categories.find((c) => c.id === activeCategoryId) ?? null;

    const pinnedCount = useMemo(() => images.filter((image) => image.pinned).length, [images]);
    const heroCount = useMemo(() => images.filter((image) => heroCarouselIds.has(image.id)).length, [images, heroCarouselIds]);

    const selectedImages = useMemo(() => images.filter((image) => selectedIds.has(image.id)), [images, selectedIds]);
    const allSelectedPinned = selectedImages.length > 0 && selectedImages.every((image) => image.pinned);
    const allSelectedHero = selectedImages.length > 0 && selectedImages.every((image) => heroCarouselIds.has(image.id));

    const handleImageClick = (e: React.MouseEvent, id: string) => {
        if (e.ctrlKey || e.metaKey) {
            setSelectedIds((prev) => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
            });
        } else {
            setSelectedIds((prev) => (prev.size === 1 && prev.has(id) ? new Set() : new Set([id])));
        }
    };

    const clearSelection = () => setSelectedIds(new Set());

    const handleDeleteAll = async () => {
        if (!activeCategoryId) return;
        setIsDeletingAll(true);
        const result = await deleteAllImages(org, activeCategoryId);
        setIsDeletingAll(false);
        setConfirmDeleteAllOpen(false);
        if (result.error) toast.error(result.error);
        else {
            toast.success(`Deleted all images in ${activeCategory?.name ?? "this category"}.`);
            clearSelection();
        }
    };

    const handleBulkPin = async () => {
        const ids = [...selectedIds];
        const nextPinned = !allSelectedPinned;
        setIsBulkPending(true);
        const result = await bulkTogglePinned(categoryId, ids, nextPinned);
        setIsBulkPending(false);
        if (result.error) toast.error(result.error);
        else toast.success(nextPinned ? `Pinned ${ids.length} image${ids.length === 1 ? "" : "s"}.` : `Unpinned ${ids.length} image${ids.length === 1 ? "" : "s"}.`);
    };

    const handleBulkHero = async () => {
        const ids = [...selectedIds];
        const nextSelected = !allSelectedHero;
        setIsBulkPending(true);
        const result = await bulkToggleHero(categoryId, ids, nextSelected);
        setIsBulkPending(false);
        if (result.error) toast.error(result.error);
        else toast.success(nextSelected ? `Set ${ids.length} image${ids.length === 1 ? "" : "s"} as hero.` : `Removed ${ids.length} image${ids.length === 1 ? "" : "s"} from hero carousel.`);
    };

    const handleBulkDelete = async () => {
        const ids = [...selectedIds];
        if (!window.confirm(`Delete ${ids.length} selected image${ids.length === 1 ? "" : "s"}? This cannot be undone.`)) return;
        setIsBulkPending(true);
        const result = await bulkDelete(categoryId, ids);
        setIsBulkPending(false);
        if (result.error) toast.error(result.error);
        else toast.success(`Deleted ${result.deletedCount ?? ids.length} image${(result.deletedCount ?? ids.length) === 1 ? "" : "s"}.`);
        clearSelection();
    };

    const handleUploaded = (items: GalleryMediaItem[]) => {
        if (activeCategoryId) addImages(activeCategoryId, items);
    };

    return (
        <div className="w-full">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 capitalize">{org} Gallery</h1>
                <p className="text-sm text-slate-500 mt-1">Manage the media library, organized by category.</p>
            </header>

            {categories.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                    <p className="text-sm text-slate-500">
                        No categories yet. Create one in{" "}
                        <Link href={`/admin/${org}/categories`} className="text-purple-600 font-medium">
                            Categories
                        </Link>{" "}
                        before uploading images.
                    </p>
                </div>
            ) : (
                <>
                    {/* Category tabs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/admin/${org}/gallery?category=${category.id}`}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                    category.id === activeCategoryId
                                        ? "bg-purple-600 text-white border-purple-600"
                                        : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                                }`}
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                                {activeCategory?.name} ({images.length})
                            </h2>
                            <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold px-2 py-1">
                                {pinnedCount} pinned
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 text-amber-700 text-xs font-semibold px-2 py-1">
                                {heroCount} hero
                            </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => setModalOpen(true)}
                                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Upload
                            </button>

                            <button
                                type="button"
                                onClick={() => setConfirmDeleteAllOpen(true)}
                                disabled={images.length === 0 || isDeletingAll}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-semibold px-4 py-2.5 transition-colors disabled:cursor-not-allowed"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete All
                            </button>
                        </div>
                    </div>

                    {images.length === 0 ? (
                        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                            <p className="text-sm text-slate-500">
                                No images yet. Click <span className="font-semibold text-purple-600">Upload</span> to add some.
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-xs text-slate-400 mb-3">
                                Click an image to select it, Ctrl/Cmd+click to select multiple.
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0.5">
                                {images.map((item) => {
                                    const isSelected = selectedIds.has(item.id);
                                    return (
                                        <button
                                            type="button"
                                            key={item.id}
                                            onClick={(e) => handleImageClick(e, item.id)}
                                            className={`relative aspect-4/3 overflow-hidden bg-slate-200 border-2 transition-colors text-left ${
                                                isSelected ? "border-purple-600" : "border-slate-200"
                                            }`}
                                        >
                                            <Image
                                                src={item.url}
                                                alt={item.alt || "Gallery image"}
                                                fill
                                                loading="lazy"
                                                decoding="async"
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                                className="object-cover"
                                            />

                                            {isSelected && (
                                                <div className="absolute inset-0 bg-purple-600/20" />
                                            )}

                                            {/* Persistent badges showing state without needing to hover */}
                                            <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                                                {heroCarouselIds.has(item.id) && (
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500 text-white text-[10px] font-semibold px-1.5 py-1 shadow">
                                                        Hero
                                                    </span>
                                                )}
                                                {item.pinned && (
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-purple-600 text-white text-[10px] font-semibold px-1.5 py-1 shadow">
                                                        Pinned
                                                    </span>
                                                )}
                                            </div>

                                            {isSelected && (
                                                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </>
            )}

            {activeCategoryId && (
                <UploadModal
                    open={modalOpen}
                    org={org}
                    categoryId={activeCategoryId}
                    categoryName={activeCategory?.name ?? ""}
                    onClose={() => setModalOpen(false)}
                    onUploaded={handleUploaded}
                />
            )}

            {confirmDeleteAllOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 border border-slate-200 animate-in fade-in zoom-in duration-150">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete All Images?</h3>
                        <p className="text-sm text-slate-600 mb-6">
                            Are you sure you want to permanently delete all{" "}
                            <span className="font-semibold text-slate-900">{images.length}</span> images in{" "}
                            {activeCategory?.name}? This action cannot be undone.
                        </p>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmDeleteAllOpen(false)}
                                disabled={isDeletingAll}
                                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteAll}
                                disabled={isDeletingAll}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                            >
                                {isDeletingAll ? "Deleting..." : "Confirm Delete All"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating bulk-action toolbar, shown only while images are selected */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4">
                    <span className="text-sm font-semibold whitespace-nowrap">{selectedIds.size} selected</span>

                    <div className="h-6 w-px bg-slate-700" />

                    <button
                        type="button"
                        onClick={handleBulkPin}
                        disabled={isBulkPending}
                        className={`inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold px-3 py-2 transition-colors disabled:opacity-60 ${
                            allSelectedPinned ? "bg-purple-600 hover:bg-purple-500" : "bg-slate-700 hover:bg-slate-600"
                        }`}
                    >
                        {allSelectedPinned ? "Unpin" : "Pin"}
                    </button>

                    <button
                        type="button"
                        onClick={handleBulkHero}
                        disabled={isBulkPending}
                        className={`inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold px-3 py-2 transition-colors disabled:opacity-60 ${
                            allSelectedHero ? "bg-amber-500 hover:bg-amber-400" : "bg-slate-700 hover:bg-slate-600"
                        }`}
                    >
                        {allSelectedHero ? "Unset Hero" : "Set as Hero"}
                    </button>

                    <button
                        type="button"
                        onClick={handleBulkDelete}
                        disabled={isBulkPending}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-semibold px-3 py-2 transition-colors disabled:opacity-60"
                    >
                        Delete
                    </button>

                    <div className="h-6 w-px bg-slate-700" />

                    <button
                        type="button"
                        onClick={clearSelection}
                        disabled={isBulkPending}
                        className="text-xs font-medium text-slate-300 hover:text-white transition-colors disabled:opacity-60"
                    >
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
}
