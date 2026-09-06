import ReviewTable from "@/components/admin/ReviewTable";
import { listReviewsForAdmin } from "@/lib/data/admin";

export default async function ReviewsAdminPage() {
    const reviews = await listReviewsForAdmin();

    return <ReviewTable initialReviews={reviews} />;
}
