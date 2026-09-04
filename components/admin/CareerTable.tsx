"use client";

import { useState } from "react";
import { deleteCareer } from "@/app/admin/actions/careers";
import { useToast } from "@/components/admin/Toast";
import CareerDialog from "@/components/admin/CareerDialog";
import type { CareerPost } from "@/lib/types";

export default function CareerTable({ initialCareers }: { initialCareers: CareerPost[] }) {
    const toast = useToast();
    const [careers, setCareers] = useState(initialCareers);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [dialogCareer, setDialogCareer] = useState<CareerPost | "new" | null>(null);

    const handleDelete = async (career: CareerPost) => {
        if (!window.confirm(`Delete job posting "${career.title}"?`)) return;
        setDeletingId(career.id);
        try {
            const result = await deleteCareer(career.id);
            if (result.error) {
                toast.error(result.error);
                return;
            }
            setCareers((prev) => prev.filter((c) => c.id !== career.id));
            toast.success("Job posting deleted.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleSaved = (career: CareerPost) => {
        setCareers((prev) => {
            const exists = prev.some((c) => c.id === career.id);
            return exists ? prev.map((c) => (c.id === career.id ? career : c)) : [career, ...prev];
        });
    };

    return (
        <div className="w-full">
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Career</h1>
                    <p className="text-sm text-slate-500 mt-1">Job postings shown on the shared /career page.</p>
                </div>
                <button
                    type="button"
                    onClick={() => setDialogCareer("new")}
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Job
                </button>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left font-semibold text-slate-500 px-4 py-3">Title</th>
                            <th className="text-left font-semibold text-slate-500 px-4 py-3">Description</th>
                            <th className="text-left font-semibold text-slate-500 px-4 py-3">Link</th>
                            <th className="text-right font-semibold text-slate-500 px-4 py-3 w-40">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {careers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                                    No job postings yet. Click <span className="text-purple-600 font-medium">New Job</span> to add one.
                                </td>
                            </tr>
                        ) : (
                            careers.map((career) => (
                                <tr key={career.id}>
                                    <td className="px-4 py-3 text-slate-800 font-medium whitespace-nowrap">{career.title}</td>
                                    <td className="px-4 py-3 text-slate-500 max-w-sm truncate">{career.description}</td>
                                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                                        <a href={career.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                                            {career.link}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setDialogCareer(career)}
                                                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(career)}
                                                disabled={deletingId === career.id}
                                                className="rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-3 py-1.5 text-xs font-medium transition-colors"
                                            >
                                                {deletingId === career.id ? "…" : "Delete"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {dialogCareer && (
                <CareerDialog
                    initialCareer={dialogCareer === "new" ? undefined : dialogCareer}
                    onClose={() => setDialogCareer(null)}
                    onSaved={handleSaved}
                />
            )}
        </div>
    );
}
