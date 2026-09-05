"use client";

import * as React from "react";
import type { Connection } from "@/lib/types";
import { SectionHeader } from "@/components/ui/primitives";
import { ConnectionCard } from "./connection-card";

/**
 * Splits connections into what needs attention now and everything else.
 * A single undifferentiated list would bury the overdue follow-ups, which are
 * the only items on this page with a deadline.
 */
export function ConnectionList({ connections }: { connections: readonly Connection[] }) {
  const now = Date.now();

  const { waiting, rest } = React.useMemo(() => {
    const waiting: Connection[] = [];
    const rest: Connection[] = [];
    for (const connection of connections) {
      const due =
        connection.stage !== "closed" &&
        connection.followUpDueAt !== undefined &&
        new Date(connection.followUpDueAt).getTime() <= now;
      (due ? waiting : rest).push(connection);
    }
    return { waiting, rest };
  }, [connections, now]);

  return (
    <div className="flex flex-col gap-8">
      {waiting.length > 0 && (
        <section aria-labelledby="waiting-heading">
          <SectionHeader
            as="h2"
            title="منتظر اقدام تو"
            description="این‌ها موعد پیگیری‌شان رسیده است."
          />
          <ul className="mt-5 flex flex-col gap-4">
            {waiting.map((connection) => (
              <li key={connection.id}>
                <ConnectionCard connection={connection} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {rest.length > 0 && (
        <section aria-labelledby="all-heading">
          <SectionHeader as="h2" title={waiting.length > 0 ? "بقیهٔ ارتباط‌ها" : "ارتباط‌ها"} />
          <ul className="mt-5 flex flex-col gap-4">
            {rest.map((connection) => (
              <li key={connection.id}>
                <ConnectionCard connection={connection} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
