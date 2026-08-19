export const metadata = {
    title: "Admin | Orchid Photography",
};

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-zinc-100 text-zinc-900">
            {children}
        </div>
    );
}