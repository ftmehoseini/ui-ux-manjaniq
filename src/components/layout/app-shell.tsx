"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarDays,
  Handshake,
  House,
  Settings,
  Sparkles,
  Target,
  UserPen,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo, LogoMark } from "./logo";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** Shown in the mobile bar. The rest live in the desktop rail only. */
  primary: boolean;
}

const NAV: readonly NavItem[] = [
  { href: "/app", label: "خانه", icon: <House className="size-5" aria-hidden />, primary: true },
  {
    href: "/app/matches",
    label: "پیشنهادها",
    icon: <Sparkles className="size-5" aria-hidden />,
    primary: true,
  },
  {
    href: "/app/opportunities",
    label: "فرصت‌ها",
    icon: <Target className="size-5" aria-hidden />,
    primary: true,
  },
  {
    href: "/app/connections",
    label: "ارتباط‌ها",
    icon: <Handshake className="size-5" aria-hidden />,
    primary: true,
  },
  {
    href: "/app/events",
    label: "رویدادها",
    icon: <CalendarDays className="size-5" aria-hidden />,
    primary: false,
  },
  {
    href: "/app/profile",
    label: "پروفایل",
    icon: <UserPen className="size-5" aria-hidden />,
    primary: false,
  },
];

const SECONDARY: readonly NavItem[] = [
  {
    href: "/app/notifications",
    label: "اعلان‌ها",
    icon: <Bell className="size-5" aria-hidden />,
    primary: false,
  },
  {
    href: "/app/settings",
    label: "تنظیمات و حریم خصوصی",
    icon: <Settings className="size-5" aria-hidden />,
    primary: false,
  },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}

/**
 * Authenticated shell.
 *
 * Desktop uses a navigation rail beside the content; mobile uses a bottom tab
 * bar holding the four destinations a member actually moves between, with the
 * rest reachable from the top bar. The mobile layout is a different
 * composition rather than a narrowed copy of the desktop one — a sidebar
 * squeezed into 390px would push the primary task below the fold.
 */
export function AppShell({
  children,
  sampleData,
  unreadCount,
}: {
  children: React.ReactNode;
  sampleData: boolean;
  unreadCount: number;
}) {
  const pathname = usePathname();
  const primary = NAV.filter((item) => item.primary);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {sampleData && <SampleDataBanner />}

      <div className="flex flex-1">
        {/* Desktop rail */}
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 border-e border-line bg-surface lg:flex lg:flex-col">
          <div className="px-5 py-5">
            <Link
              href="/app"
              className="rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
            >
              <Logo />
            </Link>
          </div>

          <nav aria-label="پیمایش محصول" className="flex-1 overflow-y-auto px-3">
            <ul className="flex flex-col gap-0.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <RailLink item={item} active={isActive(pathname, item.href)} />
                </li>
              ))}
            </ul>

            <hr className="my-4 border-line" />

            <ul className="flex flex-col gap-0.5">
              {SECONDARY.map((item) => (
                <li key={item.href}>
                  <RailLink
                    item={item}
                    active={isActive(pathname, item.href)}
                    badge={item.href === "/app/notifications" ? unreadCount : 0}
                  />
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile top bar */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-line bg-background/90 px-4 backdrop-blur-sm lg:hidden">
            <Link href="/app" aria-label="منجنیق — خانه" className="rounded text-brand">
              <LogoMark />
            </Link>
            <div className="flex items-center gap-1">
              <TopBarLink
                href="/app/notifications"
                label="اعلان‌ها"
                badge={unreadCount}
                icon={<Bell className="size-5" aria-hidden />}
              />
              <TopBarLink
                href="/app/profile"
                label="پروفایل"
                icon={<UserPen className="size-5" aria-hidden />}
              />
              <TopBarLink
                href="/app/settings"
                label="تنظیمات"
                icon={<Settings className="size-5" aria-hidden />}
              />
            </div>
          </header>

          <main id="main" className="flex-1 pb-20 lg:pb-0">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile tab bar */}
      <nav
        aria-label="پیمایش اصلی"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface lg:hidden"
      >
        <ul className="mx-auto flex max-w-lg">
          {primary.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-[0.6875rem] transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus",
                    active ? "text-brand" : "text-muted",
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function RailLink({
  item,
  active,
  badge = 0,
}: {
  item: NavItem;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        active ? "bg-brand-subtle font-medium text-brand" : "text-muted hover:bg-surface-muted hover:text-ink",
      )}
    >
      <span className={active ? "text-brand" : "text-faint"}>{item.icon}</span>
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {badge > 0 && (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[0.6875rem] leading-5 text-on-brand">
          {badge.toLocaleString("fa-IR")}
        </span>
      )}
    </Link>
  );
}

function TopBarLink({
  href,
  label,
  icon,
  badge = 0,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="relative inline-flex size-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      {icon}
      {badge > 0 && (
        <span className="absolute end-1.5 top-1.5 size-2 rounded-full bg-brand" aria-hidden />
      )}
    </Link>
  );
}

/**
 * Persistent, unmissable notice that the screen is showing placeholder data.
 * Without this a sample screenshot could be mistaken for a real one.
 */
function SampleDataBanner() {
  return (
    <p className="bg-warning-subtle px-4 py-2 text-center text-[0.8125rem] text-warning">
      این صفحه با دادهٔ نمونه نمایش داده می‌شود؛ هنوز به سرور منجنیق وصل نیست.
    </p>
  );
}
