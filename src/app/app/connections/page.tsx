import * as React from "react";
import { Handshake } from "lucide-react";
import { getApi } from "@/lib/api";
import type { Connection } from "@/lib/types";
import { AppPage, PageHeader } from "@/components/layout/page-header";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";
import { ConnectionList } from "@/components/domain/connection-list";

export const metadata = { title: "ارتباط‌ها" };

/**
 * The follow-up surface — where a conversation becomes an outcome.
 *
 * Connections that are waiting on the member are separated out and put first,
 * because the whole value of this page is catching the ones about to be
 * forgotten.
 */
export default async function ConnectionsPage() {
  let connections: readonly Connection[] | null = null;
  try {
    connections = await getApi().listConnections();
  } catch {
    connections = null;
  }

  return (
    <AppPage>
      <PageHeader
        title="ارتباط‌ها"
        description="گفت‌وگویی که پیگیری نشود، همان‌جا تمام می‌شود. نتیجهٔ هر ارتباط را همین‌جا ثبت کن."
      />

      <div className="mt-8">
        {connections === null ? (
          <ErrorState description="ارتباط‌ها بارگذاری نشد. چند لحظه بعد دوباره تلاش کن." />
        ) : connections.length === 0 ? (
          <EmptyState
            icon={<Handshake className="size-8" aria-hidden />}
            title="هنوز ارتباطی ثبت نشده"
            description="بعد از اولین گفت‌وگو — چه در رویداد و چه از طریق معرفی — طرف مقابل همین‌جا نمایش داده می‌شود و می‌توانی نتیجه را ثبت کنی."
            action={<ButtonLink href="/app/matches">دیدن پیشنهادها</ButtonLink>}
          />
        ) : (
          <ConnectionList connections={connections} />
        )}
      </div>
    </AppPage>
  );
}
