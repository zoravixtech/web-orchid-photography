import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import type { BlogPost } from "@/lib/types";
import { formatBlogDate } from "@/lib/types";

export default function BlogsSection({ posts }: { posts: BlogPost[] }) {
    return (
        <section id="blog" className="bg-white py-24 px-6 border-t border-slate-100">
            <div className="max-w-6xl mx-auto">
                {/* Standardized Section Header */}
                <SectionHeader italicTagline="Blogs" title="Our Latest Blog" />

                {/* 3 Columns × 2 Rows Grid matching reference image */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group flex flex-col cursor-pointer"
                        >
                            {/* Featured Image Container */}
                            <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-100 rounded-none mb-4">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover object-center rounded-none transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>

                            {/* Published Date */}
                            <span className="text-zinc-400 text-xs font-medium tracking-wide mb-2 block">
                                {formatBlogDate(post.date)}
                            </span>

                            {/* Blog Title */}
                            <h3 className="font-serif text-base sm:text-lg text-slate-800 font-normal leading-snug group-hover:text-purple-600 transition-colors mb-3">
                                {post.title}
                            </h3>

                            {/* Read More Link */}
                            <span className="font-serif text-xs font-semibold uppercase tracking-wider text-purple-600 group-hover:text-purple-700 underline underline-offset-4 mt-auto">
                                Read More
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}