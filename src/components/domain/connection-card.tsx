"use client";

import * as React from "react";
import { CalendarPlus, Clock, MessageSquareReply } from "lucide-react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { faRelative } from "@/lib/format";
import { OUTCOME_LABELS, STAGE_LABELS } from "@/lib/taxonomy";
import type { Connection, ConnectionStage, OutcomeKind } from "@/lib/types";
import { Badge, Card, type BadgeTone } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { PersonHeader } from "./person";

const STAGE_TONES: Record<ConnectionStage, BadgeTone> = {
  met: "neutral",
  following_up: "info",
  meeting_scheduled: "brand",
  opportunity: "success",
  closed: "neutral",
};

/** The outcomes a member can record, in the order they are usually reached. */
const OUTCOME_CHOICES: readonly OutcomeKind[] = [
  "next_meeting",
  "following_up",
  "introduction_made",
  "collaboration",
  "customer",
  "investment",
  "not_relevant",
];

/**
 * A connection, with the outcome recorder attached.
 *
 * Recording what came of a conversation is the single most valuable thing a
 * member can do for their own future matches, and the least likely thing they
 * will remember to do — so the action lives on the card itself rather than
 * behind a detail page. "ارتباط مفید نبود" is offered as a first-class choice:
 * a member who cannot record a negative outcome will record nothing at all,
 * and the product learns more from an honest no than from silence.
 */
export function ConnectionCard({
  connection,
  className,
}: {
  connection: Connection;
  className?: string;
}) {
  const [recording, setRecording] = React.useState(false);
  const [choice, setChoice] = React.useState<OutcomeKind | null>(null);
  const [note, setNote] = React.useState("");
  const toast = useToast();

  const overdue =
    connection.followUpDueAt !== undefined &&
    new Date(connection.followUpDueAt).getTime() < Date.now();

  const latest = connection.outcomes.at(-1);

  function submit() {
    if (!choice) return;
    track({ name: "followup_recorded", connectionId: connection.id, outcome: choice });
    if (choice === "next_meeting") {
      track({ name: "next_meeting_recorded", connectionId: connection.id });
    }
    setRecording(false);
    setChoice(null);
    setNote("");
    toast.show("نتیجه ثبت شد. پیشنهادهای بعدی‌ات با همین اطلاعات دقیق‌تر می‌شوند.");
  }

  return (
    <Card padding="lg" className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PersonHeader person={connection.person} size="sm" className="min-w-0 flex-1" />
        <Badge tone={STAGE_TONES[connection.stage]}>{STAGE_LABELS[connection.stage]}</Badge>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="t-caption text-muted">آشنا شده در {connection.origin}</p>
        {latest && (
          <p className="t-small text-muted">
            آخرین ثبت: <span className="text-ink">{OUTCOME_LABELS[latest.kind]}</span>
            {latest.note && ` — ${latest.note}`}
          </p>
        )}
      </div>

      {connection.followUpDueAt && connection.stage !== "closed" && (
        <p
          className={cn(
            "t-caption inline-flex items-center gap-1.5",
            overdue ? "text-warning" : "text-muted",
          )}
        >
          <Clock className="size-3.5" aria-hidden />
          {overdue
            ? `موعد پیگیری ${faRelative(connection.followUpDueAt)} گذشته است`
            : `موعد پیگیری ${faRelative(connection.followUpDueAt)}`}
        </p>
      )}

      <div className="flex flex-wrap gap-2 border-t border-line pt-4">
        <Button size="sm" onClick={() => setRecording(true)}>
          <MessageSquareReply className="size-4" aria-hidden />
          ثبت نتیجه
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setChoice("next_meeting");
            setRecording(true);
          }}
        >
          <CalendarPlus className="size-4" aria-hidden />
          جلسهٔ بعدی می‌گذارم
        </Button>
      </div>

      <Dialog
        open={recording}
        onClose={() => setRecording(false)}
        title={`نتیجهٔ گفت‌وگو با ${connection.person.name}`}
        description="این را فقط خودت می‌بینی. برای بهتر شدن پیشنهادهای بعدی‌ات استفاده می‌شود."
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setRecording(false)}>
              انصراف
            </Button>
            <Button size="md" onClick={submit} disabled={!choice}>
              ثبت نتیجه
            </Button>
          </>
        }
      >
        <fieldset className="flex flex-col gap-3">
          <legend className="t-label mb-2 text-ink">چه اتفاقی افتاد؟</legend>
          <div className="flex flex-col gap-2">
            {OUTCOME_CHOICES.map((kind) => (
              <label
                key={kind}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 transition-colors",
                  choice === kind
                    ? "border-brand bg-brand-subtle"
                    : "border-line hover:bg-surface-muted",
                )}
              >
                <input
                  type="radio"
                  name={`outcome-${connection.id}`}
                  value={kind}
                  checked={choice === kind}
                  onChange={() => setChoice(kind)}
                  className="size-4 accent-[var(--mj-brand)]"
                />
                <span className="t-small text-ink">{OUTCOME_LABELS[kind]}</span>
              </label>
            ))}
          </div>

          <label htmlFor={`note-${connection.id}`} className="t-label mt-2 text-ink">
            یادداشت
            <span className="t-caption text-faint"> — اختیاری</span>
          </label>
          <Textarea
            id={`note-${connection.id}`}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="قرار بعدی، چیزی که باید بفرستی، یا هر نکته‌ای که بعداً لازم می‌شود."
            rows={3}
          />
        </fieldset>
      </Dialog>
    </Card>
  );
}
