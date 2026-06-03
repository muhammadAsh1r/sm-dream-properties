import { clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";

function buildRequestOrigin(headerStore: Headers): string {
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "https";

  if (host) {
    return `${proto}://${host}`.replace(/\/$/, "");
  }

  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

function getAuthorizedParties(origin: string): string[] {
  const parties = new Set<string>(["http://localhost:3000"]);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (appUrl) parties.add(appUrl);

  try {
    parties.add(new URL(origin).origin);
  } catch {
    // ignore invalid origin
  }

  return [...parties];
}

async function authenticateRequest(request: Request) {
  const client = await clerkClient();
  const origin = new URL(request.url).origin;

  const requestState = await client.authenticateRequest(request, {
    authorizedParties: getAuthorizedParties(origin),
  });

  const auth = requestState.toAuth();
  return { userId: auth?.userId ?? null };
}

export async function getClerkAuth() {
  try {
    const headerStore = await headers();
    const origin = buildRequestOrigin(headerStore);
    const request = new Request(origin, { headers: headerStore });

    return await authenticateRequest(request);
  } catch (error) {
    console.error("[clerk] Session verification failed:", error);
    return { userId: null };
  }
}

export async function getClerkAuthFromRequest(request: Request) {
  try {
    return await authenticateRequest(request);
  } catch (error) {
    console.error("[clerk] Session verification failed:", error);
    return { userId: null };
  }
}

export async function getClerkUser(userId: string) {
  const client = await clerkClient();
  return client.users.getUser(userId);
}
