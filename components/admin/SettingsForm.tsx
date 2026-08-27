"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { uploadFile } from "@/lib/uploadClient";
import { useToast } from "@/components/admin/Toast";
import { useAdminSettingsStore } from "@/stores/adminSettingsStore";
import type { SiteSettings, SocialLinks, StatsCounters } from "@/lib/types";

const STAT_FIELDS: { key: keyof StatsCounters; label: string }[] = [
    { key: "weddings", label: "Weddings" },
    { key: "preWeddings", label: "Pre Weddings" },
    { key: "babyPhotoshoots", label: "Baby Photoshoots" },
    { key: "corporateInterior", label: "Corporate & Interior" },
];

const SOCIAL_FIELDS: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
    { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/91XXXXXXXXXX" },
    { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage" },
    { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourhandle" },
    { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
    { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/yourcompany" },
];

export default function SettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
    const toast = useToast();

    // Reads the live store — on a revisit within this session this is
    // already populated, so the form paints instantly with the last-known
    // values instead of a blank flash while the fresh props below settle in.
    const settings = useAdminSettingsStore((state) => state.settings);
    const hydrate = useAdminSettingsStore((state) => state.hydrate);
    const setField = useAdminSettingsStore((state) => state.setField);
    const save = useAdminSettingsStore((state) => state.save);

    useEffect(() => {
        hydrate(initialSettings);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialSettings]);

    const [uploadingKind, setUploadingKind] = useState<"logo" | "video" | "kidsVideo" | null>(null);
    const [saving, setSaving] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const kidsVideoInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (kind: "logo" | "video" | "kidsVideo", file: File) => {
        setUploadingKind(kind);
        try {
            const { publicUrl } = await uploadFile(kind, file, file.name || "");
            if (kind === "logo") setField("logoUrl", publicUrl);
            else if (kind === "video") setField("heroVideoUrl", publicUrl);
            else setField("kidsHeroVideoUrl", publicUrl);
            toast.success(kind === "logo" ? "Logo uploaded." : "Video uploaded.");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploadingKind(null);
        }
    };

    const setStat = (key: keyof StatsCounters, raw: string) => {
        const value = Number(raw);
        setField("stats", { ...settings.stats, [key]: Number.isFinite(value) && value >= 0 ? Math.round(value) : 0 });
    };

    const setSocial = (key: keyof SocialLinks, value: string) => {
        setField("socialLinks", { ...settings.socialLinks, [key]: value || null });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const result = await save({
                logoUrl: settings.logoUrl || null,
                stats: settings.stats,
                socialLinks: settings.socialLinks,
            });
            if (result.error) toast.error(result.error);
            else toast.success("Settings saved.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-6">
            {/* Logo */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900">Logo</h2>
                <p className="text-sm text-slate-500 mt-1 mb-5">
                    The logo shown in the navigation bar and footer.
                </p>

                <div className="flex items-start gap-6">
                    <div className="w-28 h-28 shrink-0 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden">
                        {settings.logoUrl ? (
                            <Image
                                src={settings.logoUrl}
                                alt="Site logo preview"
                                width={112}
                                height={112}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <span className="text-xs text-slate-400">No logo</span>
                        )}
                    </div>

                    <div className="flex-1 space-y-3">
                        <div>
                            <label htmlFor="logo_url" className="block text-xs font-medium text-slate-500 mb-1">
                                Logo URL
                            </label>
                            <input
                                id="logo_url"
                                type="text"
                                value={settings.logoUrl ?? ""}
                                onChange={(e) => setField("logoUrl", e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="/favicon.webp"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUpload("logo", file);
                                    e.target.value = "";
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => logoInputRef.current?.click()}
                                disabled={uploadingKind === "logo"}
                                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white text-sm px-4 py-2 hover:bg-slate-800 disabled:opacity-60 transition-colors"
                            >
                                {uploadingKind === "logo" ? "Uploading…" : "Upload new logo"}
                            </button>
                            <span className="text-xs text-slate-400">PNG, JPG, WebP or SVG</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hero video */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900">Landing Page Video</h2>
                <p className="text-sm text-slate-500 mt-1 mb-5">
                    The autoplay video shown in the featured section on the home page.
                </p>

                <div className="space-y-3">
                    <div>
                        <label htmlFor="hero_video_url" className="block text-xs font-medium text-slate-500 mb-1">
                            Video URL
                        </label>
                        <input
                            id="hero_video_url"
                            type="text"
                            value={settings.heroVideoUrl ?? ""}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="https://... or upload a video below"
                            disabled
                            readOnly
                        />
                    </div>

                    {settings.heroVideoUrl && (
                        <video
                            key={settings.heroVideoUrl}
                            src={settings.heroVideoUrl}
                            controls
                            playsInline
                            className="w-full aspect-video rounded-xl bg-black object-cover"
                        />
                    )}

                    <div className="flex items-center gap-3">
                        <input
                            ref={videoInputRef}
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpload("video", file);
                                e.target.value = "";
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => videoInputRef.current?.click()}
                            disabled={uploadingKind === "video"}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white text-sm px-4 py-2 hover:bg-slate-800 disabled:opacity-60 transition-colors"
                        >
                            {uploadingKind === "video" ? "Uploading…" : "Upload new video"}
                        </button>
                        <span className="text-xs text-slate-400">MP4, WebM or MOV — optimized automatically on upload</span>
                    </div>
                </div>
            </section>

            {/* Kidography hero video */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900">Kidography Landing Page Video</h2>
                <p className="text-sm text-slate-500 mt-1 mb-5">
                    The autoplay video shown in the featured section on the kidography home page.
                </p>

                <div className="space-y-3">
                    <div>
                        <label htmlFor="kids_hero_video_url" className="block text-xs font-medium text-slate-500 mb-1">
                            Video URL
                        </label>
                        <input
                            id="kids_hero_video_url"
                            type="text"
                            value={settings.kidsHeroVideoUrl ?? ""}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="https://... or upload a video below"
                            disabled
                            readOnly
                        />
                    </div>

                    {settings.kidsHeroVideoUrl && (
                        <video
                            key={settings.kidsHeroVideoUrl}
                            src={settings.kidsHeroVideoUrl}
                            controls
                            playsInline
                            className="w-full aspect-video rounded-xl bg-black object-cover"
                        />
                    )}

                    <div className="flex items-center gap-3">
                        <input
                            ref={kidsVideoInputRef}
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpload("kidsVideo", file);
                                e.target.value = "";
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => kidsVideoInputRef.current?.click()}
                            disabled={uploadingKind === "kidsVideo"}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white text-sm px-4 py-2 hover:bg-slate-800 disabled:opacity-60 transition-colors"
                        >
                            {uploadingKind === "kidsVideo" ? "Uploading…" : "Upload new video"}
                        </button>
                        <span className="text-xs text-slate-400">MP4, WebM or MOV — optimized automatically on upload</span>
                    </div>
                </div>
            </section>

            {/* Stats counters */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900">Stats Counters</h2>
                <p className="text-sm text-slate-500 mt-1 mb-5">
                    The numbers shown in the animated counter section on the home page. Each one counts up from 0 to this value when a visitor scrolls to it.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {STAT_FIELDS.map(({ key, label }) => (
                        <div key={key}>
                            <label htmlFor={key} className="block text-xs font-medium text-slate-500 mb-1">
                                {label}
                            </label>
                            <input
                                id={key}
                                type="number"
                                min={0}
                                step={1}
                                value={settings.stats[key]}
                                onChange={(e) => setStat(key, e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Social links */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900">Social Links</h2>
                <p className="text-sm text-slate-500 mt-1 mb-5">
                    Destination URL for each social icon shown on the home page. Leave a field empty to hide that icon&apos;s link.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
                        <div key={key}>
                            <label htmlFor={`social_${key}`} className="block text-xs font-medium text-slate-500 mb-1">
                                {label}
                            </label>
                            <input
                                id={`social_${key}`}
                                type="url"
                                value={settings.socialLinks[key] ?? ""}
                                onChange={(e) => setSocial(key, e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder={placeholder}
                            />
                        </div>
                    ))}
                </div>
            </section>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 transition-colors"
                >
                    {saving ? "Saving…" : "Save Settings"}
                </button>
            </div>
        </form>
    );
}
