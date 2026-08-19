import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface AdminSession {
    email: string;
}

function getSecret(): Uint8Array {
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret) {
        throw new Error("ADMIN_SESSION_SECRET env var is not set");
    }
    return new TextEncoder().encode(secret);
}

export async function createSessionToken(email: string): Promise<string> {
    return new SignJWT({ email })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
        .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
    try {
        const { payload } = await jwtVerify(token, getSecret());
        if (typeof payload.email !== "string") return null;
        return { email: payload.email };
    } catch {
        return null;
    }
}

/**
 * Reads the current admin session from the request cookie.
 * Returns null when not logged in.
 */
export async function getSession(): Promise<AdminSession | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return verifySessionToken(token);
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;

/**
 * Throws a redirect to /admin/login when there is no valid session.
 * Call from layouts/pages that require authentication.
 */
export async function requireAdmin(): Promise<AdminSession> {
    const session = await getSession();
    if (!session) {
        redirect("/admin/login");
    }
    return session;
}