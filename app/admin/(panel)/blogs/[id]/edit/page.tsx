import Link from "next/link";
import { notFound } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import { updateBlog } from "@/app/admin/actions/blogs";
import { getBlogByIdForAdmin } from "@/lib/data/admin";

export default async function EditBlogPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const blog = await getBlogByIdForAdmin(id);
    if (!blog) notFound();

    return (
        <div>
            <header className="mb-8">
                <div className="text-xs text-slate-400 mb-1">
                    <Link href="/admin/blogs" className="hover:text-slate-600">
                        Blogs
                    </Link>{" "}
                    / <span className="text-slate-500">Edit Blog</span>
                </div>
                <h1 className="text-2xl font-serif font-bold text-slate-900">Edit Blog</h1>
                <p className="text-sm text-slate-500 mt-1">Update the blog post and republish.</p>
            </header>

            <BlogForm
                initialData={blog}
                submitAction={updateBlog.bind(null, blog.id)}
                submitLabel="Save Changes"
                cancelHref="/admin/blogs"
            />
        </div>
    );
}