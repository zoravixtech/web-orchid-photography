"use client";

import { useEffect, useState } from "react";
import type { SocialLinks } from "@/lib/types";

export default function FloatingSocialLinks({ socialLinks }: { socialLinks: SocialLinks }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show floating icons when page is scrolled past the Hero section (~450px)
            if (window.scrollY > 450) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Initial check
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={`fixed right-3 sm:right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 items-center transition-all duration-500 ease-in-out ${isVisible
                    ? "opacity-100 translate-x-0 pointer-events-auto"
                    : "opacity-0 translate-x-10 pointer-events-none"
                }`}
        >
            {/* WhatsApp */}
            {socialLinks.whatsapp && (
                <a
                    href={socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-10 h-10 rounded-full border border-purple-200 bg-white shadow-md flex items-center justify-center hover:scale-110 hover:border-purple-600 hover:text-purple-600 hover:shadow-lg transition-all text-zinc-800"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.012 2c-5.506 0-9.989 4.478-9.989 9.984 0 1.758.459 3.474 1.33 4.988L2 22l5.163-1.334a9.96 9.96 0 004.849 1.258h.004c5.505 0 9.988-4.478 9.988-9.984 0-2.667-1.039-5.176-2.924-7.062A9.925 9.925 0 0012.012 2zm5.82 14.161c-.247.692-1.242 1.341-1.722 1.413-.447.067-.984.14-3.08-.686-2.678-1.055-4.407-3.792-4.542-3.972-.132-.18-1.092-1.455-1.092-2.775 0-1.32.69-1.968.937-2.234.247-.266.538-.332.717-.332.18 0 .359.002.516.009.167.007.394-.063.616.471.226.544.773 1.889.84 2.025.067.135.112.296.022.472-.089.176-.134.286-.269.444-.135.158-.284.353-.406.473-.135.135-.276.282-.119.551.157.269.699 1.154 1.498 1.865 1.028.914 1.895 1.198 2.164 1.333.269.135.426.113.583-.067.157-.18.673-.784.852-1.053.18-.269.359-.224.606-.135.247.089 1.57.739 1.839.873.269.135.449.202.516.314.067.112.067.649-.18 1.341z" />
                    </svg>
                </a>
            )}

            {/* Facebook */}
            {socialLinks.facebook && (
                <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-10 h-10 rounded-full border border-purple-200 bg-white shadow-md flex items-center justify-center hover:scale-110 hover:border-purple-600 hover:text-purple-600 hover:shadow-lg transition-all text-zinc-800"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                </a>
            )}

            {/* Instagram */}
            {socialLinks.instagram && (
                <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-full border border-purple-200 bg-white shadow-md flex items-center justify-center hover:scale-110 hover:border-purple-600 hover:text-purple-600 hover:shadow-lg transition-all text-zinc-800"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                </a>
            )}

            {/* YouTube */}
            {socialLinks.youtube && (
                <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-10 h-10 rounded-full border border-purple-200 bg-white shadow-md flex items-center justify-center hover:scale-110 hover:border-purple-600 hover:text-purple-600 hover:shadow-lg transition-all text-zinc-800"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                </a>
            )}

            {/* LinkedIn */}
            {socialLinks.linkedin && (
                <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-10 h-10 rounded-full border border-purple-200 bg-white shadow-md flex items-center justify-center hover:scale-110 hover:border-purple-600 hover:text-purple-600 hover:shadow-lg transition-all text-zinc-800"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-1.3.7-1.7 1.4-1.7.9 0 1.35.6 1.35 1.7v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                </a>
            )}
        </div>
    );
}
