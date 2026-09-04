"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAudienceFromHostname, getKidographyDomain, getWeddingDomain, type Audience } from "@/lib/config/domain";

// Hardcoded per-org logo assets (task: logo is no longer admin-editable).
// Orchid has a light-text variant for the transparent/dark-overlay navbar
// state; Kidography only has the one mark, used everywhere.
const ORCHID_LOGO = "/orchid-logo.png";
const ORCHID_LOGO_DARK_BG = "/orchid-logo-2.png";
const KIDOGRAPHY_LOGO = "/kidography-logo.png";

const noopSubscribe = () => () => { };

function getClientAudience(): Audience {
    return getAudienceFromHostname(window.location.hostname);
}

function getServerAudience(): Audience {
    return "orchid";
}

function getClientSwitchHref(): string {
    const detected = getClientAudience();
    const targetHost = detected === "orchid" ? getKidographyDomain() : getWeddingDomain();
    const port = window.location.port ? `:${window.location.port}` : "";
    return `${window.location.protocol}//${targetHost}${port}/`;
}

function getServerSwitchHref(): string {
    return `https://${getKidographyDomain()}/`;
}

interface NavItem {
    id: string;
    label: string;
    href: string;
}

const leftNavItems: NavItem[] = [
    { id: "home", label: "Home", href: "/" },
    { id: "gallery", label: "Gallery", href: "/gallery" },
    { id: "services", label: "Services", href: "/services" },
];

const rightNavItems: NavItem[] = [
    { id: "about", label: "About Us", href: "/about" },
    { id: "contact", label: "Contact", href: "/#contact" },
    { id: "career", label: "Career", href: "/career" },
    { id: "blog", label: "Blog", href: "/blog" },
];

export default function Navbar({ org }: { org: Audience }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const isHome = pathname === "/";
    // Matches the header's own bg-black/45 state below: transparent-over-hero,
    // only at the very top of the homepage.
    const isDarkBackground = isHome && !isScrolled && !isMobileMenuOpen;

    const logoSrc =
        org === "kidography" ? KIDOGRAPHY_LOGO : isDarkBackground ? ORCHID_LOGO_DARK_BG : ORCHID_LOGO;
    const logoAlt = org === "kidography" ? "The Orchid Kidography Logo" : "The Orchid Photography Logo";

    const audience = useSyncExternalStore(noopSubscribe, getClientAudience, getServerAudience);
    const switchHref = useSyncExternalStore(noopSubscribe, getClientSwitchHref, getServerSwitchHref);

    const switchNavItem: NavItem = {
        id: "switch",
        label: audience === "orchid" ? "Kidography" : "Orchid",
        href: switchHref,
    };

    const allMobileNavItems = [
        leftNavItems[0],
        switchNavItem,
        ...leftNavItems.slice(1),
        ...rightNavItems,
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const [prevPathname, setPrevPathname] = useState(pathname);

    if (prevPathname !== pathname) {
        setPrevPathname(pathname);
        setIsMobileMenuOpen(false);
    }

    useEffect(() => {
        if (pathname !== "/") return;

        const sectionIds = ["home", "about", "contact", "blog"];
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
        setIsMobileMenuOpen(false);

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

    // Determine current breadcrumb label for mobile
    const currentBreadcrumb = pathname.startsWith("/blog")
        ? "Blog"
        : pathname.startsWith("/about")
            ? "About"
            : pathname.startsWith("/career")
                ? "Career"
                : pathname.startsWith("/services")
                    ? "Services"
                    : pathname.startsWith("/albums")
                        ? "Albums"
                        : pathname.startsWith("/gallery")
                            ? "Gallery"
                            : activeSection
                                ? activeSection.charAt(0).toUpperCase() + activeSection.slice(1)
                                : "Home";

    const renderDesktopNavLink = (item: NavItem) => {
        const isActive =
            (item.id === "home" && pathname === "/" && (activeSection === null || activeSection === "home")) ||
            (item.id === "blog" && pathname.startsWith("/blog")) ||
            (item.id === "career" && pathname.startsWith("/career")) ||
            (item.id === "services" && pathname.startsWith("/services")) ||
            (item.id === "gallery" && pathname.startsWith("/gallery")) ||
            (item.id !== "switch" && pathname === "/" && activeSection === item.id);

        return (
            <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`relative group inline-flex items-center justify-center py-2 text-base font-light transition-colors ${isScrolled
                    ? "text-zinc-700 hover:text-zinc-950"
                    : isHome
                        ? "text-zinc-100 hover:text-white"
                        : "text-zinc-800 hover:text-zinc-950"
                    }`}
            >
                {item.label.toUpperCase()}
                <div
                    className={`absolute -bottom-3 left-0 right-0 h-1 rounded-full bg-purple-600 transition-all duration-200 ${isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                        }`}
                />
            </Link>
        );
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 lg:px-12 py-3 lg:py-4 h-24 lg:h-28 flex items-center transition-all duration-300 ease-in-out ${isScrolled || isMobileMenuOpen
                ? "bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-xs"
                : isHome
                    ? "bg-black/45 backdrop-blur-[2px] shadow-none"
                    : "bg-white border-b border-zinc-200/80 shadow-xs"
                }`}
        >
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between lg:justify-center">

                {/* Mobile Breadcrumb Bar (Visible on < lg) */}
                <div className="flex items-center gap-2 lg:hidden">
                    <Link href="/" className="flex items-center shrink-0">
                        <Image
                            src={logoSrc}
                            alt={logoAlt}
                            width={100}
                            height={100}
                            priority
                            className="h-14 w-auto object-contain"
                        />
                    </Link>

                    {/* Breadcrumb Separator & Location */}
                    <span className={`text-xs ${isScrolled || !isHome || isMobileMenuOpen ? "text-zinc-400" : "text-white/60"}`}>
                        /
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 capitalize">
                        {currentBreadcrumb}
                    </span>
                </div>

                {/* Mobile Menu Button (Visible on < lg) */}
                <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled || !isHome || isMobileMenuOpen
                        ? "text-zinc-800 hover:bg-zinc-100"
                        : "text-white hover:bg-white/10"
                        }`}
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMobileMenuOpen}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Desktop Full Navbar (Visible on >= lg) */}
                <nav className="hidden lg:flex items-center gap-6 sm:gap-8 md:gap-10">
                    <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
                        {renderDesktopNavLink(leftNavItems[0])}
                        {renderDesktopNavLink(switchNavItem)}
                        {leftNavItems.slice(1).map(renderDesktopNavLink)}
                    </div>

                    <Link
                        href="/"
                        className="mx-2 sm:mx-4 md:mx-6 flex items-center shrink-0 group"
                    >
                        <Image
                            src={logoSrc}
                            alt={logoAlt}
                            width={100}
                            height={100}
                            priority
                            className="h-20 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                    </Link>

                    <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
                        {rightNavItems.map(renderDesktopNavLink)}
                    </div>
                </nav>
            </div>

            {/* Mobile Dropdown Panel */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-24 left-0 right-0 bg-white border-b border-zinc-200 shadow-xl px-6 py-5 transition-all">
                    <div className="flex flex-col space-y-3">
                        {allMobileNavItems.map((item) => {
                            const isCurrent =
                                (item.id === "home" && pathname === "/" && (activeSection === null || activeSection === "home")) ||
                                (item.id === "blog" && pathname.startsWith("/blog")) ||
                                (item.id === "career" && pathname.startsWith("/career")) ||
                                (item.id === "services" && pathname.startsWith("/services")) ||
                                (item.id === "gallery" && pathname.startsWith("/gallery")) ||
                                (item.id !== "switch" && pathname === "/" && activeSection === item.id);

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item)}
                                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-between ${isCurrent
                                        ? "bg-purple-50 text-purple-700 font-semibold"
                                        : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                                        }`}
                                >
                                    <span>{item.label}</span>
                                    {item.id === "switch" && (
                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                                            Switch
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
}
