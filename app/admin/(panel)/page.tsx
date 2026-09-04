import { redirect } from "next/navigation";

// Org-scoped Settings now lives at /admin/[org]; land here on the last
// active org isn't knowable server-side (no cookie of record), so default
// to Orchid.
export default function AdminRootPage() {
    redirect("/admin/orchid");
}
