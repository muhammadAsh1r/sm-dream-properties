"use client";

import { usePathname } from "next/navigation";

type MainContentProps = {
  children: React.ReactNode;
};

export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main
      id="main-content"
      className={isHome ? "flex-1" : "flex-1 pt-[4.5rem] lg:pt-20"}
    >
      {children}
    </main>
  );
}
