import { requireAdmin } from "@/lib/auth/session";
import Sidebar from "@/components/admin/Sidebar";
import { ToastProvider } from "@/components/admin/Toast";

export default async function AdminPanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireAdmin();

    return (
        <ToastProvider>
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 min-w-0 pl-64">
                    <div className="p-6 lg:p-10">{children}</div>
                </main>
            </div>
        </ToastProvider>
    );
}