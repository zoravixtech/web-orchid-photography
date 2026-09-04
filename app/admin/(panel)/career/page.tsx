import CareerTable from "@/components/admin/CareerTable";
import { listCareersForAdmin } from "@/lib/data/admin";

export default async function CareerAdminPage() {
    const careers = await listCareersForAdmin();

    return <CareerTable initialCareers={careers} />;
}
