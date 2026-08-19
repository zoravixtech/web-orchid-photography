import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingSocialLinks from "@/components/FloatingSocialLinks";
import { getSiteSettings } from "@/lib/data/settings";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await getSiteSettings();

    return (
        <>
            <FloatingSocialLinks socialLinks={settings.socialLinks} />
            <Navbar logoUrl={settings.logoUrl} />
            <main className="grow">{children}</main>
            <Footer logoUrl={settings.logoUrl} socialLinks={settings.socialLinks} />
        </>
    );
}