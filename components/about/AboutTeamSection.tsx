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
        id: "1",
        name: "Arghya Das",
        role: "Founder & Lead Photographer",
        image: "https://images.prismic.io/chobirkotha2/ZwltoIF3NbkBXWj5_Chobirkothagroupphoto-33.jpg?auto=format%2Ccompress&rect=2016%2C0%2C4032%2C4032&w=800",
    },
    {
        id: "2",
        name: "Subho Sambui",
        role: "Lead Cinematographer & Editor",
        image: "https://images.prismic.io/chobirkotha2/ZwlyWYF3NbkBXWpF_Chobirkothagroupphoto-32.jpg?auto=format%2Ccompress&rect=0%2C0%2C4032%2C4032&w=800",
    },
    {
        id: "3",
        name: "Samajit Pal",
        role: "Delivery & Client Manager",
        image: "https://images.prismic.io/chobirkotha2/ZwlyM4F3NbkBXWo7_Chobirkothagroupphoto-26.jpg?auto=format%2Ccompress&rect=157%2C0%2C4032%2C4032&w=800",
    },
    {
        id: "4",
        name: "Sritam Kumar",
        role: "Senior Photographer",
        image: "https://images.prismic.io/chobirkotha2/ZwlyU4F3NbkBXWpE_Chobirkothagroupphoto-31.jpg?auto=format%2Ccompress&rect=901%2C0%2C3997%2C3997&w=800",
    },
    {
        id: "5",
        name: "Somnath Chatterjee",
        role: "Cinematographer, Photographer & Editor",
        image: "https://images.prismic.io/chobirkotha2/ZwlyOoF3NbkBXWo8_Chobirkothagroupphoto-27.jpg?auto=format%2Ccompress&rect=721%2C0%2C4032%2C4032&w=800",
    },
    {
        id: "6",
        name: "Manash Ghosh",
        role: "Senior Cinematographer",
        image: "https://images.prismic.io/chobirkotha2/ZwlyRIF3NbkBXWpB_Chobirkothagroupphoto-29.jpg?auto=format%2Ccompress&rect=375%2C0%2C4032%2C4032&w=800",
    },
    {
        id: "7",
        name: "Utsab Sinha Roy",
        role: "Photographer & Editor",
        image: "https://images.prismic.io/chobirkotha2/ZwlyEIF3NbkBXWo1_Chobirkothagroupphoto-21.jpg?auto=format%2Ccompress&rect=1008%2C0%2C4032%2C4032&w=800",
    },
    {
        id: "8",
        name: "Debartha Karmakar",
        role: "Event Photographer",
        image: "https://images.prismic.io/chobirkotha2/ZwlyGoF3NbkBXWo2_Chobirkothagroupphoto-22.jpg?auto=format%2Ccompress&rect=318%2C0%2C3822%2C3822&w=800",
    },
    {
        id: "9",
        name: "Arun Das",
        role: "Drone & Video Cinematographer",
        image: "https://images.prismic.io/chobirkotha2/ZwlyKoF3NbkBXWo5_Chobirkothagroupphoto-25.jpg?auto=format%2Ccompress&rect=579%2C0%2C4032%2C4032&w=800",
    },
    {
        id: "10",
        name: "Dipayan Samaddar",
        role: "Creative Photographer",
        image: "https://images.prismic.io/chobirkotha2/ZyPfvK8jQArT0GN6_ARG_9753.JPG?auto=format%2Ccompress&rect=0%2C663%2C4032%2C4032&w=800",
    },
    {
        id: "11",
        name: "Sanchaita Bera",
        role: "Candid Photographer & Colorist",
        image: "https://images.prismic.io/chobirkotha2/ZwlyS4F3NbkBXWpD_Chobirkothagroupphoto-30.jpg?auto=format%2Ccompress&rect=977%2C0%2C3906%2C3906&w=800",
    },
    {
        id: "12",
        name: "Shaibal Mondal",
        role: "Cinematographer",
        image: "https://images.prismic.io/chobirkotha2/ZwlyJIF3NbkBXWo3_Chobirkothagroupphoto-24.jpg?auto=format%2Ccompress&rect=1008%2C0%2C4032%2C4032&w=800",
    },
    {
        id: "13",
        name: "Pradipta Chatterjee",
        role: "Event Photographer",
        image: "https://images.prismic.io/chobirkotha2/ZwlyA4F3NbkBXWox_Chobirkothagroupphoto-20.jpg?auto=format%2Ccompress&rect=583%2C0%2C4032%2C4032&w=800",
    },
    {
        id: "14",
        name: "Swarup Paramanik",
        role: "Content Writer",
        image: "https://images.prismic.io/chobirkotha2/Zwlx64F3NbkBXWou_Chobirkothagroupphoto-17.jpg?auto=format%2Ccompress&rect=206%2C0%2C4032%2C4032&w=800",
    },
    {
        id: "15",
        name: "Ardhendu Bank",
        role: "Shoot & Event Organizer",
        image: "https://images.prismic.io/chobirkotha2/Zwlx-YF3NbkBXWow_Chobirkothagroupphoto-19.jpg?auto=format%2Ccompress&rect=1325%2C0%2C4032%2C4032&w=800",
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
