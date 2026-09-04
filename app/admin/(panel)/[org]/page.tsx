import SettingsForm from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/data/settings";
import type { Org } from "@/lib/types";

export default async function OrgSettingsPage({ params }: { params: Promise<{ org: string }> }) {
    const { org } = await params;
    const settings = await getSiteSettings(org as Org);

    return (
        <div className="w-full">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 capitalize">{org} Settings</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Customize the branding shown on {org === "kidography" ? "the Kidography site" : "the main Orchid site"}.
                </p>
            </header>

            <SettingsForm org={org as Org} initialSettings={settings} />
        </div>
    );
}
