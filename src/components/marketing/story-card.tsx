import * as React from "react";
import { Quote } from "lucide-react";
import { OUTCOME_LABELS } from "@/lib/taxonomy";
import type { OutcomeStory } from "@/lib/types";
import { Badge, Card } from "@/components/ui/primitives";

/**
 * A published outcome story. Renders only what was actually supplied — an
 * absent quote or attribution leaves the space empty rather than filling it
 * with a stand-in.
 */
export function OutcomeStoryCard({ story }: { story: OutcomeStory }) {
  return (
    <Card className="flex h-full flex-col gap-3">
      <Badge tone="success">{OUTCOME_LABELS[story.outcome]}</Badge>
      <p className="t-body text-ink">{story.summary}</p>
      {story.quote && (
        <blockquote className="t-small flex gap-2 border-s-2 border-brand-border ps-3 text-muted">
          <Quote className="mt-1 size-3.5 shrink-0 text-faint" aria-hidden />
          <span>{story.quote}</span>
        </blockquote>
      )}
      <div className="mt-auto pt-2">
        {story.attribution && <p className="t-caption text-muted">{story.attribution}</p>}
        {story.eventTitle && <p className="t-caption text-faint">{story.eventTitle}</p>}
      </div>
    </Card>
  );
}
