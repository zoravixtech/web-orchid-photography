import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import ServicesSection, { weddingServicesData } from "@/components/ServicesSection";
import { getGalleryMedia } from "@/lib/data/settings";

export const metadata: Metadata = {
    title: "Services | Wedding Photography Specializations",
    description:
        "Explore The Orchid Photography's wedding photography specializations — candid, cinematic, destination, and cultural wedding coverage across India.",
};

export const revalidate = 86400;

export default async function ServicesPage() {
    const images = await getGalleryMedia("orchid");

    return (
        <div className="min-h-screen bg-white">
            <PageBanner
                eyebrow="The Orchid Photography"
                title={
                    <>
                        Our <span className="italic font-normal text-purple-400">Services</span>
                    </>
                }
                description="Award winning wedding photography specializations, tailored to every tradition and celebration across India."
                imageAlt="The Orchid Photography Services Header"
            />

            <ServicesSection images={images} services={weddingServicesData} />
        </div>
    );
}
