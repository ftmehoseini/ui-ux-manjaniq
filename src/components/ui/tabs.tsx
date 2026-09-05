"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface TabItem {
  id: string;
  label: string;
  /** Optional count badge, e.g. number of new matches. */
  count?: number;
}

export interface TabsProps {
  items: readonly TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  "aria-label": string;
}

/**
 * Tab list with roving focus and arrow-key navigation.
 *
 * Arrow keys are mirrored under RTL: ArrowLeft advances, ArrowRight retreats,
 * matching where the next tab actually sits on screen.
 */
export function Tabs({ items, value, onChange, className, ...rest }: TabsProps) {
  const listRef = React.useRef<HTMLDivElement>(null);

  function focusTab(index: number) {
    const bounded = (index + items.length) % items.length;
    const target = items[bounded];
    if (!target) return;
    onChange(target.id);
    listRef.current
      ?.querySelector<HTMLButtonElement>(`[data-tab-id="${CSS.escape(target.id)}"]`)
      ?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const index = items.findIndex((item) => item.id === value);
    if (index < 0) return;

    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const backward = rtl ? "ArrowRight" : "ArrowLeft";

    switch (event.key) {
      case forward:
        event.preventDefault();
        focusTab(index + 1);
        break;
      case backward:
        event.preventDefault();
        focusTab(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(items.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={rest["aria-label"]}
      onKeyDown={onKeyDown}
      className={cn(
        "no-scrollbar flex gap-1 overflow-x-auto border-b border-line",
        className,
      )}
    >
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            data-tab-id={item.id}
            aria-selected={selected}
            aria-controls={`panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={cn(
              "relative shrink-0 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus",
              selected ? "text-brand" : "text-muted hover:text-ink",
            )}
          >
            {item.label}
            {typeof item.count === "number" && item.count > 0 && (
              <span
                className={cn(
                  "ms-2 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[0.6875rem] leading-5",
                  selected ? "bg-brand text-on-brand" : "bg-surface-muted text-muted",
                )}
              >
                {item.count.toLocaleString("fa-IR")}
              </span>
            )}
            {selected && (
              <span
                aria-hidden
                className="absolute inset-x-2 -bottom-px block h-0.5 rounded-full bg-brand"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({
  id,
  active,
  children,
}: {
  id: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      hidden={!active}
      tabIndex={0}
      className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      {active && children}
    </div>
  );
}
