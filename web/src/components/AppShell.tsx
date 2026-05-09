"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardCheck, GraduationCap, ShieldCheck, Upload } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  activePrefix?: string;
};

const desktopNavItems: NavItem[] = [
  { href: "/submit", label: "Scam Check", icon: Upload },
  { href: "/admin", label: "Review", icon: ClipboardCheck },
  { href: "/challenge/approved-draft-seed-government-grant", label: "Drill", icon: GraduationCap, activePrefix: "/challenge" },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 }
];

const mobileNavItems: NavItem[] = [
  { href: "/submit", label: "Scam Check", icon: ShieldCheck },
  { href: "/challenge/approved-draft-seed-government-grant", label: "Drills", icon: GraduationCap, activePrefix: "/challenge" },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 }
];

export type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isActive = (item: NavItem) =>
    pathname === item.href || Boolean(item.activePrefix && pathname?.startsWith(item.activePrefix));

  return (
    <div className="app-shell">
      <header className="app-shell__topbar">
        <Link className="app-shell__brand" href="/submit">
          <span className="app-shell__brand-mark" aria-hidden="true">
            <ShieldCheck size={16} strokeWidth={2.2} />
          </span>
          <span>Trust Trainer</span>
        </Link>

        <nav aria-label="Primary" className="app-shell__nav">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link className="app-shell__nav-link" data-active={isActive(item)} href={item.href} key={item.href}>
                <Icon size={15} strokeWidth={2.1} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="app-shell__status">
          <Link className="app-shell__admin-link" href="/admin">
            <ClipboardCheck size={14} aria-hidden="true" />
            Admin review
          </Link>
        </div>
      </header>
      <main className="app-shell__main">{children}</main>
      <nav aria-label="Mobile primary" className="app-shell__bottom-nav">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link className="app-shell__bottom-link" data-active={isActive(item)} href={item.href} key={item.href}>
              <Icon size={22} strokeWidth={2} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
