"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/admin/Toast";
import { useAdminBlogStore } from "@/stores/adminBlogStore";
import type { BlogPost } from "@/lib/types";

export default function BlogList({ initialBlogs }: { initialBlogs: BlogPost[] }) {
    const toast = useToast();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Reads the live store — on a revisit within this session this is
    // already populated, so the list paints instantly.
    const posts = useAdminBlogStore((state) => state.posts);
    const hydrate = useAdminBlogStore((state) => state.hydrate);
    const deletePost = useAdminBlogStore((state) => state.deletePost);

    useEffect(() => {
        hydrate(initialBlogs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialBlogs]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this blog post? This cannot be undone.")) return;
        setDeletingId(id);
        const result = await deletePost(id);
        if (result.error) toast.error(result.error);
        else toast.success("Blog post deleted.");
        setDeletingId(null);
    };

    if (posts.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                <p className="text-sm text-slate-500">
                    No blog posts yet.{" "}
                    <Link href="/admin/blogs/new" className="font-semibold text-purple-600 hover:underline">
                        Create the first one
                    </Link>
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <ul className="divide-y divide-slate-100">
                {posts.map((blog) => (
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
                                onClick={() => handleDelete(blog.id)}
                                disabled={deletingId !== null}
                                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 transition-colors"
                            >
                                {deletingId === blog.id ? "Deleting…" : "Delete"}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
