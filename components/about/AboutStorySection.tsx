import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutStorySection() {
    return (
        <section className="py-16 sm:py-24 bg-white text-slate-800 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* LEFT COLUMN: Featured Team / Studio Group Photo */}
                    <div className="lg:col-span-6 relative group">
                        <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden shadow-2xl border border-purple-100/80">
                            <Image
                                src="https://images.prismic.io/chobirkotha2/ZwluB4F3NbkBXWlZ_Chobirkothagroupphoto-23.jpg?auto=format%2Ccompress&rect=22%2C0%2C5998%2C4027&w=1200&fit=max"
                                alt="The Orchid Photography Team Group"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            {/* Ambient gradient overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* Decorative background accent blob */}
                        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
                    </div>

                    {/* RIGHT COLUMN: Story & Description Content */}
                    <div className="lg:col-span-6 flex flex-col justify-center">
                        {/* Section Subheading */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-8 h-0.5 bg-purple-600 rounded-full" />
                            <span className="font-serif text-xs font-semibold tracking-[0.3em] uppercase text-purple-600">
                                About The Orchid Photography
                            </span>
                        </div>

                        {/* Section Title */}
                        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 tracking-tight leading-tight mb-6">
                            Capturing Your <span className="italic font-normal text-purple-600">Love Story</span>
                        </h2>

                        {/* Story Body Paragraphs */}
                        <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                            <p>
                                We at <strong className="text-slate-900 font-semibold">The Orchid Photography</strong> believe every love story must be told with lovely words and timeless imagery. Being one of the premier wedding photography teams in Kolkata and across India, we specialize in taking raw emotions, candid moments, and subtle details to create unforgettable memories of the most important day of your life.
                            </p>
                            <p>
                                Our team resonates creativity with professionalism so that you feel at ease while we capture every smile, tear, and happy celebration. We are deeply passionate about visual storytelling through candid photography and cinematic films.
                            </p>
                            <p>
                                Come, let’s be a part of your journey and create a visual narrative that you and your loved ones will treasure for a lifetime.
                            </p>
                        </div>

                        {/* CTA Button */}
                        <div className="mt-8">
                            <Link
                                href="/#contact"
                                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-purple-500/20 group"
                            >
                                <span>Contact Us</span>
                                <svg
                                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
