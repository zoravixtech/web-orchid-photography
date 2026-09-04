"use client";

import { useState } from "react";
import { createCategory, updateCategory, deleteCategory } from "@/app/admin/actions/categories";
import { useToast } from "@/components/admin/Toast";
import type { Category, Org } from "@/lib/types";

export default function CategoryManager({ org, initialCategories }: { org: Org; initialCategories: Category[] }) {
    const toast = useToast();
    const [categories, setCategories] = useState(initialCategories);
    const [modalCategory, setModalCategory] = useState<Category | "new" | null>(null);
    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const openCreate = () => {
        setName("");
        setModalCategory("new");
    };

    const openEdit = (category: Category) => {
        setName(category.name);
        setModalCategory(category);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (modalCategory === "new") {
                const result = await createCategory(org, name);
                if (result.error || !result.category) {
                    toast.error(result.error ?? "Failed to create category.");
                    return;
                }
                setCategories((prev) => [...prev, result.category!]);
                toast.success("Category created.");
            } else if (modalCategory) {
                const result = await updateCategory(modalCategory.id, org, name);
                if (result.error || !result.category) {
                    toast.error(result.error ?? "Failed to update category.");
                    return;
                }
                setCategories((prev) => prev.map((c) => (c.id === result.category!.id ? result.category! : c)));
                toast.success("Category updated.");
            }
            setModalCategory(null);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (category: Category) => {
        if (!window.confirm(`Delete category "${category.name}"? Images in it are not deleted.`)) return;
        setDeletingId(category.id);
        try {
            const result = await deleteCategory(category.id, org);
            if (result.error) {
                toast.error(result.error);
                return;
            }
            setCategories((prev) => prev.filter((c) => c.id !== category.id));
            toast.success("Category deleted.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="w-full">
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 capitalize">{org} Categories</h1>
                    <p className="text-sm text-slate-500 mt-1">Tags used to organize the {org} media library.</p>
                </div>
                <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Category
                </button>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left font-semibold text-slate-500 px-4 py-3">Name</th>
                            <th className="text-right font-semibold text-slate-500 px-4 py-3 w-40">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="px-4 py-8 text-center text-slate-400">
                                    No categories yet. Click <span className="text-purple-600 font-medium">New Category</span> to add one.
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id}>
                                    <td className="px-4 py-3 text-slate-800">{category.name}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(category)}
                                                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(category)}
                                                disabled={deletingId === category.id}
                                                className="rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-3 py-1.5 text-xs font-medium transition-colors"
                                            >
                                                {deletingId === category.id ? "…" : "Delete"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {modalCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-6 border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">
                            {modalCategory === "new" ? "New Category" : "Edit Category"}
                        </h3>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Category name"
                            autoFocus
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6"
                        />
                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setModalCategory(null)}
                                disabled={saving}
                                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving || !name.trim()}
                                className="rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 transition-colors"
                            >
                                {saving ? "Saving…" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
