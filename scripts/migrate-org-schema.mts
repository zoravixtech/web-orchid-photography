import { getPayload } from "payload";
import config from "../payload.config.mts";

/**
 * One-time backfill for the org/category rework of gallery-media (previously
 * scoped by a "gallery"|"kids" `section` field) and the SiteSettings split
 * (previously a single global with logoUrl/heroVideoUrl/kidsHeroVideoUrl).
 *
 * Best-effort: since this project relies on Payload's dev-mode schema push
 * rather than versioned migrations, the old `section`/`logoUrl`/
 * `kidsHeroVideoUrl` columns may already be gone by the time this runs. Run
 * this BEFORE starting the app on the new schema if you need to preserve
 * existing data; on a fresh/empty database it's a no-op.
 *
 * Run with: pnpm payload run scripts/migrate-org-schema.mts
 */

const ORGS = ["orchid", "kidography"] as const;

async function ensureDefaultCategory(payload: Awaited<ReturnType<typeof getPayload>>, org: (typeof ORGS)[number]) {
    const { docs } = await payload.find({
        collection: "categories",
        where: { and: [{ org: { equals: org } }, { name: { equals: "Uncategorized" } }] },
        limit: 1,
    });
    if (docs.length > 0) return docs[0].id;
    const created = await payload.create({ collection: "categories", data: { org, name: "Uncategorized" } });
    console.log(`Created default "Uncategorized" category for ${org}.`);
    return created.id;
}

async function main() {
    const payload = await getPayload({ config });

    const orchidCategoryId = await ensureDefaultCategory(payload, "orchid");
    const kidographyCategoryId = await ensureDefaultCategory(payload, "kidography");

    // Backfill any gallery-media rows missing org/category — e.g. rows that
    // still carry the legacy `section` value in a raw column Payload no
    // longer knows about. We can only recover the org side (section ===
    // "kids" -> kidography, else orchid); everything lands in "Uncategorized".
    const { docs: allMedia } = await payload.find({ collection: "gallery-media", limit: 0, depth: 0 });
    let backfilled = 0;
    for (const doc of allMedia as unknown as Record<string, unknown>[]) {
        if (doc.org && doc.category) continue;
        const legacySection = doc.section as string | undefined;
        const org: (typeof ORGS)[number] = legacySection === "kids" ? "kidography" : "orchid";
        await payload.update({
            collection: "gallery-media",
            id: doc.id as string,
            data: {
                org,
                category: org === "orchid" ? orchidCategoryId : kidographyCategoryId,
            },
        });
        backfilled += 1;
    }
    console.log(`Backfilled ${backfilled} gallery-media row(s) missing org/category.`);

    // Copy the old single SiteSettings global (if it still exists under its
    // old slug) onto both new per-org globals as a starting point.
    try {
        const legacy = (await payload.findGlobal({ slug: "site-settings" as never })) as Record<string, unknown>;
        if (legacy) {
            for (const org of ORGS) {
                await payload.updateGlobal({
                    slug: org === "orchid" ? "site-settings-orchid" : "site-settings-kidography",
                    data: {
                        heroVideoUrl: (org === "kidography" ? legacy.kidsHeroVideoUrl : legacy.heroVideoUrl) as string | null,
                        stats: legacy.stats as never,
                        socialLinks: legacy.socialLinks as never,
                    },
                });
            }
            console.log("Copied legacy site-settings global onto both per-org globals.");
        }
    } catch {
        console.log("No legacy site-settings global found — skipping settings copy.");
    }
}

await main();
process.exit(0);
