import SettingsForm from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/data/settings";

export default async function AdminHomePage() {
    const settings = await getSiteSettings();

    return (
        <div className="w-full">
            <header className="mb-8">
                <h1 className="text-2xl font-serif font-bold text-slate-900">Settings</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Customize the branding shown across the public website.
                </p>
            </header>

            <SettingsForm initialSettings={settings} />
        </div>
    );
}