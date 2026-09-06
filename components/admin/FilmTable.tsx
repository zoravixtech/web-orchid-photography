"use client";

import { useState } from "react";
import Image from "next/image";
import { deleteFilm } from "@/app/admin/actions/films";
import { useToast } from "@/components/admin/Toast";
import FilmDialog from "@/components/admin/FilmDialog";
import type { Film } from "@/lib/types";

export default function FilmTable({ initialFilms }: { initialFilms: Film[] }) {
    const toast = useToast();
    const [films, setFilms] = useState(initialFilms);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [dialogFilm, setDialogFilm] = useState<Film | "new" | null>(null);

    const handleDelete = async (film: Film) => {
        if (!window.confirm(`Delete film "${film.title}"?`)) return;
        setDeletingId(film.id);
        try {
            const res = await deleteFilm(film.id);
            if (res.error) {
                toast.error(res.error);
                return;
            }
            setFilms((prev) => prev.filter((f) => f.id !== film.id));
            toast.success("Film deleted successfully.");
        } catch {
            toast.error("Failed to delete film.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleSaved = (saved: Film) => {
        setFilms((prev) => {
            const exists = prev.some((f) => f.id === saved.id);
            return exists ? prev.map((f) => (f.id === saved.id ? saved : r(f))) : [saved, ...prev];
        });
    };

    function r(f: Film) {
        return f;
    }

    return (
        <div className="w-full">
            <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Films</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Wedding films and cinematic videos displayed on the public <span className="font-mono text-purple-600">/films</span> page.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setDialogFilm("new")}
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Film
                </button>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                            <tr>
                                <th className="px-4 py-3.5">Video & Title</th>
                                <th className="px-4 py-3.5">YouTube Link</th>
                                <th className="px-4 py-3.5">Date Added</th>
                                <th className="px-4 py-3.5 text-right w-40">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {films.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-12 text-center text-slate-400">
                                        No films added yet. Click{" "}
                                        <button
                                            type="button"
                                            onClick={() => setDialogFilm("new")}
                                            className="text-purple-600 hover:underline font-medium"
                                        >
                                            Add Film
                                        </button>{" "}
                                        to add your first YouTube video.
                                    </td>
                                </tr>
                            ) : (
                                films.map((film) => (
                                    <tr key={film.id} className="hover:bg-slate-50/70 transition-colors">
                                        {/* Video & Title */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200 shadow-2xs group">
                                                    <Image
                                                        src={film.thumbnailUrl}
                                                        alt={film.title}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                        <div className="w-6 h-6 rounded-full bg-amber-500/90 text-white flex items-center justify-center">
                                                            <svg className="w-3 h-3 fill-current translate-x-0.5" viewBox="0 0 448 512">
                                                                <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                                                        {film.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                                                        ID: {film.videoId}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* YouTube Link */}
                                        <td className="px-4 py-3.5">
                                            <a
                                                href={film.youtubeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 hover:underline font-mono"
                                            >
                                                <span>Watch on YouTube</span>
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </td>

                                        {/* Date Added */}
                                        <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                                            {film.createdAt
                                                ? new Date(film.createdAt).toLocaleDateString("en-US", {
                                                      month: "short",
                                                      day: "numeric",
                                                      year: "numeric",
                                                  })
                                                : "—"}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="inline-flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setDialogFilm(film)}
                                                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                                                    title="Edit film"
                                                    aria-label={`Edit ${film.title}`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(film)}
                                                    disabled={deletingId === film.id}
                                                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                                                    title="Delete film"
                                                    aria-label={`Delete ${film.title}`}
                                                >
                                                    {deletingId === film.id ? (
                                                        <svg className="w-4 h-4 animate-spin text-red-500" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    )}
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

            {/* Dialog */}
            {dialogFilm && (
                <FilmDialog
                    initialFilm={dialogFilm === "new" ? undefined : dialogFilm}
                    onClose={() => setDialogFilm(null)}
                    onSaved={handleSaved}
                />
            )}
        </div>
    );
}
