import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionHeader from "@/components/SectionHeader";
import { getBlogBySlug, getAllBlogSlugs, getBlogs } from "@/lib/data/blogs";
import { formatBlogDate, type BlogBlock } from "@/lib/types";

export const revalidate = 86400;

export async function generateStaticParams() {
    const slugs = await getAllBlogSlugs();
    return slugs.map((slug) => ({ slug }));
}

function BlogBlockRenderer({ blocks }: { blocks: BlogBlock[] }) {
    return (
        <article className="prose prose-slate max-w-none space-y-6 text-slate-600 text-sm sm:text-base leading-relaxed">
            {blocks.map((block, index) =>
                block.type === "heading" ? (
                    <div key={index} className="pt-4">
                        <h2 className="font-serif text-xl sm:text-2xl text-slate-800 font-semibold mb-2 leading-snug">
                            {block.text}
                        </h2>
                    </div>
                ) : (
                    <p key={index} className="text-slate-500">
                        {block.text}
                    </p>
                )
            )}
        </article>
    );
}

export default async function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getBlogBySlug(slug);
    if (!post) notFound();

    const allPosts = await getBlogs();
    const suggestedBlogs = allPosts
        .filter((p) => p.slug !== post.slug)
        .slice(0, 3);

    return (
        <div className="pt-28 pb-16">
            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
                    <Link href="/" className="hover:text-purple-600 transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/blog" className="hover:text-purple-600 transition-colors">
                        Blogs
                    </Link>
                    <span>/</span>
                    <span className="text-zinc-600 line-clamp-1">{post.title}</span>
                </div>

                {/* Article Title */}
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-slate-800 font-normal leading-tight mb-4">
                    {post.title}
                </h1>

                {/* Subtitle / Description */}
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-5">
                    {post.excerpt}
                </p>

                {/* Meta Info Bar (Date & Views) matching reference screenshot */}
                <div className="flex items-center gap-6 text-xs text-slate-400 mb-8 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatBlogDate(post.date)}</span>
                    </div>
                </div>

                {/* Featured Image Frame Box matching reference screenshot */}
                <div className="relative w-full aspect-16/10 bg-zinc-50 border border-purple-200/60 p-4 rounded-2xl mb-10 overflow-hidden shadow-xs">
                    <div className="relative w-full h-full overflow-hidden rounded-xl">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            priority
                            className="object-cover object-center"
                            sizes="(max-width: 1024px) 100vw, 900px"
                        />
                    </div>
                </div>

                {/* Article Body Content matching reference screenshot */}
                <BlogBlockRenderer blocks={post.content} />

                {/* Back to Blogs Button */}
                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 font-serif text-xs font-semibold uppercase tracking-wider text-purple-600 hover:text-purple-700 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to All Blogs
                    </Link>
                </div>
            </main>

            {/* Suggested / Latest Blogs Section */}
            <section className="bg-white py-20 px-6 mt-16 border-t border-purple-100/60">
                <div className="max-w-6xl mx-auto">
                    <SectionHeader
                        italicTagline="Suggested Reads"
                        title="You Might Also Like"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {suggestedBlogs.map((item) => (
                            <Link
                                key={item.id}
                                href={`/blog/${item.slug}`}
                                className="group flex flex-col cursor-pointer bg-white p-4 border border-purple-100/80 rounded-2xl shadow-xs hover:shadow-md hover:border-purple-200 transition-all"
                            >
                                <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-100 rounded-xl mb-4">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </div>

                                <span className="text-zinc-400 text-xs font-medium tracking-wide mb-2 block">
                                    {formatBlogDate(item.date)}
                                </span>

                                <h3 className="font-serif text-base text-slate-800 font-normal leading-snug group-hover:text-purple-600 transition-colors mb-3">
                                    {item.title}
                                </h3>

                                <span className="font-serif text-xs font-semibold uppercase tracking-wider text-purple-600 group-hover:text-purple-700 underline underline-offset-4 mt-auto">
                                    Read Story
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}