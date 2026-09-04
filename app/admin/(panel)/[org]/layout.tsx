import { notFound } from "next/navigation";
import type { Org } from "@/lib/types";

const VALID_ORGS: Org[] = ["orchid", "kidography"];

export default async function OrgLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ org: string }>;
}) {
    const { org } = await params;
    if (!VALID_ORGS.includes(org as Org)) notFound();

    return <>{children}</>;
}
