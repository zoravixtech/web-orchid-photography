"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createAlbum, updateAlbum, addAlbumImages, removeAlbumImage } from "@/app/admin/actions/albums";
import { uploadFile } from "@/lib/uploadClient";
import { useToast } from "@/components/admin/Toast";
import { mapWithConcurrencyLimit } from "@/lib/concurrency";
import CoverPositionPicker from "@/components/admin/CoverPositionPicker";
import type { Album, Org } from "@/lib/types";

interface AlbumDialogProps {
    org: Org;
    /** Pass an existing album to open in edit mode; omit to open in create mode. */
    initialAlbum?: Album;
    onClose: () => void;
    /** Called whenever the album is created or updated, so the table list stays in sync. */
    onSaved: (album: Album) => void;
}

export default function AlbumDialog({ org, initialAlbum, onClose, onSaved }: AlbumDialogProps) {
    const toast = useToast();
    // Once created, `album` holds the persisted record and the dialog flips
    // from the create form into the full edit+image-management view — all
    // without navigating away or closing the dialog.
    const [album, setAlbum] = useState<Album | null>(initialAlbum ?? null);
    const [name, setName] = useState(initialAlbum?.name ?? "");
    const [coverImage, setCoverImage] = useState(initialAlbum?.coverImage ?? "");
    const [coverPosition, setCoverPosition] = useState(initialAlbum?.coverPosition || "50% 50%");
    const [address, setAddress] = useState(initialAlbum?.address ?? "");
    const [venue, setVenue] = useState(initialAlbum?.venue ?? "");
    const [category, setCategory] = useState(initialAlbum?.category ?? "");
    const [creating, setCreating] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [coverProgress, setCoverProgress] = useState(0);
    const [savingDetails, setSavingDetails] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [imagesProgress, setImagesProgress] = useState(0);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const imagesInputRef = useRef<HTMLInputElement>(null);

    const handleUploadCover = async (file: File) => {
        setUploadingCover(true);
        setCoverProgress(0);
        try {
            const { publicUrl } = await uploadFile("albumCover", file, name || "Album cover", {}, setCoverProgress);
            setCoverImage(publicUrl);
            // A freshly uploaded image has no meaningful focal point yet.
            setCoverPosition("50% 50%");

            // If we're editing an already-created album, persist the new
            // cover immediately; in create mode it's just held in state
            // until the album itself is created below.
            if (album) {
                const result = await updateAlbum(album.id, org, { coverImage: publicUrl, coverPosition: "50% 50%" });
                if (result.error || !result.album) {
                    toast.error(result.error ?? "Failed to save cover image.");
                    return;
                }
                setAlbum(result.album);
                onSaved(result.album);
                toast.success("Cover image updated.");
            }
        } catch (err) {
            console.error("Album cover upload failed:", err);
            toast.error(err instanceof Error ? err.message : "Cover image upload failed.");
        } finally {
            setUploadingCover(false);
            setCoverProgress(0);
        }
    };

    const handleCoverPositionCommit = async (nextPosition: string) => {
        if (!album || nextPosition === album.coverPosition) return;
        try {
            const result = await updateAlbum(album.id, org, { coverPosition: nextPosition });
            if (result.error || !result.album) {
                toast.error(result.error ?? "Failed to save cover position.");
                return;
            }
            setAlbum(result.album);
            onSaved(result.album);
        } catch (err) {
            console.error("Album cover position update failed:", err);
            toast.error(err instanceof Error ? err.message : "Failed to save cover position.");
        }
    };

    const handleCreate = async () => {
        if (!name.trim() || !coverImage) return;
        setCreating(true);
        try {
            const result = await createAlbum(org, {
                name,
                coverImage,
                coverPosition,
                address: address.trim(),
                venue: venue.trim(),
                category: category.trim(),
            });
            if (result.error || !result.album) {
                toast.error(result.error ?? "Failed to create album.");
                return;
            }
            setAlbum(result.album);
            onSaved(result.album);
            toast.success("Album created — you can now add images below.");
        } catch (err) {
            console.error("Album creation failed:", err);
            toast.error(err instanceof Error ? err.message : "Failed to create album.");
        } finally {
            setCreating(false);
        }
    };

    const detailsChanged =
        !!album &&
        (name.trim() !== album.name ||
            address.trim() !== album.address ||
            venue.trim() !== album.venue ||
            category.trim() !== album.category);

    const handleSaveDetails = async () => {
        if (!album || !name.trim() || !detailsChanged) return;
        setSavingDetails(true);
        try {
            const result = await updateAlbum(album.id, org, {
                name: name.trim(),
                address: address.trim(),
                venue: venue.trim(),
                category: category.trim(),
            });
            if (result.error || !result.album) {
                toast.error(result.error ?? "Failed to update album details.");
                return;
            }
            setAlbum(result.album);
            onSaved(result.album);
            toast.success("Album details updated.");
        } finally {
            setSavingDetails(false);
        }
    };

    const handleUploadImages = async (files: File[]) => {
        if (!album || files.length === 0) return;
        setUploadingImages(true);
        setImagesProgress(0);
        const perFileProgress = new Array(files.length).fill(0);
        const updateProgress = () => {
            const total = perFileProgress.reduce((sum, value) => sum + value, 0);
            setImagesProgress(total / files.length);
        };
        try {
            const uploaded = await mapWithConcurrencyLimit(files, 3, (file, index) =>
                uploadFile("albumImage", file, album.name, {}, (fraction) => {
                    perFileProgress[index] = fraction;
                    updateProgress();
                })
            );
            const result = await addAlbumImages(
                album.id,
                org,
                uploaded.map((item) => ({ url: item.publicUrl, storagePath: item.storagePath, alt: album.name }))
            );
            if (result.error || !result.album) {
                toast.error(result.error ?? "Failed to add images.");
                return;
            }
            setAlbum(result.album);
            onSaved(result.album);
            toast.success(`${files.length} image${files.length === 1 ? "" : "s"} added.`);
        } catch (err) {
            console.error("Album image upload failed:", err);
            toast.error(err instanceof Error ? err.message : "Image upload failed.");
        } finally {
            setUploadingImages(false);
            setImagesProgress(0);
        }
    };

    const handleRemoveImage = async (imageId: string) => {
        if (!album) return;
        setRemovingId(imageId);
        try {
            const result = await removeAlbumImage(album.id, org, imageId);
            if (result.error || !result.album) {
                toast.error(result.error ?? "Failed to remove image.");
                return;
            }
            setAlbum(result.album);
            onSaved(result.album);
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs" role="dialog" aria-modal="true">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-semibold text-slate-900">{album ? "Edit Album" : "New Album"}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <section className="space-y-4">
                        <div>
                            <p className="block text-xs font-medium text-slate-500 mb-1">Cover Image</p>
                            {coverImage ? (
                                <CoverPositionPicker
                                    src={coverImage}
                                    position={coverPosition}
                                    onChange={setCoverPosition}
                                    onCommit={handleCoverPositionCommit}
                                />
                            ) : (
                                <div className="w-full aspect-21/9 rounded-lg overflow-hidden bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center">
                                    <span className="text-xs text-slate-400">No image</span>
                                </div>
                            )}
                            <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUploadCover(file);
                                    e.target.value = "";
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => coverInputRef.current?.click()}
                                disabled={uploadingCover}
                                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white text-xs px-3 py-1.5 hover:bg-slate-800 disabled:opacity-60 transition-colors"
                            >
                                {uploadingCover ? `Uploading… ${Math.round(coverProgress * 100)}%` : album ? "Replace cover" : "Upload cover"}
                            </button>
                            {uploadingCover && (
                                <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                                    <div
                                        className="h-full bg-purple-600 transition-all duration-200"
                                        style={{ width: `${Math.round(coverProgress * 100)}%` }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label htmlFor="album-name" className="block text-xs font-medium text-slate-500 mb-1">
                                    Name
                                </label>
                                <input
                                    id="album-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Rahul & Priya's Wedding"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                {album ? (
                                    <p className="text-xs text-slate-400 mt-1">/{album.slug}</p>
                                ) : (
                                    <p className="text-xs text-slate-400 mt-1">The URL slug is generated automatically from the name.</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="album-venue" className="block text-xs font-medium text-slate-500 mb-1">
                                    Venue
                                </label>
                                <input
                                    id="album-venue"
                                    type="text"
                                    value={venue}
                                    onChange={(e) => setVenue(e.target.value)}
                                    placeholder="e.g. ITC Fortune Park"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="album-address" className="block text-xs font-medium text-slate-500 mb-1">
                                    Address
                                </label>
                                <input
                                    id="album-address"
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="e.g. Panchwati, Kolkata"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="album-category" className="block text-xs font-medium text-slate-500 mb-1">
                                    Category
                                </label>
                                <input
                                    id="album-category"
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="e.g. Big Fat Marwari Wedding"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        {album ? (
                            <button
                                type="button"
                                onClick={handleSaveDetails}
                                disabled={savingDetails || !name.trim() || !detailsChanged}
                                className="rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 transition-colors"
                            >
                                {savingDetails ? "Saving…" : "Save Details"}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleCreate}
                                disabled={creating || uploadingCover || !name.trim() || !coverImage}
                                className="rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 transition-colors"
                            >
                                {creating ? "Creating…" : "Create Album"}
                            </button>
                        )}
                    </section>

                    {album && (
                        <section>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                                    Images ({album.images.length})
                                </h3>
                                <div>
                                    <input
                                        ref={imagesInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files ?? []);
                                            if (files.length > 0) handleUploadImages(files);
                                            e.target.value = "";
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => imagesInputRef.current?.click()}
                                        disabled={uploadingImages}
                                        className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 transition-colors disabled:opacity-60"
                                    >
                                        {uploadingImages ? `Uploading… ${Math.round(imagesProgress * 100)}%` : "Upload Images"}
                                    </button>
                                    {uploadingImages && (
                                        <div className="w-40 h-1 bg-slate-100 rounded-full overflow-hidden mt-1.5 ml-auto">
                                            <div
                                                className="h-full bg-purple-600 transition-all duration-200"
                                                style={{ width: `${Math.round(imagesProgress * 100)}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {album.images.length === 0 ? (
                                <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-8 text-center">
                                    <p className="text-sm text-slate-500">
                                        No images yet. Click <span className="font-semibold text-purple-600">Upload Images</span> to add some.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                                    {album.images.map((image) => (
                                        <div key={image.id} className="group relative aspect-4/3 overflow-hidden bg-slate-200 border border-slate-200 rounded-md">
                                            <Image src={image.url} alt={image.alt || album.name} fill loading="lazy" sizes="25vw" className="object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(image.id)}
                                                    disabled={removingId === image.id}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-2.5 py-1.5 transition-colors disabled:opacity-60"
                                                >
                                                    {removingId === image.id ? "…" : "Remove"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 sticky bottom-0 bg-white">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        {album ? "Done" : "Cancel"}
                    </button>
                </div>
            </div>
        </div>
    );
}
