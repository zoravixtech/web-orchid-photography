"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
    id: string;
    label: string;
    href: string;
}

const leftNavItems: NavItem[] = [
    { id: "home", label: "Home", href: "/" },
    { id: "kidography", label: "Kidography", href: "/kidography" },
    { id: "gallery", label: "Gallery", href: "/#gallery" },
    { id: "services", label: "Services", href: "/#services" },
];

const rightNavItems: NavItem[] = [
    { id: "about", label: "About Us", href: "/#about" },
    { id: "contact", label: "Contact", href: "/#contact" },
    { id: "carrer", label: "Carrer", href: "/#about" },
    { id: "blog", label: "Blog", href: "/blog" },
];

export default function Navbar({ logoUrl }: { logoUrl?: string | null }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (pathname !== "/") return;

        const sectionIds = ["home", "gallery", "services", "about", "contact", "blog"];
        const sections = sectionIds.map((id) => document.getElementById(id));

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible) setActiveSection(visible.target.id);
            },
            { threshold: 0.3 }
        );

        sections.forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => {
            sections.forEach((section) => {
                if (section) observer.unobserve(section);
            });
        };
    }, [pathname]);

    const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
        if (item.id === "carrer" && pathname === "/") {
            e.preventDefault();
            setActiveSection("about");
            const element = document.getElementById("about");
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
            return;
        }

        if (pathname === "/" && item.href.startsWith("/#")) {
            const targetId = item.href.replace("/#", "");
            const element = document.getElementById(targetId);
            if (element) {
                e.preventDefault();
                setActiveSection(targetId);
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    const renderNavLink = (item: NavItem) => {
        const isActive =
            (item.id === "home" && pathname === "/" && (activeSection === null || activeSection === "home")) ||
            (item.id === "kidography" && pathname === "/kidography") ||
            (item.id === "blog" && pathname.startsWith("/blog")) ||
            (item.id !== "carrer" && pathname === "/" && activeSection === item.id);

        return (
            <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`relative group inline-flex items-center justify-center py-2 text-base font-light transition-colors ${isScrolled
                    ? "text-zinc-700 hover:text-zinc-950"
                    : pathname === "/"
                        ? "text-zinc-100 hover:text-white"
                        : "text-zinc-800 hover:text-zinc-950"
                    }`}
            >
                {item.label.toUpperCase()}
                {/* Purple underline indicator */}
                <div
                    className={`absolute -bottom-3 left-0 right-0 h-1 rounded-full bg-purple-600 transition-all duration-200 ${isActive
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                        }`}
                />
            </Link>
        );
    };

    const isHome = pathname === "/";

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 px-8 sm:px-12 py-6 h-24 flex items-center transition-all duration-300 ease-in-out ${isScrolled
                ? "bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-xs"
                : isHome
                    ? "bg-black/20 shadow-none"
                    : "bg-white border-b border-zinc-200/80 shadow-xs"
                }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-center">
                <nav className="flex items-center gap-6 sm:gap-8 md:gap-10">
                    {/* Left Nav Items */}
                    <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
                        {leftNavItems.map(renderNavLink)}
                    </div>

                    {/* Website Logo Centered */}
                    <Link
                        href="/"
                        className="mx-2 sm:mx-4 md:mx-6 flex items-center gap-2 sm:gap-2.5 shrink-0 group"
                    >
                        <Image
                            src={logoUrl || "/favicon.webp"}
                            alt="Orchid Photography Logo"
                            width={40}
                            height={40}
                            priority
                            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                        <span className={`font-serif text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                            isScrolled || !isHome ? "text-slate-900" : "text-white"
                        }`}>
                            Orchid <span className="text-purple-600 font-normal">Photography</span>
                        </span>
                    </Link>

                    {/* Right Nav Items */}
                    <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
                        {rightNavItems.map(renderNavLink)}
                    </div>
                </nav>
            </div>
        </header>
    );
}

