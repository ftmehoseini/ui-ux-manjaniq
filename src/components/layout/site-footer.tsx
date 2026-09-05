import * as React from "react";
import Link from "next/link";
import { Logo } from "./logo";

const COLUMNS = [
  {
    title: "محصول",
    links: [
      { href: "/how-it-works", label: "منجنیق چطور کار می‌کند" },
      { href: "/events", label: "رویدادها" },
      { href: "/stories", label: "نتیجه‌ها" },
    ],
  },
  {
    title: "شفافیت",
    links: [
      { href: "/how-it-works#selection", label: "معیارهای انتخاب شرکت‌کننده" },
      { href: "/how-it-works#matching", label: "روش پیشنهاد دادن" },
      { href: "/privacy", label: "حریم خصوصی و داده‌ها" },
    ],
  },
  {
    title: "منجنیق",
    links: [
      { href: "/about", label: "دربارهٔ ما" },
      { href: "/login", label: "ورود" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <Logo className="min-h-6" />
            <p className="t-small mt-3 text-muted">
              منجنیق آدم‌های مرتبط را در زمان درست به هم می‌رساند تا از یک گفت‌وگو، یک فرصت
              واقعی دربیاید.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="t-label mb-3 text-ink">{column.title}</h2>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="t-small inline-flex min-h-6 min-w-6 items-center rounded text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <p className="t-caption mt-10 border-t border-line pt-6 text-faint">
          © منجنیق — تمام حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
