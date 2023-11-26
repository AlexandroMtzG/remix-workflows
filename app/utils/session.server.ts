import { createCookieSessionStorage, redirect, Session } from "@remix-run/node";
import { randomBytes } from "crypto";

export type UserSession = {
  userAnalyticsId: string;
  userId: string;
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserInfo(request: Request): Promise<UserSession> {
  const session = await getUserSession(request);
  const userAnalyticsId = session.get("userAnalyticsId") ?? null;
  return {
    userAnalyticsId,
    userId: "",
  };
}

export async function createUserSession(userSession: UserSession, redirectTo: string = "") {
  const session = await storage.getSession();
  session.set("userAnalyticsId", userSession.userAnalyticsId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function commitSession(session: Session) {
  return await storage.commitSession(session);
}

export function generateAnalyticsUserId() {
  return randomBytes(100).toString("base64");
}
