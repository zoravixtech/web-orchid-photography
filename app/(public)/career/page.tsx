import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import { getCareers } from "@/lib/data/careers";

export const metadata: Metadata = {
    title: "Career | Join The Orchid Photography Team",
    description: "Open roles at The Orchid Photography — join our team of wedding and family photographers across India.",
};

export const revalidate: number = 3600;

export default async function CareerPage() {
    const careers = await getCareers();

    return (
        <div className="min-h-screen bg-white">
            <PageBanner
                eyebrow="The Orchid Photography"
                title={
                    <>
                        Join Our <span className="italic font-normal text-purple-400">Team</span>
                    </>
                }
                description="We're always looking for passionate storytellers to join our growing team."
                imageAlt="The Orchid Photography Career Header"
            />

            <section className="py-16 sm:py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12">
                    {careers.length === 0 ? (
                        <p className="text-center text-slate-500">There are no open roles right now — check back soon.</p>
                    ) : (
                        <div className="space-y-6">
                            {careers.map((career) => (
                                <div
                                    key={career.id}
                                    className="rounded-2xl border border-purple-100/80 bg-white shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
                                >
                                    <div>
                                        <h2 className="font-serif text-xl sm:text-2xl font-normal text-slate-900 mb-2">
                                            {career.title}
                                        </h2>
                                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                            {career.description}
                                        </p>
                                    </div>
                                    <a
                                        href={career.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-purple-500/20"
                                    >
                                        Apply
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
