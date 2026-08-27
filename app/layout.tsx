import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
    display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://web-orchid-photography.vercel.app";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "Orchid Photography | Best Wedding Photographers in Kolkata & India",
        template: "%s | Orchid Photography Kolkata",
    },
    description:
        "Award-winning professional wedding photographers in Kolkata, specializing in candid wedding photography, cinematic wedding films, destination weddings, and pre-wedding shoots across India.",
    keywords: [
        "Best Wedding Photographer in Kolkata",
        "Top Wedding Photographers Kolkata",
        "Candid Wedding Photography Kolkata",
        "Pre-wedding Shoot Kolkata",
        "Destination Wedding Photographer India",
        "Cinematic Wedding Video Kolkata",
        "Orchid Photography Kolkata",
        "Bengali Wedding Photography",
        "Best Photographers in Kolkata",
        "Wedding Cost Guide Kolkata",
        "Luxury Wedding Photography",
        "Kidography Kolkata",
    ],
    authors: [{ name: "Orchid Photography", url: siteUrl }],
    creator: "Orchid Photography",
    publisher: "Orchid Photography",
    category: "Photography",
    icons: {
        icon: "/favicon.webp",
        shortcut: "/favicon.webp",
        apple: "/favicon.webp",
    },
    alternates: {
        canonical: siteUrl,
    },
    openGraph: {
        type: "website",
        locale: "en_IN",
        url: siteUrl,
        siteName: "Orchid Photography",
        title: "Orchid Photography | Best Wedding Photographers in Kolkata & India",
        description:
            "Award-winning professional wedding photographers in Kolkata & all over India. Specializing in candid photography, pre-wedding shoots, and cinematic wedding films.",
        images: [
            {
                url: "/favicon.webp",
                width: 1200,
                height: 630,
                alt: "Orchid Photography - Best Wedding Photographers in Kolkata",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Orchid Photography | Best Wedding Photographers in Kolkata",
        description:
            "Award-winning professional wedding photographers in Kolkata & all over India. Specializing in candid photography, pre-wedding shoots, and cinematic wedding films.",
        images: ["/favicon.webp"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Photographer",
    "name": "Orchid Photography",
    "image": `${siteUrl}/favicon.webp`,
    "@id": siteUrl,
    "url": siteUrl,
    "telephone": "+919876543210",
    "priceRange": "₹₹₹",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kolkata",
        "addressRegion": "West Bengal",
        "addressCountry": "IN",
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 22.5726,
        "longitude": 88.3639,
    },
    "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ],
        "opens": "09:00",
        "closes": "21:00",
    },
    "sameAs": [
        "https://facebook.com",
        "https://instagram.com",
    ],
    "areaServed": ["Kolkata", "West Bengal", "India"],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            data-scroll-behavior="smooth"
            className={`${montserrat.variable} h-full antialiased scroll-smooth`}
            suppressHydrationWarning
        >
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body
                className="min-h-full flex flex-col bg-white text-zinc-900 selection:bg-purple-600 selection:text-white"
                suppressHydrationWarning
            >
                {children}
            </body>
        </html>
    );
}
