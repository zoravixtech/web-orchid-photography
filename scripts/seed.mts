import { getPayload } from "payload";
import config from "../payload.config.mts";

/**
 * Recreates the demo content that used to ship as SQL seed data in
 * supabase/migrations/0001_init.sql, via Payload's Local API. Idempotent:
 * skips any blog whose slug already exists, and only seeds gallery media
 * when the collection is empty.
 *
 * Run with: pnpm seed
 */

const galleryItems: { org: "orchid" | "kidography"; url: string; alt: string }[] = [
    { org: "orchid", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop", alt: "Bride in Red Veil" },
    { org: "orchid", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop", alt: "Mandap Wedding Ceremony" },
    { org: "orchid", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop", alt: "Bride Red Dupatta Detail" },
    { org: "orchid", url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop", alt: "Couple Wedding Portrait" },
    { org: "orchid", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop", alt: "Candid Moment" },
    { org: "orchid", url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1000&auto=format&fit=crop", alt: "Bridal Preparation" },
    { org: "kidography", url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000&auto=format&fit=crop", alt: "Newborn Baby Sleeping" },
    { org: "kidography", url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1000&auto=format&fit=crop", alt: "Smiling Toddler Portrait" },
    { org: "kidography", url: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=1000&auto=format&fit=crop", alt: "Kid Playing in Garden" },
    { org: "kidography", url: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=1000&auto=format&fit=crop", alt: "Cute Baby Portrait" },
    { org: "kidography", url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1000&auto=format&fit=crop", alt: "Kids Celebration" },
    { org: "kidography", url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1000&auto=format&fit=crop", alt: "Little Girl Laughing" },
    { org: "kidography", url: "https://images.unsplash.com/photo-1510154221590-ff63e90a136f?q=80&w=1000&auto=format&fit=crop", alt: "Baby First Birthday" },
    { org: "kidography", url: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=1000&auto=format&fit=crop", alt: "Childhood Magic" },
    { org: "kidography", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop", alt: "Baby Rice Ceremony" },
];

const blogs = [
    {
        slug: "a-royal-bengali-wedding-story",
        title: "A Royal Bengali Wedding Story: Captured by Orchid Photography",
        date: "2026-05-25",
        image: "/hero-bg-2.avif",
        excerpt: "Experience the vibrant colors, sacred mantras, and emotional moments of a grand Bengali wedding.",
        content: [
            { type: "paragraph", text: "Bengali weddings are indeed a unique and special occasion, full of cultural and traditional elements. There are many beautiful ceremonies and traditions within a Bengali wedding. The entrance of the bride into the ceremony, as well as other important rites performed during a wedding, are indeed an elegant event that requires great creativity. For this reason, Bengali couples prefer the services of the Best Wedding Photographers in Kolkata." },
            { type: "paragraph", text: "With Orchid Photography, wedding celebrations become an unforgettable experience through the incorporation of cinematic elements. The presence of genuine emotions together with rich cultural imagery guarantees that all smiles, traditions, and emotional expressions will be recorded. With their unique approach, they make it possible for people to remember and appreciate the beauty and depth of the traditional Bengali wedding." },
            { type: "heading", text: "Royal Bengali Story by Orchid Photography" },
            { type: "paragraph", text: "Royal Bengali weddings offer a spectacular fusion of elegance and culture, showcasing a colorful ritual and traditional images of brides. Each element speaks a distinct story of love through culture." },
            { type: "heading", text: "A grand traditional beginning" },
            { type: "paragraph", text: "All Bengali weddings begin with pre-wedding rituals which reflect the traditions of their family, accompanied by music and celebrations. These essential events set the emotional tone for the wedding narrative, thus making sure that all memories recorded are filled with meaning." },
            { type: "heading", text: "Capturing emotional family moments" },
            { type: "paragraph", text: "The Bengali marriage is rich in deep emotions amongst parents, siblings, and well-wishers. By smiling, crying, and engaging with one another, such weddings become the source of memories that yield an exceptional wedding photo album." },
            { type: "heading", text: "The Beauty of Bengali Rituals" },
            { type: "paragraph", text: "From Shubho Drishti and Mala Badal to Sampradan and Sindoor Daan, every ritual holds sacred value. Our photographers blend into the background to capture these raw, unscripted moments without disrupting the sanctity of the ceremony." },
        ],
    },
    {
        slug: "photogenic-wedding-venues-in-kolkata",
        title: "The Most Photogenic Wedding Venues in Kolkata for a Dreamy Bridal Shoot",
        date: "2026-05-18",
        image: "/hero-bg-1.webp",
        excerpt: "Discover heritage palaces, luxury resorts, and serene riverside spots perfect for pre-wedding photography.",
        content: [
            { type: "paragraph", text: "Kolkata is a city that wears its heritage with pride, and there is no better backdrop for a dreamy bridal shoot than its palatial mansions, lush gardens, and serene riverside stretches." },
            { type: "heading", text: "Heritage palaces of North Kolkata" },
            { type: "paragraph", text: "The grand facades and sweeping staircases of North Kolkata's rajbaris give photographs an old-world regal charm that is impossible to replicate in a studio." },
            { type: "heading", text: "Riverside and garden venues" },
            { type: "paragraph", text: "From the peaceful Hooghly waterfront to manicured golf greens, these venues frame the bride beautifully with natural light and lush greenery." },
        ],
    },
    {
        slug: "essential-questions-hiring-wedding-photographer",
        title: "10 Essential Questions to Ask Before Hiring a Wedding Photographer",
        date: "2026-05-11",
        image: "/hero-bg-3.avif",
        excerpt: "Make sure you choose the right team for your big day with this helpful checklist.",
        content: [
            { type: "paragraph", text: "Your wedding photographs are the only tangible keepsakes that survive long after the celebrations fade. Choosing the right photographer deserves the same care as choosing the venue." },
            { type: "heading", text: "Start with experience" },
            { type: "paragraph", text: "Ask how many Indian weddings the team has covered, whether they shoot candid or posed, and how many photographers will be present on the day." },
            { type: "heading", text: "Know what you are paying for" },
            { type: "paragraph", text: "Clarify album inclusions, delivery timelines, raw file policies, and what happens if the photographer falls ill on your wedding day." },
        ],
    },
    {
        slug: "wedding-photographer-in-kolkata-cost-guide",
        title: "How Much Does a Top Wedding Photographer in Kolkata Cost? A Complete Budget Guide",
        date: "2026-05-04",
        image: "/hero-bg-4.avif",
        excerpt: "Understand candid photography pricing, album packages, and cinematography costs in 2026.",
        content: [
            { type: "paragraph", text: "Wedding photography pricing in Kolkata varies widely based on team size, album quality, and the number of events covered." },
            { type: "heading", text: "What drives the price" },
            { type: "paragraph", text: "Candid photographers, cinematic films, premium leather albums, and drone coverage all add to the final package cost." },
            { type: "heading", text: "Getting the best value" },
            { type: "paragraph", text: "Book early, negotiate a fixed package, and always review full albums from past weddings before you sign." },
        ],
    },
    {
        slug: "printed-wedding-albums-importance",
        title: "Why Printed Wedding Albums Are Still Important in the Digital Era",
        date: "2026-04-27",
        image: "/hero-bg-2.avif",
        excerpt: "Digital files come and go, but a handcrafted coffee table wedding album lasts for generations.",
        content: [
            { type: "paragraph", text: "In an age of cloud storage and endless scrolling, a beautifully printed wedding album remains the most personal way to relive your big day." },
            { type: "heading", text: "A keepsake, not just a file" },
            { type: "paragraph", text: "Albums sit on coffee tables, get passed around at family gatherings, and become heirlooms that outlive hard drives." },
            { type: "heading", text: "Craft matters" },
            { type: "paragraph", text: "Premium archival paper, hand binding, and careful sequencing make each album a work of art worth treasuring for generations." },
        ],
    },
    {
        slug: "why-fotopick-first-choice-wedding-photography",
        title: "Why Orchid Photography is the 1st Choice for Wedding Photography in Kolkata – Our Story",
        date: "2026-04-20",
        image: "/hero-bg-1.webp",
        excerpt: "Learn how our passion for storytelling and cinematic perfection built one of Kolkata's top studios.",
        content: [
            { type: "paragraph", text: "Orchid Photography was born from a simple belief: every wedding is a story that deserves to be told with artistry and heart." },
            { type: "heading", text: "The Orchid difference" },
            { type: "paragraph", text: "From the first consultation to the final album delivery, our team blends cinematic technique with genuine human emotion." },
            { type: "heading", text: "Trusted across Kolkata" },
            { type: "paragraph", text: "Hundreds of families have entrusted us with their most precious moments, and our 5-star reviews speak for themselves." },
        ],
    },
];

async function ensureDefaultCategory(payload: Awaited<ReturnType<typeof getPayload>>, org: "orchid" | "kidography") {
    const { docs } = await payload.find({
        collection: "categories",
        where: { and: [{ org: { equals: org } }, { name: { equals: "Uncategorized" } }] },
        limit: 1,
    });
    if (docs.length > 0) return docs[0].id;
    const created = await payload.create({ collection: "categories", data: { org, name: "Uncategorized" } });
    return created.id;
}

async function main() {
    const payload = await getPayload({ config });

    const { totalDocs: galleryCount } = await payload.count({ collection: "gallery-media" });
    if (galleryCount === 0) {
        const orchidCategoryId = await ensureDefaultCategory(payload, "orchid");
        const kidographyCategoryId = await ensureDefaultCategory(payload, "kidography");
        for (const item of galleryItems) {
            await payload.create({
                collection: "gallery-media",
                data: {
                    org: item.org,
                    category: item.org === "orchid" ? orchidCategoryId : kidographyCategoryId,
                    url: item.url,
                    alt: item.alt,
                    storagePath: null,
                },
            });
        }
        console.log(`Seeded ${galleryItems.length} gallery media items.`);
    } else {
        console.log(`Skipping gallery seed: ${galleryCount} item(s) already exist.`);
    }

    let created = 0;
    for (const blog of blogs) {
        const { totalDocs } = await payload.count({
            collection: "blogs",
            where: { slug: { equals: blog.slug } },
        });
        if (totalDocs > 0) continue;
        await payload.create({ collection: "blogs", data: { ...blog, views: 0 } });
        created += 1;
    }
    console.log(`Seeded ${created} blog post(s) (${blogs.length - created} already existed).`);
}

// Top-level await so `payload run` (which resolves as soon as this module's
// synchronous body finishes) actually waits for the seed to complete instead
// of exiting the process mid-flight.
await main();
process.exit(0);
