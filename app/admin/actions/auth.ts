"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export interface LoginState {
    error?: string;
}

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export async function login(
    _prevState: LoginState,
    formData: FormData
): Promise<LoginState> {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD ?? "";

    if (!adminEmail || !adminPassword) {
        return { error: "Admin credentials are not configured on the server." };
    }

    if (email !== adminEmail || password !== adminPassword) {
        return { error: "Invalid email or password." };
    }

    const token = await createSessionToken(email);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_DURATION_SECONDS,
    });

    redirect("/admin");
}

export async function logout(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    redirect("/admin/login");
}