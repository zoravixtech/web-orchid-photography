import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import ServicesSection, { kidsServicesData } from "@/components/ServicesSection";
import { getGalleryMedia } from "@/lib/data/settings";

export const metadata: Metadata = {
    title: "Services | Kidography Specializations",
    description:
        "Explore The Orchid Kidography's specializations — newborn, cake smash, birthday, and family photography across India.",
};

export const revalidate = 86400;

export default async function KidographyServicesPage() {
    const images = await getGalleryMedia("kidography");

    return (
        <div className="min-h-screen bg-white">
            <PageBanner
                eyebrow="The Orchid Kidography"
                title={
                    <>
                        Our <span className="italic font-normal text-purple-400">Services</span>
                    </>
                }
                description="Capturing playful, precious childhood moments — specializations tailored for every family."
                imageAlt="The Orchid Kidography Services Header"
            />

            <ServicesSection
                images={images}
                services={kidsServicesData}
                title="The Orchid Kidography"
                description="Capturing Playful, Precious Childhood Moments, Serving Families All Over India"
            />
        </div>
    );
}
