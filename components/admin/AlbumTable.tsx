"use client";

import { useState } from "react";
import Image from "next/image";
import { deleteAlbum } from "@/app/admin/actions/albums";
import { useToast } from "@/components/admin/Toast";
import AlbumDialog from "@/components/admin/AlbumDialog";
import type { Album, Org } from "@/lib/types";

export default function AlbumTable({ org, initialAlbums }: { org: Org; initialAlbums: Album[] }) {
    const toast = useToast();
    const [albums, setAlbums] = useState(initialAlbums);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [dialogAlbum, setDialogAlbum] = useState<Album | "new" | null>(null);

    const handleDelete = async (album: Album) => {
        if (!window.confirm(`Delete album "${album.name}"? This removes all ${album.images.length} of its images.`)) return;
        setDeletingId(album.id);
        try {
            const result = await deleteAlbum(album.id, org);
            if (result.error) {
                toast.error(result.error);
                return;
            }
            setAlbums((prev) => prev.filter((a) => a.id !== album.id));
            toast.success("Album deleted.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleSaved = (album: Album) => {
        setAlbums((prev) => {
            const exists = prev.some((a) => a.id === album.id);
            return exists ? prev.map((a) => (a.id === album.id ? album : a)) : [album, ...prev];
        });
    };

    return (
        <div className="w-full">
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 capitalize">{org} Albums</h1>
                    <p className="text-sm text-slate-500 mt-1">Curated collections shown on the homepage.</p>
                </div>
                <button
                    type="button"
                    onClick={() => setDialogAlbum("new")}
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Album
                </button>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left font-semibold text-slate-500 px-4 py-3">Cover</th>
                            <th className="text-left font-semibold text-slate-500 px-4 py-3">Name</th>
                            <th className="text-left font-semibold text-slate-500 px-4 py-3">Slug</th>
                            <th className="text-left font-semibold text-slate-500 px-4 py-3">Images</th>
                            <th className="text-right font-semibold text-slate-500 px-4 py-3 w-40">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {albums.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                                    No albums yet. Click <span className="text-purple-600 font-medium">New Album</span> to create one.
                                </td>
                            </tr>
                        ) : (
                            albums.map((album) => (
                                <tr key={album.id}>
                                    <td className="px-4 py-3">
                                        <div className="relative w-14 h-10 rounded-md overflow-hidden bg-slate-100">
                                            <Image src={album.coverImage} alt={album.name} fill className="object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-800 font-medium whitespace-nowrap">{album.name}</td>
                                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{album.slug}</td>
                                    <td className="px-4 py-3 text-slate-500">{album.images.length}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setDialogAlbum(album)}
                                                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(album)}
                                                disabled={deletingId === album.id}
                                                className="rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-3 py-1.5 text-xs font-medium transition-colors"
                                            >
                                                {deletingId === album.id ? "…" : "Delete"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {dialogAlbum && (
                <AlbumDialog
                    org={org}
                    initialAlbum={dialogAlbum === "new" ? undefined : dialogAlbum}
                    onClose={() => setDialogAlbum(null)}
                    onSaved={handleSaved}
                />
            )}
        </div>
    );
}
