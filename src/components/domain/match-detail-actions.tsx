"use client";

import * as React from "react";
import { Handshake } from "lucide-react";
import { track } from "@/lib/analytics";
import type { Match } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/primitives";
import { Dialog } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";

/**
 * The introduction request.
 *
 * Asking for a reason is not friction for its own sake: the note is what the
 * other person sees first, and a request that arrives with a stated purpose is
 * the difference between an introduction and a cold approach. It stays
 * optional, because a member who cannot phrase it should still be able to ask.
 */
export function MatchDetailActions({ match }: { match: Match }) {
  const [open, setOpen] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [requested, setRequested] = React.useState(
    match.status === "intro_requested" || match.status === "intro_accepted",
  );
  const toast = useToast();

  function submit() {
    track({ name: "introduction_requested", matchId: match.id });
    setRequested(true);
    setOpen(false);
    toast.show(`درخواست معرفی به ${match.person.name} ثبت شد.`);
  }

  return (
    <>
      <Card padding="lg" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="t-h3 text-ink">
            {requested ? "درخواست معرفی ثبت شده است" : "قدم بعدی"}
          </h2>
          <p className="t-small mt-1 text-muted">
            {requested
              ? "وقتی طرف مقابل معرفی را بپذیرد، راه ارتباطی برای هر دو نمایش داده می‌شود."
              : "با درخواست معرفی، دلیل این پیشنهاد برای طرف مقابل هم نمایش داده می‌شود."}
          </p>
        </div>
        <Button size="lg" disabled={requested} onClick={() => setOpen(true)} className="shrink-0">
          <Handshake className="size-4" aria-hidden />
          {requested ? "در انتظار پاسخ" : "درخواست معرفی"}
        </Button>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={`درخواست معرفی به ${match.person.name}`}
        description="یک جملهٔ کوتاه بنویس که چرا می‌خواهی صحبت کنی. همین را طرف مقابل می‌بیند."
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setOpen(false)}>
              انصراف
            </Button>
            <Button size="md" onClick={submit}>
              ثبت درخواست
            </Button>
          </>
        }
      >
        <label htmlFor="intro-note" className="t-label text-ink">
          دلیل درخواست
          <span className="t-caption text-faint"> — اختیاری</span>
        </label>
        <Textarea
          id="intro-note"
          className="mt-2"
          rows={4}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={`مثلاً: ${match.forYou.need.title} — دیدم که ${match.forYou.strength.title}.`}
        />
        <p className="t-caption mt-3 text-muted">
          راه ارتباطی هیچ‌کدام از شما تا پیش از پذیرش دو طرف نمایش داده نمی‌شود.
        </p>
      </Dialog>
    </>
  );
}
