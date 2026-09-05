import * as React from "react";
import { BadgeCheck, Building2, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { faDigits } from "@/lib/format";
import type { Person } from "@/lib/types";
import { Avatar, Badge } from "@/components/ui/primitives";

/**
 * Identity block shared by match cards, the match brief and connection rows.
 * There is one of these rather than three near-identical headers, so a change
 * to how a person is presented lands everywhere.
 */
export function PersonHeader({
  person,
  size = "md",
  as: Heading = "h3",
  className,
}: {
  person: Person;
  size?: "sm" | "md" | "lg";
  /** The person's name is the heading here, so the level belongs to the page
   *  that owns the document outline, not to this component. */
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const limited = person.visibility === "limited";

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <Avatar name={person.name} src={person.avatarUrl} size={size === "lg" ? "lg" : "md"} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Heading
            className={cn(
              "font-semibold text-ink",
              size === "lg" ? "t-h1" : size === "md" ? "t-h3" : "text-sm",
            )}
          >
            {person.name}
          </Heading>
          {person.verification.identity && (
            <span
              className="inline-flex items-center gap-1 text-[0.6875rem] text-success"
              title="هویت این عضو بررسی شده است."
            >
              <BadgeCheck className="size-3.5" aria-hidden />
              هویت بررسی‌شده
            </span>
          )}
        </div>

        <p className="t-small mt-0.5 text-muted">
          {person.role}
          {person.company && (
            <>
              {" — "}
              <span className="text-ink">{person.company}</span>
            </>
          )}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          {person.industry && (
            <span className="t-caption inline-flex items-center gap-1 text-muted">
              <Building2 className="size-3.5 text-faint" aria-hidden />
              {person.industry}
            </span>
          )}
          {person.city && (
            <span className="t-caption inline-flex items-center gap-1 text-muted">
              <MapPin className="size-3.5 text-faint" aria-hidden />
              {person.city}
            </span>
          )}
          {person.verification.attendedEvents > 0 && (
            <span className="t-caption text-muted">
              {faDigits(person.verification.attendedEvents)} رویداد منجنیق
            </span>
          )}
        </div>

        {limited && (
          <Badge tone="neutral" className="mt-2">
            بخشی از پروفایل تا زمان پذیرش معرفی خصوصی است
          </Badge>
        )}
      </div>
    </div>
  );
}
