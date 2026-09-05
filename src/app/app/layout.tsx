import * as React from "react";
import { getApi } from "@/lib/api";
import { AppShell } from "@/components/layout/app-shell";

export const metadata = { title: "محصول" };

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const api = getApi();

  // A failure here must not take the whole shell down — the navigation still
  // works without a notification count.
  const unread = await api
    .listNotifications()
    .then((items) => items.filter((item) => !item.read).length)
    .catch(() => 0);

  return (
    <AppShell sampleData={api.kind === "sample"} unreadCount={unread}>
      {children}
    </AppShell>
  );
}
