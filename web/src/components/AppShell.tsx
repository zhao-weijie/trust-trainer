"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardCheck, GraduationCap, ShieldCheck, Upload } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { StatusBadge } from "./StatusBadge";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  activePrefix?: string;
};

const navItems: NavItem[] = [
  { href: "/submit", label: "Check", icon: Upload },
  { href: "/admin", label: "Review", icon: ClipboardCheck },
  { href: "/challenge/approved-draft-seed-government-grant", label: "Drill", icon: GraduationCap, activePrefix: "/challenge" },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 }
];

export type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <header className="app-shell__topbar">
        <Link className="app-shell__brand" href="/">
          <span className="app-shell__brand-mark" aria-hidden="true">
            <ShieldCheck size={16} strokeWidth={2.2} />
          </span>
          <span>Trust Trainer</span>
        </Link>

        <nav aria-label="Primary" className="app-shell__nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || Boolean(item.activePrefix && pathname?.startsWith(item.activePrefix));

            return (
              <Link className="app-shell__nav-link" data-active={isActive} href={item.href} key={item.href}>
                <Icon size={15} strokeWidth={2.1} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="app-shell__status">
          <StatusBadge tone="draft">Demo dataset</StatusBadge>
        </div>
      </header>
      <main className="app-shell__main">{children}</main>
    </div>
  );
}
