import CategoryManager from "@/components/admin/CategoryManager";
import { listCategoriesForAdmin } from "@/lib/data/admin";
import type { Org } from "@/lib/types";

export default async function CategoriesPage({ params }: { params: Promise<{ org: string }> }) {
    const { org } = await params;
    const categories = await listCategoriesForAdmin(org as Org);

    return <CategoryManager org={org as Org} initialCategories={categories} />;
}
