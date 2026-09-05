import * as React from "react";
import { AppPage, PageHeader } from "@/components/layout/page-header";
import { SettingsPanels } from "@/components/domain/settings-panels";

export const metadata = { title: "تنظیمات و حریم خصوصی" };

export default function SettingsPage() {
  return (
    <AppPage>
      <PageHeader
        title="تنظیمات و حریم خصوصی"
        description="کنترل اینکه چه کسی چه چیزی از تو می‌بیند."
      />
      <SettingsPanels />
    </AppPage>
  );
}
