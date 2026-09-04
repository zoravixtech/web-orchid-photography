import Image from "next/image";

interface PageBannerProps {
    eyebrow: string;
    title: React.ReactNode;
    description?: string;
    imageSrc?: string;
    imageAlt: string;
}

const DEFAULT_IMAGE =
    "https://images.prismic.io/chobirkotha2/ZwwH8oF3NbkBXXt5_ARG_9438.jpg?auto=format,compress&rect=0,0,6017,4011&w=1920&h=1080";

export default function PageBanner({ eyebrow, title, description, imageSrc = DEFAULT_IMAGE, imageAlt }: PageBannerProps) {
    return (
        <div className="relative py-24 sm:py-32 mt-28 bg-slate-950 text-white overflow-hidden">
            <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                className="object-cover object-center opacity-35"
                sizes="100vw"
            />

            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-slate-950/80 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 text-center flex flex-col items-center z-10">
                <span className="font-serif text-xs font-semibold tracking-[0.3em] uppercase text-purple-400 mb-3 block">
                    {eyebrow}
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white mb-4">
                    {title}
                </h1>
                {description && (
                    <p className="font-serif text-sm sm:text-base tracking-wide text-slate-300 max-w-2xl leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
