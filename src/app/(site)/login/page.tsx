import type { Metadata } from "next";
import * as React from "react";
import Link from "next/link";
import { Section } from "@/components/marketing/shell";
import { Card } from "@/components/ui/primitives";
import { LoginForm } from "@/components/marketing/login-form";

export const metadata: Metadata = {
  title: "ورود",
  description: "ورود به حساب منجنیق.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Section className="pt-14">
      <div className="mx-auto max-w-md">
        <h1 className="t-h1 text-ink">ورود به منجنیق</h1>
        <p className="t-body mt-3 text-muted">
          شمارهٔ موبایلت را وارد کن تا کد ورود برایت فرستاده شود.
        </p>

        <Card padding="lg" className="mt-6">
          <LoginForm />
        </Card>

        <p className="t-small mt-6 text-center text-muted">
          هنوز پروفایل نساخته‌ای؟{" "}
          <Link
            href="/app/onboarding"
            className="rounded text-brand underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            ساخت پروفایل
          </Link>
        </p>
      </div>
    </Section>
  );
}
