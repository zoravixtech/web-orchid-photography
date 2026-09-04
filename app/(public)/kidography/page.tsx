import HeroSlider from "@/components/HeroSlider";
import AlbumsGridSection from "@/components/AlbumsGridSection";
import FeaturedVideoSection from "@/components/FeaturedVideoSection";
import GalleryGridSection from "@/components/GalleryGridSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import StatsCounterSection from "@/components/StatsCounterSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogsSection from "@/components/BlogsSection";
import { getSiteSettings, getPinnedMedia, getHeroCarouselMedia } from "@/lib/data/settings";
import { getAlbums } from "@/lib/data/albums";
import { getBlogs } from "@/lib/data/blogs";

// This is the kidography home page — served at "/" on the kidography
// subdomain via a proxy rewrite (see proxy.ts), and also directly reachable
// at this path. Mirrors app/(public)/page.tsx section-for-section, swapping
// in the kidography-org data for the org-scoped sections (hero carousel,
// albums, video, gallery); the rest of the site is shared.
export const revalidate = 86400;

export default async function KidographyPage() {
    const [settings, albums, pinnedImages, heroImages, blogPosts] = await Promise.all([
        getSiteSettings("kidography"),
        getAlbums("kidography"),
        getPinnedMedia("kidography"),
        getHeroCarouselMedia("kidography"),
        getBlogs(),
    ]);

    return (
        <>
            {/* Home (Hero) Section with automatic background image slider, curated in the admin panel */}
            <HeroSlider images={heroImages} />

            {/* Albums Grid Section — click through to an album's own gallery page */}
            <AlbumsGridSection
                albums={albums}
                albumHrefBase="/kidography/albums"
                title="The Orchid Kidography"
                description="Capturing Playful, Precious Childhood Moments, Serving Families All Over India"
            />

            {/* Large Autoplay Video Showcase Section */}
            <FeaturedVideoSection videoUrl={settings.heroVideoUrl ?? undefined} />

            {/* Pinned images from every category, with a link to the full tabbed gallery */}
            <GalleryGridSection
                images={pinnedImages}
                subtitle="Specialized Kidography"
                title="Capturing Pure Smiles & Timeless Memories"
                showMoreHref="/kidography/gallery"
            />

            {/* Why We Are Rated Top Photographer Section */}
            <WhyChooseUsSection />

            {/* Animated Stats Counter Section */}
            <StatsCounterSection stats={settings.stats} />

            {/* Client Testimonials Section */}
            <TestimonialsSection />

            {/* Blogs Section */}
            <BlogsSection posts={blogPosts} />
        </>
    );
}
