import BlogsSection from "@/components/BlogsSection";
import { getBlogs } from "@/lib/data/blogs";

export const revalidate = 86400;

export default async function BlogListingPage() {
    const posts = await getBlogs();

    return (
        <div className="pt-24 pb-12">
            <BlogsSection posts={posts} />
        </div>
    );
}