import * as React from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { getApi } from "@/lib/api";
import { faRelative } from "@/lib/format";
import type { AppNotification } from "@/lib/types";
import { AppPage, PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/primitives";
import { EmptyState, ErrorState } from "@/components/ui/states";

export const metadata = { title: "اعلان‌ها" };

export default async function NotificationsPage() {
  let notifications: readonly AppNotification[] | null = null;
  try {
    notifications = await getApi().listNotifications();
  } catch {
    notifications = null;
  }

  return (
    <AppPage>
      <PageHeader title="اعلان‌ها" />

      <div className="mt-8">
        {notifications === null ? (
          <ErrorState description="اعلان‌ها بارگذاری نشد." />
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="size-8" aria-hidden />}
            title="اعلان تازه‌ای نداری"
            description="وقتی پیشنهاد تازه‌ای ساخته شود، کسی معرفی را بپذیرد یا پیگیری‌ای به موعدش برسد، همین‌جا خبرت می‌کنیم."
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {notifications.map((notification) => {
              const body = (
                <>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="t-label text-ink">{notification.title}</h2>
                    <span className="t-caption text-faint">
                      {faRelative(notification.createdAt)}
                    </span>
                  </div>
                  <p className="t-small mt-1 text-muted">{notification.detail}</p>
                </>
              );

              return (
                <li key={notification.id}>
                  {notification.href ? (
                    <Link
                      href={notification.href}
                      className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      <Card
                        interactive
                        className={notification.read ? undefined : "border-brand-border bg-brand-subtle/40"}
                      >
                        {body}
                      </Card>
                    </Link>
                  ) : (
                    <Card
                      className={notification.read ? undefined : "border-brand-border bg-brand-subtle/40"}
                    >
                      {body}
                    </Card>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppPage>
  );
}
