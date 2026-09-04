"use client";

import { useState } from "react";
import { createCareer, updateCareer } from "@/app/admin/actions/careers";
import { useToast } from "@/components/admin/Toast";
import type { CareerPost } from "@/lib/types";

interface CareerDialogProps {
    initialCareer?: CareerPost;
    onClose: () => void;
    onSaved: (career: CareerPost) => void;
}

export default function CareerDialog({ initialCareer, onClose, onSaved }: CareerDialogProps) {
    const toast = useToast();
    const [title, setTitle] = useState(initialCareer?.title ?? "");
    const [description, setDescription] = useState(initialCareer?.description ?? "");
    const [link, setLink] = useState(initialCareer?.link ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const result = initialCareer
                ? await updateCareer(initialCareer.id, { title, description, link })
                : await createCareer({ title, description, link });

            if (result.error || !result.career) {
                setError(result.error ?? "Failed to save job posting.");
                return;
            }
            onSaved(result.career);
            toast.success(initialCareer ? "Job posting updated." : "Job posting created.");
            onClose();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs" role="dialog" aria-modal="true">
            <form
                onSubmit={handleSave}
                className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {initialCareer ? "Edit Job Posting" : "New Job Posting"}
                    </h2>
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

                <div className="p-6 space-y-5">
                    {error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="career-title" className="block text-xs font-medium text-slate-500 mb-1">
                            Title
                        </label>
                        <input
                            id="career-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g. Wedding Photographer"
                        />
                    </div>

                    <div>
                        <label htmlFor="career-description" className="block text-xs font-medium text-slate-500 mb-1">
                            Description
                        </label>
                        <textarea
                            id="career-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={6}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Role responsibilities, requirements, and application details…"
                        />
                    </div>

                    <div>
                        <label htmlFor="career-link" className="block text-xs font-medium text-slate-500 mb-1">
                            Application Link
                        </label>
                        <input
                            id="career-link"
                            type="url"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="https://forms.gle/..."
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving || !title.trim() || !description.trim() || !link.trim()}
                        className="rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 transition-colors"
                    >
                        {saving ? "Saving…" : initialCareer ? "Save Changes" : "Publish Job"}
                    </button>
                </div>
            </form>
        </div>
    );
}
