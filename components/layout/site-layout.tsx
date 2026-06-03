"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/layout/footer";
import { MainContent } from "@/components/layout/main-content";
import { Navbar } from "@/components/layout/navbar";
import type { PublicSiteConfig } from "@/features/content/queries/public";

type SiteLayoutProps = {
  children: React.ReactNode;
  site: PublicSiteConfig;
};

const BARE_ROUTES = ["/admin", "/sign-in", "/sign-up", "/access-denied"];

function isBareRoute(pathname: string) {
  return BARE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function SiteLayout({ children, site }: SiteLayoutProps) {
  const pathname = usePathname();

  if (isBareRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <MainContent>{children}</MainContent>
      <Footer site={site} />
    </div>
  );
}
