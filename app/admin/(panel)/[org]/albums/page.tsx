import AlbumTable from "@/components/admin/AlbumTable";
import { listAlbumsForAdmin } from "@/lib/data/admin";
import type { Org } from "@/lib/types";

export default async function AlbumsPage({ params }: { params: Promise<{ org: string }> }) {
    const { org } = await params;
    const albums = await listAlbumsForAdmin(org as Org);

    return <AlbumTable org={org as Org} initialAlbums={albums} />;
}
