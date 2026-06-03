import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/sign-in/:path*",
    "/sign-up/:path*",
    "/api/upload",
  ],
};
