"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ButtonLink, IconButton } from "@/components/ui/button";
import { Logo } from "./logo";

const NAV = [
  { href: "/how-it-works", label: "منجنیق چطور کار می‌کند" },
  { href: "/events", label: "رویدادها" },
  { href: "/stories", label: "نتیجه‌ها" },
  { href: "/about", label: "دربارهٔ ما" },
] as const;

/**
 * Public site header.
 *
 * The primary action is «ساخت پروفایل» rather than a purchase: the product
 * asks for a profile before it asks for money, which is the same order the
 * homepage argues for.
 */
export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
          aria-label="منجنیق — صفحهٔ اصلی"
        >
          <Logo />
        </Link>

        <nav aria-label="پیمایش اصلی" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                  active ? "text-brand" : "text-muted hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href="/login" variant="ghost" size="sm">
            ورود
          </ButtonLink>
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
        <div id="site-menu" className="border-t border-line bg-surface lg:hidden">
          <nav aria-label="پیمایش اصلی — موبایل" className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            <ul className="flex flex-col">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-2 py-3 text-sm text-ink transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
              <ButtonLink href="/app/onboarding" block>
                ساخت پروفایل
              </ButtonLink>
              <ButtonLink href="/login" variant="secondary" block>
                ورود
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
