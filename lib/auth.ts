import { cookies } from "next/headers";
import { type User, users } from "@/db/schema";
import { eq } from "drizzle-orm";
// Note: We'd typically import a db instance here, but for this utility we might just need helpers.
// Actually, for session management we just need cookie logic.

const SESSION_COOKIE_NAME = "user_session";

export async function createSession(userId: number) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function getSessionId() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (!session?.value) return null;
  return parseInt(session.value, 10);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
