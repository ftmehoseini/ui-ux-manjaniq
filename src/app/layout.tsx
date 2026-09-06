import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Vazirmatn, self-hosted as a single variable file. One request covers every
 * weight the type scale uses, and `display: swap` keeps Persian text readable
 * during the font load rather than blank.
 */
const vazirmatn = localFont({
  src: "../styles/fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazirmatn",
  display: "swap",
  weight: "100 900",
  preload: true,
});

/**
 * Estedad sets the headlines — the event masthead, the member's name on the
 * confirmation, and the registration button. Its counters and terminals carry
 * more character than a UI face, and reserving it for display sizes keeps the
 * payload to two small subset files rather than a whole second family.
 */
const estedad = localFont({
  src: [
    { path: "../styles/fonts/Estedad-700.woff2", weight: "700", style: "normal" },
    { path: "../styles/fonts/Estedad-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-estedad",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: { default: "ثبت‌نام رویداد", template: "%s" },
  description: "ثبت‌نام آنلاین رویداد.",
  openGraph: { type: "website", locale: "fa_IR" },
};

export const viewport: Viewport = {
  themeColor: "#080a22",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${estedad.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a
          href="#main"
          className="skip-link rounded-md bg-[var(--ev-green-deep)] px-4 py-2 text-white"
        >
          رفتن به فرم ثبت‌نام
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
