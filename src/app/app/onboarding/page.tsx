import * as React from "react";
import { AppPage } from "@/components/layout/page-header";
import { OnboardingFlow } from "@/components/domain/onboarding-flow";

export const metadata = { title: "ساخت پروفایل" };

export default function OnboardingPage() {
  return (
    <AppPage className="max-w-2xl">
      <OnboardingFlow />
    </AppPage>
  );
}
