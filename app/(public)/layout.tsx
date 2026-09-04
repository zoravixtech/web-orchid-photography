import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingSocialLinks from "@/components/FloatingSocialLinks";
import LeadModal from "@/components/LeadModal";
import { getSiteSettings } from "@/lib/data/settings";
import { getServerAudience } from "@/lib/config/domain.server";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const org = await getServerAudience();
    const settings = await getSiteSettings(org);

    return (
        <>
            <LeadModal />
            <FloatingSocialLinks socialLinks={settings.socialLinks} />
            <Navbar org={org} />
            <main className="grow">{children}</main>
            <Footer org={org} socialLinks={settings.socialLinks} />
        </>
    );
}
