import type { Metadata } from "next";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { ReviewCard } from "@/components/ReviewCard";
import { PlatformLogo } from "@/components/PlatformLogo";
import { getReviews } from "@/lib/data/reviews";

export const metadata: Metadata = {
    title: "Reviews & Client Stories | The Orchid Photography",
    description: "Read real reviews and client video testimonials from couples and families who trusted The Orchid Photography.",
};

export const revalidate = 3600;

export default async function ReviewsPage() {
    const reviews = await getReviews();

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1)
        : "5.0";

    return (
        <div className="min-h-screen bg-slate-50/70">
            <PageBanner
                eyebrow="The Orchid Photography"
                title={
                    <>
                        Client <span className="italic font-normal text-purple-400">Reviews</span>
                    </>
                }
                description="Heartwarming words and video testimonials from our wonderful couples and families."
                imageAlt="The Orchid Photography Reviews Header"
            />

            <main className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
                {reviews.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-xl mx-auto px-6">
                        <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Reviews Yet</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Client stories and reviews will appear here once added in the admin panel.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                        >
                            Return Home
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Stats / Trust Badges Bar */}
                        <div className="mb-12 flex flex-wrap items-center justify-center gap-6 sm:gap-12 py-4 px-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs max-w-2xl mx-auto">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-slate-900">{avgRating}</span>
                                <div className="flex text-amber-400 text-sm">★★★★★</div>
                                <span className="text-xs text-slate-500 font-medium">Average Rating ({reviews.length} {reviews.length === 1 ? "Review" : "Reviews"})</span>
                            </div>
                            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                            <div className="flex items-center gap-4">
                                <PlatformLogo platform="google" className="w-5 h-5" />
                                <PlatformLogo platform="facebook" className="w-5 h-5" />
                                <PlatformLogo platform="wedmegood" className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Multi-Column Masonry Grid */}
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
                            {reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
