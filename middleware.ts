import { clerkMiddleware } from "@clerk/nextjs/server";

// Session handling only on auth-related routes. Admin access is enforced in app/admin/layout.tsx.
export default clerkMiddleware();

export const runtime = "nodejs";

export const config = {
  runtime: "nodejs",
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/sign-in/:path*",
    "/sign-up/:path*",
    "/api/upload",
  ],
};
