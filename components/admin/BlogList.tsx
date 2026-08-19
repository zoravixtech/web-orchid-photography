"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { deleteBlog } from "@/app/admin/actions/blogs";
import { useToast } from "@/components/admin/Toast";
import type { BlogPost } from "@/lib/types";

export default function BlogList({ blogs }: { blogs: BlogPost[] }) {
    const router = useRouter();
    const toast = useToast();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleDelete = (id: string) => {
        if (!window.confirm("Delete this blog post? This cannot be undone.")) return;
        startTransition(async () => {
            const result = await deleteBlog(id);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Blog post deleted.");
                router.refresh();
            }
        });
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <ul className="divide-y divide-slate-100">
                {blogs.map((blog) => (
                    <li key={blog.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                        <div className="w-20 h-14 shrink-0 rounded-lg overflow-hidden bg-slate-200 border border-slate-100">
                            <Image
                                src={blog.image}
                                alt={blog.title}
                                width={80}
                                height={56}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-slate-900 truncate">{blog.title}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {blog.slug} · {blog.views} views
                            </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Link
                                href={`/blog/${blog.slug}`}
                                target="_blank"
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                View
                            </Link>
                            <Link
                                href={`/admin/blogs/${blog.id}/edit`}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                Edit
                            </Link>
                            <button
                                type="button"
                                onClick={() => {
                                    setDeletingId(blog.id);
                                    handleDelete(blog.id);
                                }}
                                disabled={isPending}
                                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 transition-colors"
                            >
                                {deletingId === blog.id && isPending ? "Deleting…" : "Delete"}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}