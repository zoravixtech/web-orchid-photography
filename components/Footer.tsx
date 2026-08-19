import Link from "next/link";
import Image from "next/image";
import type { SocialLinks } from "@/lib/types";

function GDPRBadge() {
    return (
        <svg viewBox="0 0 100 100" className="w-13 h-13 sm:w-14 sm:h-14 shrink-0">
            <circle cx="50" cy="50" r="46" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#FACC15" strokeWidth="1.5" strokeDasharray="3 3" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const x = 50 + 33 * Math.cos(rad);
                const y = 50 + 33 * Math.sin(rad);
                return <circle key={i} cx={x} cy={y} r="2.2" fill="#FACC15" />;
            })}
            <text
                x="50"
                y="54"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="bold"
                fontFamily="sans-serif"
                letterSpacing="0.5"
            >
                ★ GDPR ★
            </text>
        </svg>
    );
}

function ISOBadge() {
    return (
        <svg viewBox="0 0 100 100" className="w-13 h-13 sm:w-14 sm:h-14 shrink-0">
            <circle cx="50" cy="50" r="46" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5" />
            <path
                d="M 22 28 A 34 34 0 0 1 78 28"
                fill="none"
                stroke="#E0F2FE"
                strokeWidth="1.5"
                strokeDasharray="2.5 2.5"
            />
            <text
                x="50"
                y="24"
                textAnchor="middle"
                fill="#E0F2FE"
                fontSize="6"
                fontWeight="bold"
                letterSpacing="0.8"
            >
                LEAD AUDITOR
            </text>
            <text
                x="50"
                y="51"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="bold"
            >
                ★ ISO ★
            </text>
            <text
                x="50"
                y="66"
                textAnchor="middle"
                fill="#FACC15"
                fontSize="9"
                fontWeight="bold"
            >
                27001
            </text>
        </svg>
    );
}

export default function Footer({
    logoUrl,
    socialLinks,
}: {
    logoUrl?: string | null;
    socialLinks: SocialLinks;
}) {
    return (
        <footer id="contact" className="bg-[#141b27] text-slate-300 pt-16 pb-0 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-slate-800/80">

                    {/* Column 1: Brand & Certifications */}
                    <div className="flex flex-col items-start">
                        {/* Logo */}
                        <div className="mb-4">
                            <Link href="/" className="flex items-center gap-2.5 group">
                                <Image
                                    src={logoUrl || "/favicon.webp"}
                                    alt="Orchid Photography Logo"
                                    width={40}
                                    height={40}
                                    className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                                />
                                <span className="font-serif text-xl font-bold tracking-tight text-white">
                                    Orchid <span className="text-purple-400 font-normal">Photography</span>
                                </span>
                            </Link>
                        </div>

                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
                            Orchid Photography is fully committed to capturing timeless memories with artistic perfection and quality, ensuring full client satisfaction and data privacy.
                        </p>

                        {/* Badges */}
                        <div className="flex items-center gap-4 mb-6">
                            <GDPRBadge />
                            <ISOBadge />
                        </div>

                        {/* Copyright */}
                        <p className="text-slate-500 text-xs font-medium">
                            © Orchid Photography - All rights reserved.
                        </p>
                    </div>

                    {/* Column 2: PAGES */}
                    <div>
                        <h4 className="text-slate-200 font-bold text-xs sm:text-sm tracking-widest uppercase mb-5 font-sans">
                            PAGES
                        </h4>
                        <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-slate-400">
                            <li><Link href="/" className="hover:text-purple-400 transition-colors">Home</Link></li>
                            <li><Link href="/#services" className="hover:text-purple-400 transition-colors">Services</Link></li>
                            <li><Link href="/#gallery" className="hover:text-purple-400 transition-colors">Gallery</Link></li>
                            <li><Link href="/kidography" className="hover:text-purple-400 transition-colors">Kidography</Link></li>
                            <li><Link href="/#why-us" className="hover:text-purple-400 transition-colors">Why Choose Us</Link></li>
                            <li><Link href="/#about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
                            <li><Link href="/#testimonials" className="hover:text-purple-400 transition-colors">Client Reviews</Link></li>
                            <li><Link href="/blog" className="hover:text-purple-400 transition-colors">Blogs</Link></li>
                            <li><Link href="/#contact" className="hover:text-purple-400 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: GENERAL */}
                    <div>
                        <h4 className="text-slate-200 font-bold text-xs sm:text-sm tracking-widest uppercase mb-5 font-sans">
                            GENERAL
                        </h4>
                        <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-slate-400">
                            <li><Link href="/#services" className="hover:text-purple-400 transition-colors">Pre-Wedding Photography</Link></li>
                            <li><Link href="/#services" className="hover:text-purple-400 transition-colors">Wedding Photography</Link></li>
                            <li><Link href="/#services" className="hover:text-purple-400 transition-colors">Baby Photoshoots</Link></li>
                            <li><Link href="/#services" className="hover:text-purple-400 transition-colors">Corporate & Interior</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/refund-policy" className="hover:text-purple-400 transition-colors">Refund Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-purple-400 transition-colors">Terms and Conditions</Link></li>
                            <li><Link href="/faqs" className="hover:text-purple-400 transition-colors">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: CONNECT WITH US & CONTACT */}
                    <div className="flex flex-col gap-4 text-xs sm:text-sm">
                        <h4 className="text-slate-200 font-bold text-xs sm:text-sm tracking-widest uppercase mb-1 font-sans">
                            CONNECT WITH US
                        </h4>

                        {/* Social Icons Row */}
                        <div className="flex items-center gap-3 mb-2">
                            {socialLinks.youtube && (
                                <a
                                    href={socialLinks.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="YouTube"
                                    className="w-8 h-8 rounded-md bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white hover:bg-purple-600 hover:border-purple-500 transition-all"
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                            )}
                            {socialLinks.instagram && (
                                <a
                                    href={socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="w-8 h-8 rounded-md bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white hover:bg-purple-600 hover:border-purple-500 transition-all"
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                            )}
                            {socialLinks.linkedin && (
                                <a
                                    href={socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="w-8 h-8 rounded-md bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white hover:bg-purple-600 hover:border-purple-500 transition-all"
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-1.3.7-1.7 1.4-1.7.9 0 1.35.6 1.35 1.7v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                                    </svg>
                                </a>
                            )}
                            {socialLinks.facebook && (
                                <a
                                    href={socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="w-8 h-8 rounded-md bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white hover:bg-purple-600 hover:border-purple-500 transition-all"
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                            )}
                        </div>

                        {/* Email */}
                        <a href="mailto:orchidphotography.official@gmail.com" className="flex items-center gap-2.5 text-slate-300 hover:text-purple-400 transition-colors">
                            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>orchidphotography.official@gmail.com</span>
                        </a>

                        {/* Support Phones */}
                        <div className="mt-2">
                            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block mb-1">
                                SUPPORT
                            </span>
                            <a href="tel:+919876543210" className="flex items-center gap-2.5 text-slate-300 hover:text-purple-400 transition-colors">
                                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>+91 98765 43210</span>
                            </a>
                        </div>

                        {/* Sales Phones */}
                        <div className="mt-2">
                            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block mb-1">
                                SALES
                            </span>
                            <div className="flex flex-col gap-1.5">
                                <a href="tel:+919876543211" className="flex items-center gap-2.5 text-slate-300 hover:text-purple-400 transition-colors">
                                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>+91 98765 43211</span>
                                </a>
                                <a href="tel:+919876543212" className="flex items-center gap-2.5 text-slate-300 hover:text-purple-400 transition-colors">
                                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>+91 98765 43212</span>
                                </a>
                            </div>
                        </div>

                        {/* Location Address */}
                        <div className="mt-2 flex items-start gap-2.5 text-slate-400 leading-relaxed">
                            <svg className="w-4 h-4 text-slate-400 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-xs">
                                27, Kona Expy, Naora, Shibpur, Howrah, Kolkata, West Bengal 711103
                            </span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Giant Faint Brand Watermark Banner at Bottom */}
            <div className="w-full text-center overflow-hidden select-none pointer-events-none mt-10 sm:mt-12 -mb-6 sm:-mb-12 relative z-0">
                <span className="text-[11vw] sm:text-[9.5vw] font-black tracking-tighter leading-none text-slate-800/40 uppercase block opacity-25">
                    ORCHID
                </span>
            </div>

            {/* Floating WhatsApp Action Button */}
            {socialLinks.whatsapp && (
                <a
                    href={socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contact on WhatsApp"
                    className="fixed bottom-6 right-6 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3.5 rounded-full shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.242-1.111z" />
                    </svg>
                </a>
            )}
        </footer>
    );
}

