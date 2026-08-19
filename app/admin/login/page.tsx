import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import LoginForm from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
    const session = await getSession();
    if (session) redirect("/admin");

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-md">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <span className="font-serif text-2xl font-bold text-white">
                            Orchid<span className="text-purple-400">.</span>
                        </span>
                        <h1 className="mt-3 text-sm uppercase tracking-widest text-slate-400">
                            Admin Login
                        </h1>
                    </div>

                    <LoginForm />

                    <div className="mt-8 text-center">
                        <Link
                            href="/"
                            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            ← Back to website
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}