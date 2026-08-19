import { NextResponse } from "next/server";

export interface GoogleReviewItem {
    id: string;
    name: string;
    avatarColor: string;
    initials: string;
    rating: number;
    text: string;
}

const fallbackReviews: GoogleReviewItem[] = [
    {
        id: "review-1",
        name: "Megha Jha",
        avatarColor: "bg-purple-600",
        initials: "M",
        rating: 5,
        text: "Very good services provided by team at both end and picture quality is also too good. Thanku So much Orchid Photography Team, keep doing.",
    },
    {
        id: "review-2",
        name: "Jyoti Kumari",
        avatarColor: "bg-indigo-600",
        initials: "J",
        rating: 5,
        text: "Photography A+ Coordination A+ Every single click is just beyond words !! They have captured every single moment !! My wedding was on 14 March venue maithon..and pics do speak how much hard work they gave !!!",
    },
    {
        id: "review-3",
        name: "gudia kumari",
        avatarColor: "bg-purple-700",
        initials: "g",
        rating: 5,
        text: "Wonderful full team of Orchid Photography 🙏 there team's are very active & supporting..no doubt to booked them.. thank you 🙏 so much Orchid Photography for very lovely video's photo 🙏😊",
    },
    {
        id: "review-4",
        name: "Priyanka Roy",
        avatarColor: "bg-rose-600",
        initials: "P",
        rating: 5,
        text: "The best photography team in Kolkata! They captured all our traditional Bengali rituals so beautifully and patiently. Highly recommended!",
    },
    {
        id: "review-5",
        name: "Ankit Sharma",
        avatarColor: "bg-purple-600",
        initials: "A",
        rating: 5,
        text: "Superb quality and cinematography. Their team is extremely professional and polite. Our wedding film looks straight out of a movie.",
    },
    {
        id: "review-6",
        name: "Saurav Chatterjee",
        avatarColor: "bg-violet-600",
        initials: "S",
        rating: 5,
        text: "Extremely creative team. They turned our pre-wedding shoot into a breathtaking visual memory. Everyone loved our photo album!",
    },
];

// Revalidate once every 30 days (1 month = 2,592,000 seconds)
export const revalidate = 2592000;

export async function GET() {
    const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
    const PLACE_ID = process.env.GOOGLE_PLACE_ID;

    if (!API_KEY || !PLACE_ID) {
        // Return 6 top 5-star fallback reviews
        return NextResponse.json({
            rating: 4.9,
            totalReviews: 120,
            reviews: fallbackReviews.slice(0, 6),
            source: "static_cache",
        });
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=rating,user_ratings_total,reviews&key=${API_KEY}`,
            { next: { revalidate: 2592000 } } // 1 month cache
        );

        const data = await response.json();

        if (data.result?.reviews) {
            // Filter 5-star reviews only and take max 6
            const fiveStarReviews = data.result.reviews
                .filter((r: { rating: number }) => r.rating === 5)
                .slice(0, 6)
                .map((r: { author_name: string; rating: number; text: string }, i: number) => ({
                    id: `google-${i}`,
                    name: r.author_name,
                    avatarColor: "bg-purple-600",
                    initials: r.author_name ? r.author_name.charAt(0).toUpperCase() : "G",
                    rating: r.rating,
                    text: r.text,
                }));

            return NextResponse.json({
                rating: data.result.rating || 4.9,
                totalReviews: data.result.user_ratings_total || 120,
                reviews: fiveStarReviews.length > 0 ? fiveStarReviews : fallbackReviews.slice(0, 6),
                source: "google_places_api_1_month_cache",
            });
        }
    } catch {
        // Silently fall back to cached 6 top 5-star reviews
    }

    return NextResponse.json({
        rating: 4.9,
        totalReviews: 120,
        reviews: fallbackReviews.slice(0, 6),
        source: "fallback_cache",
    });
}
