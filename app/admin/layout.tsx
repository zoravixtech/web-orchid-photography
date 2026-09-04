import { Montserrat } from "next/font/google";

export const metadata = {
    title: "Admin | The Orchid Photography",
};

const montserrat = Montserrat({
    subsets: ["latin"],
    display: "swap",
});

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`min-h-screen bg-zinc-100 text-zinc-900 ${montserrat.className}`}>
            {children}
        </div>
    );
}