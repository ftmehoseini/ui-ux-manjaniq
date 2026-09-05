import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ToastProvider } from "@/components/ui/toast";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://manjaniq.com"),
  title: {
    default: "منجنیق — آدم درست را پیدا کن",
    template: "%s — منجنیق",
  },
  description:
    "منجنیق آدم‌های مرتبط را در زمان درست به هم می‌رساند. به‌جای آشنایی تصادفی، پیشنهادهایی که دلیلشان مشخص است.",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "منجنیق",
    title: "منجنیق — آدم درست را پیدا کن",
    description:
      "منجنیق آدم‌های مرتبط را در زمان درست به هم می‌رساند. به‌جای آشنایی تصادفی، پیشنهادهایی که دلیلشان مشخص است.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1113" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable} suppressHydrationWarning>
      <body>
        <a href="#main" className="skip-link rounded-md bg-brand px-4 py-2 text-on-brand">
          رفتن به محتوای اصلی
        </a>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
