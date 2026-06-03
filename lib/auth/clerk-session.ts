import { createClerkClient } from "@clerk/backend";
import { headers } from "next/headers";

function getClerkClient() {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("CLERK_SECRET_KEY is not configured");
  }

  return createClerkClient({
    secretKey,
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  });
}

function getAuthorizedParties(): string[] {
  const parties = new Set<string>(["http://localhost:3000"]);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) parties.add(appUrl.replace(/\/$/, ""));
  return [...parties];
}

async function authenticateRequest(request: Request) {
  const clerkClient = getClerkClient();
  const requestState = await clerkClient.authenticateRequest(request, {
    authorizedParties: getAuthorizedParties(),
  });

  const auth = requestState.toAuth();
  return { userId: auth?.userId ?? null };
}

export async function getClerkAuth() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "https";
  const pathname = headerStore.get("next-url") ?? headerStore.get("x-invoke-path") ?? "/";
  const origin =
    host != null ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");

  const request = new Request(`${origin}${pathname.startsWith("/") ? pathname : `/${pathname}`}`, {
    headers: headerStore,
  });

  return authenticateRequest(request);
}

export async function getClerkAuthFromRequest(request: Request) {
  return authenticateRequest(request);
}

export async function getClerkUser(userId: string) {
  return getClerkClient().users.getUser(userId);
}
