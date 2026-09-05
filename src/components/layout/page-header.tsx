import * as React from "react";
import { cn } from "@/lib/cn";

/** Standard heading block for authenticated pages. */
export function PageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="max-w-prose">
        <h1 className="t-h1 text-ink">{title}</h1>
        {description && <p className="t-body mt-2 text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Consistent gutters and max width for every authenticated page. */
export function AppPage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10", className)}>
      {children}
    </div>
  );
}
