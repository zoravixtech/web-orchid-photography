"use client";

import { useEffect, useRef, useState } from "react";
import { uploadFile } from "@/lib/uploadClient";
import { useToast } from "@/components/admin/Toast";
import { useAdminSettingsStore } from "@/stores/adminSettingsStore";
import type { Org, SiteSettings, SocialLinks, StatsCounters } from "@/lib/types";

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

export default function SettingsForm({ org, initialSettings }: { org: Org; initialSettings: SiteSettings }) {
    const toast = useToast();

    // Reads the live store — on a revisit within this session this is
    // already populated, so the form paints instantly with the last-known
    // values instead of a blank flash while the fresh props below settle in.
    const settings = useAdminSettingsStore((state) => state.byOrg[org]);
    const hydrate = useAdminSettingsStore((state) => state.hydrate);
    const setField = useAdminSettingsStore((state) => state.setField);
    const save = useAdminSettingsStore((state) => state.save);

    useEffect(() => {
        hydrate(org, initialSettings);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [org, initialSettings]);

    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [saving, setSaving] = useState(false);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const handleUploadVideo = async (file: File) => {
        setUploadingVideo(true);
        try {
            const { publicUrl } = await uploadFile("video", file, file.name || "", { org });
            setField(org, "heroVideoUrl", publicUrl);
            toast.success("Video uploaded.");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploadingVideo(false);
        }
    };

    const setStat = (key: keyof StatsCounters, raw: string) => {
        const value = Number(raw);
        setField(org, "stats", { ...settings.stats, [key]: Number.isFinite(value) && value >= 0 ? Math.round(value) : 0 });
    };

    const setSocial = (key: keyof SocialLinks, value: string) => {
        setField(org, "socialLinks", { ...settings.socialLinks, [key]: value || null });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const result = await save(org, { stats: settings.stats, socialLinks: settings.socialLinks });
            if (result.error) toast.error(result.error);
            else toast.success("Settings saved.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-6">
            {/* Hero video */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900">Landing Page Video</h2>
                <p className="text-sm text-slate-500 mt-1 mb-5">
                    The autoplay video shown in the featured section on this org&apos;s home page.
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
                                if (file) handleUploadVideo(file);
                                e.target.value = "";
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => videoInputRef.current?.click()}
                            disabled={uploadingVideo}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white text-sm px-4 py-2 hover:bg-slate-800 disabled:opacity-60 transition-colors"
                        >
                            {uploadingVideo ? "Uploading & optimizing…" : "Upload new video"}
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
