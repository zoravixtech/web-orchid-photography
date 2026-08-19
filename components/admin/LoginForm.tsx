"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions/auth";

const initialState: LoginState = {};

export default function LoginForm() {
    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
        <form action={formAction} className="space-y-5">
            <div>
                <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-1.5">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="admin@example.com"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-xs font-medium text-slate-400 mb-1.5">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="••••••••"
                />
            </div>

            {state.error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {state.error}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 transition-colors"
            >
                {isPending ? "Signing in…" : "Sign In"}
            </button>
        </form>
    );
}