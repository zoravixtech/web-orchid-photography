import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Orchid Photography | Best Wedding Photographers in Kolkata",
    description: "Award Winning Best Wedding Photographer in Kolkata, operating all over India.",
    icons: {
        icon: "/favicon.webp",
        shortcut: "/favicon.webp",
        apple: "/favicon.webp",
    },
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
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
        >
            <body className="min-h-full flex flex-col bg-white text-zinc-900 selection:bg-purple-600 selection:text-white">
                {children}
            </body>
        </html>
    );
}
