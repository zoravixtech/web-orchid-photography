import Link from "next/link";
import BlogForm from "@/components/admin/BlogForm";
import { createBlog } from "@/app/admin/actions/blogs";

export default function NewBlogPage() {
    return (
        <div>
            <header className="mb-8">
                <div className="text-xs text-slate-400 mb-1">
                    <Link href="/admin/blogs" className="hover:text-slate-600">
                        Blogs
                    </Link>{" "}
                    / <span className="text-slate-500">New Blog</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Create a New Blog</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Write the post content, add a cover image, then publish.
                </p>
            </header>

            <BlogForm
                submitAction={createBlog}
                submitLabel="Publish Blog"
                cancelHref="/admin/blogs"
            />
        </div>
    );
}