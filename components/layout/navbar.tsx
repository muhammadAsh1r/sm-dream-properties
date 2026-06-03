"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/constants";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isScrolled = useScrollPosition(20);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isTransparent = isHome && !isScrolled && !mobileOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        animate={
          isTransparent
            ? "transparent"
            : isScrolled || !isHome
              ? "scrolled"
              : "top"
        }
        variants={{
          transparent: {
            backgroundColor: "rgba(255, 255, 255, 0)",
            backdropFilter: "blur(0px)",
            borderBottomColor: "transparent",
          },
          top: {
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            borderBottomColor: "transparent",
          },
          scrolled: {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(16px)",
            borderBottomColor: "rgb(229 231 235)",
          },
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="border-b"
      >
        <Container>
          <nav
            className="flex h-[4.5rem] items-center justify-between gap-4 lg:h-20"
            aria-label="Main navigation"
          >
            <Logo />

            <ul className="hidden items-center gap-0.5 lg:flex xl:gap-1" role="list">
              {mainNav.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 xl:px-4",
                        isActive
                          ? "text-primary"
                          : "text-foreground/75 hover:bg-muted/80 hover:text-foreground"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="hidden lg:block">
              <Button
                render={<Link href="/contact" />}
                size="lg"
                className="h-11 rounded-lg bg-primary px-6 font-semibold text-secondary shadow-sm hover:bg-primary/90"
              >
                Contact Us
              </Button>
            </div>

            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-muted lg:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </nav>
        </Container>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-border bg-background/98 backdrop-blur-xl lg:hidden"
          >
            <Container className="py-6">
              <ul className="flex flex-col gap-1" role="list">
                {mainNav.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block rounded-lg px-4 py-3 text-base font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 border-t border-border pt-6">
                <Button
                  render={
                    <Link href="/contact" onClick={() => setMobileOpen(false)} />
                  }
                  className="h-11 w-full bg-primary font-semibold text-secondary hover:bg-primary/90"
                >
                  Contact Us
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
