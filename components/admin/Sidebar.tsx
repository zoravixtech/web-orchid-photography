"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/admin/actions/auth";
import type { Org } from "@/lib/types";

const LAST_ORG_STORAGE_KEY = "admin.lastOrg";

function orgFromPathname(pathname: string): Org | null {
    const match = pathname.match(/^\/admin\/(orchid|kidography)(\/|$)/);
    return (match?.[1] as Org | undefined) ?? null;
}

const orgNavItems = (org: Org) => [
    {
        href: `/admin/${org}`,
        label: "Settings",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.142-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        href: `/admin/${org}/gallery`,
        label: "Gallery",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        href: `/admin/${org}/categories`,
        label: "Categories",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
        ),
    },
    {
        href: `/admin/${org}/albums`,
        label: "Albums",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7a2 2 0 012-2h3l2 2h9a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
        ),
    },
];

const sharedNavItems = [
    {
        href: "/admin/blogs",
        label: "Blogs",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
        ),
    },
    {
        href: "/admin/career",
        label: "Career",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m-4 6h16M5 19h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
        ),
    },
];

function readLastOrg(): Org {
    if (typeof window === "undefined") return "orchid";
    try {
        const stored = window.localStorage.getItem(LAST_ORG_STORAGE_KEY);
        return stored === "orchid" || stored === "kidography" ? stored : "orchid";
    } catch {
        return "orchid";
    }
}

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const pathOrg = orgFromPathname(pathname);
    const [lastOrg] = useState<Org>(readLastOrg);

    useEffect(() => {
        if (!pathOrg) return;
        try {
            window.localStorage.setItem(LAST_ORG_STORAGE_KEY, pathOrg);
        } catch {
            // Storage unavailable — the switcher just falls back to "orchid" on shared pages.
        }
    }, [pathOrg]);

    const activeOrg = pathOrg ?? lastOrg;

    const switchOrg = (nextOrg: Org) => {
        if (nextOrg === activeOrg) return;
        if (pathOrg) {
            router.push(pathname.replace(`/admin/${pathOrg}`, `/admin/${nextOrg}`));
        } else {
            router.push(`/admin/${nextOrg}`);
        }
    };

    return (
        <aside className="fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-slate-900 text-slate-300">
            <div className="flex items-center gap-2 px-6 h-16 border-b border-slate-800">
                <span className="font-bold text-lg text-white whitespace-nowrap">
                    The Orchid<span className="text-purple-400">.</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">
                    Admin
                </span>
            </div>

            {/* Org switcher */}
            <div className="p-3 border-b border-slate-800">
                <div className="flex rounded-lg border border-slate-700 overflow-hidden">
                    {(["orchid", "kidography"] as Org[]).map((org) => (
                        <button
                            key={org}
                            type="button"
                            onClick={() => switchOrg(org)}
                            className={`flex-1 px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors capitalize ${
                                activeOrg === org
                                    ? "bg-purple-600 text-white"
                                    : "bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                            {org}
                        </button>
                    ))}
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 space-y-6 px-3">
                <div className="space-y-1">
                    <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                        {activeOrg} content
                    </p>
                    {orgNavItems(activeOrg).map((item) => {
                        const isActive =
                            item.label === "Settings" ? pathname === item.href : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-purple-600/20 text-purple-300 border-l-2 border-purple-500"
                                        : "hover:bg-slate-800 hover:text-white"
                                }`}
                            >
                                <span className="shrink-0">{item.icon}</span>
                                <span className="whitespace-nowrap">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="space-y-1">
                    <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                        Shared
                    </p>
                    {sharedNavItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-purple-600/20 text-purple-300 border-l-2 border-purple-500"
                                        : "hover:bg-slate-800 hover:text-white"
                                }`}
                            >
                                <span className="shrink-0">{item.icon}</span>
                                <span className="whitespace-nowrap">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="p-3 border-t border-slate-800 space-y-1">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>View Website</span>
                </Link>
                <form action={logout}>
                    <button
                        type="submit"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors w-full"
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </form>
            </div>
        </aside>
    );
}
