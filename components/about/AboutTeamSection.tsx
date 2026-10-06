import React from "react";
import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";

interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
}

const TEAM_MEMBERS: TeamMember[] = [
    {
        id: "5",
        name: "Kallol Das",
        role: "Co-Founder",
        image: "/teams/creative.webp",
    },
    {
        id: "6",
        name: "Srijan Chakraborty",
        role: "Co-Founder",
        image: "/teams/relation.webp",
    },
    {
        id: "1",
        name: "Bappa Saha",
        role: "Photographer",
        image: "/teams/photographer.webp",
    },
    {
        id: "2",
        name: "Subhayu Pal",
        role: "Cinematorgrapher",
        image: "/teams/cinematographer.webp",
    },
    {
        id: "3",
        name: "Sneha Samanta",
        role: "Photo Editor",
        image: "/teams/photo-editor.webp",
    },
    {
        id: "4",
        name: "Keya Bairagi",
        role: "Co-ordinator",
        image: "/teams/co-ordinator.webp",
    },
    {
        id: "7",
        name: "Amit Patra",
        role: "Senior Video Editor",
        image: "/teams/video-editor.webp",
    },
    {
        id: "8",
        name: "Prithwi Paul",
        role: "Video Editor",
        image: "/teams/video-editor-1.webp",
    },
];

export default function AboutTeamSection() {
    return (
        <section className="py-16 sm:py-24 bg-slate-50/80 border-y border-slate-200/60 text-slate-800">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">

                {/* Section Header */}
                <SectionHeader
                    subtitle="MEMBERS"
                    italicTagline="The Creative Minds Behind The Lens"
                    title="MEET OUR TEAM"
                    description="Passionate photographers, cinematographers, and storytellers dedicated to capturing your most cherished wedding moments."
                />

                {/* Team Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {TEAM_MEMBERS.map((member) => (
                        <div
                            key={member.id}
                            className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col group"
                        >
                            {/* Member Portrait Image */}
                            <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-100">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex flex-col text-center px-1 pb-1 mt-auto">
                                <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-purple-600 transition-colors">
                                    {member.name}
                                </h3>
                                <span className="text-[11px] sm:text-xs font-semibold text-purple-600 uppercase tracking-wider mt-1 leading-snug">
                                    {member.role}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
