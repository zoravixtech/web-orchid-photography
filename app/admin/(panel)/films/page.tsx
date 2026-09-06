import FilmTable from "@/components/admin/FilmTable";
import { listFilmsForAdmin } from "@/lib/data/admin";

export default async function FilmsAdminPage() {
    const films = await listFilmsForAdmin();

    return <FilmTable initialFilms={films} />;
}
