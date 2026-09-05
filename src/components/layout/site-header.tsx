"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ButtonLink, IconButton } from "@/components/ui/button";
import { Logo } from "./logo";

const NAV = [
  { href: "/how-it-works", label: "روش کار" },
  { href: "/events", label: "رویدادها" },
  { href: "/stories", label: "نتیجه‌ها" },
  { href: "/about", label: "دربارهٔ ما" },
] as const;

/**
 * Public masthead.
 *
 * A hairline rule and a transparent ground rather than a floating card — the
 * header should read as the top of a printed page, not as a bar sitting on
 * top of one. The primary action is «ساخت پروفایل», never a purchase: the
 * product asks for a profile before it asks for money.
 */
export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:h-20 sm:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
          aria-label="منجنیق — صفحهٔ اصلی"
        >
          <Logo />
        </Link>

        <nav aria-label="پیمایش اصلی" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "link-underline inline-flex min-h-11 items-center text-sm transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                  active ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/login"
            className="link-underline inline-flex min-h-11 min-w-6 items-center text-sm text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            ورود
          </Link>
          <ButtonLink href="/app/onboarding" size="sm">
            ساخت پروفایل
          </ButtonLink>
        </div>

        <IconButton
          label={open ? "بستن منو" : "باز کردن منو"}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
          className="lg:hidden"
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </IconButton>
      </div>

      {open && (
        <div id="site-menu" className="border-t border-rule bg-surface lg:hidden">
          <nav aria-label="پیمایش اصلی — موبایل" className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
            <ul className="flex flex-col">
              {NAV.map((item) => (
                <li key={item.href} className="rule-b">
                  <Link
                    href={item.href}
                    className="block py-4 font-[family-name:var(--font-display)] text-xl font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col gap-2">
              <ButtonLink href="/app/onboarding" block size="lg">
                ساخت پروفایل
              </ButtonLink>
              <ButtonLink href="/login" variant="secondary" block size="lg">
                ورود
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
