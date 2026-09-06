import type { ReviewPlatform } from "@/lib/types";

export function PlatformLogo({
    platform,
    className = "w-5 h-5",
}: {
    platform?: ReviewPlatform | null;
    className?: string;
}) {
    if (!platform) return null;

    if (platform === "google") {
        return (
            <svg className={`${className} shrink-0`} viewBox="0 0 24 24" aria-label="Google Review">
                <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                />
                <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                />
                <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                />
            </svg>
        );
    }

    if (platform === "facebook") {
        return (
            <svg className={`${className} shrink-0`} viewBox="0 0 24 24" aria-label="Facebook Review">
                <path
                    fill="#1877F2"
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
            </svg>
        );
    }

    if (platform === "wedmegood") {
        return (
            <svg className={`${className} shrink-0`} viewBox="0 0 24 24" aria-label="WedMeGood Review">
                <rect width="24" height="24" rx="6" fill="#E72E77" />
                <text
                    x="12"
                    y="15.5"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    fontWeight="800"
                    fontSize="9"
                    letterSpacing="-0.3px"
                >
                    WMG
                </text>
            </svg>
        );
    }

    return null;
}
