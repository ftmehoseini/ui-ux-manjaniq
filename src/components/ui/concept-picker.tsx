"use client";

import * as React from "react";
import { Check, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Input } from "./field";

export interface ConceptOption {
  id: string;
  label: string;
  /** Grouping label, e.g. «فروش و بازار». */
  group?: string;
}

export interface ConceptPickerProps {
  id: string;
  options: readonly ConceptOption[];
  selected: readonly string[];
  onChange: (ids: readonly string[]) => void;
  /** Free text the member typed that is not in the taxonomy yet. */
  custom?: readonly string[];
  onCustomChange?: (values: readonly string[]) => void;
  placeholder?: string;
  max?: number;
  describedBy?: string;
}

/**
 * Searchable multi-select over the concept taxonomy, with an escape hatch for
 * wording the taxonomy does not cover yet.
 *
 * Structured selection is what makes a profile matchable, so the taxonomy is
 * the primary path and free text is secondary — but free text is offered
 * rather than lost, because a member who cannot say the true thing will
 * usually say a worse approximation instead.
 *
 * Implemented as a listbox with `aria-multiselectable`; results are announced
 * through a live region as the query narrows.
 */
export function ConceptPicker({
  id,
  options,
  selected,
  onChange,
  custom = [],
  onCustomChange,
  placeholder = "جست‌وجو کن یا بنویس…",
  max,
  describedBy,
}: ConceptPickerProps) {
  const [query, setQuery] = React.useState("");
  const listId = `${id}-list`;

  const normalised = query.trim().toLowerCase();
  const results = React.useMemo(
    () =>
      normalised.length === 0
        ? options
        : options.filter((option) => option.label.toLowerCase().includes(normalised)),
    [options, normalised],
  );

  const atLimit = typeof max === "number" && selected.length + custom.length >= max;
  const exactExists =
    results.some((option) => option.label.toLowerCase() === normalised) ||
    custom.some((value) => value.toLowerCase() === normalised);
  const canAddCustom = Boolean(onCustomChange) && normalised.length > 1 && !exactExists && !atLimit;

  function toggle(optionId: string) {
    if (selected.includes(optionId)) {
      onChange(selected.filter((value) => value !== optionId));
    } else if (!atLimit) {
      onChange([...selected, optionId]);
    }
  }

  function addCustom() {
    const value = query.trim();
    if (!value || !onCustomChange) return;
    onCustomChange([...custom, value]);
    setQuery("");
  }

  const chosen = options.filter((option) => selected.includes(option.id));

  return (
    <div className="flex flex-col gap-3">
      {(chosen.length > 0 || custom.length > 0) && (
        <ul className="flex flex-wrap gap-2" aria-label="موارد انتخاب‌شده">
          {chosen.map((option) => (
            <li key={option.id}>
              <SelectedChip label={option.label} onRemove={() => toggle(option.id)} />
            </li>
          ))}
          {custom.map((value) => (
            <li key={value}>
              <SelectedChip
                label={value}
                hint="نوشتهٔ خودت"
                onRemove={() => onCustomChange?.(custom.filter((item) => item !== value))}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="relative">
        <Search
          className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-faint"
          aria-hidden
        />
        <Input
          id={id}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-describedby={describedBy}
          autoComplete="off"
          value={query}
          placeholder={placeholder}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && canAddCustom) {
              event.preventDefault();
              addCustom();
            }
          }}
          className="ps-9"
        />
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {`${results.length.toLocaleString("fa-IR")} گزینه`}
      </p>

      {canAddCustom && (
        <button
          type="button"
          onClick={addCustom}
          className="flex items-center gap-2 rounded-md border border-dashed border-line-strong px-3 py-2 text-start text-sm text-ink transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <Plus className="size-4 text-brand" aria-hidden />
          <span>
            «{query.trim()}» را به‌عنوان مورد خودت اضافه کن
          </span>
        </button>
      )}

      <ul
        id={listId}
        role="listbox"
        aria-multiselectable
        aria-label="گزینه‌ها"
        className="max-h-64 overflow-y-auto rounded-md border border-line bg-surface"
      >
        {results.length === 0 && (
          <li className="t-small px-3 py-6 text-center text-muted">
            چیزی با این عبارت پیدا نشد. می‌توانی همان را با دکمهٔ بالا به‌صورت دلخواه اضافه کنی.
          </li>
        )}
        {results.map((option) => {
          const isSelected = selected.includes(option.id);
          const disabled = atLimit && !isSelected;
          return (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={disabled}
                onClick={() => toggle(option.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-start text-sm transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus",
                  disabled ? "cursor-not-allowed text-faint" : "text-ink hover:bg-surface-muted",
                  isSelected && "bg-brand-subtle",
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate">{option.label}</span>
                  {option.group && (
                    <span className="t-caption block text-faint">{option.group}</span>
                  )}
                </span>
                {isSelected && <Check className="size-4 shrink-0 text-brand" aria-hidden />}
              </button>
            </li>
          );
        })}
      </ul>

      {atLimit && (
        <p className="t-caption text-muted">
          به سقف انتخاب رسیدی. برای اضافه‌کردن مورد تازه، یکی را بردار.
        </p>
      )}
    </div>
  );
}

function SelectedChip({
  label,
  hint,
  onRemove,
}: {
  label: string;
  hint?: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-brand-border bg-brand-subtle py-1 pe-1 ps-2.5 text-[0.8125rem] text-brand">
      {label}
      {hint && <span className="text-[0.6875rem] text-muted">({hint})</span>}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`حذف ${label}`}
        className="rounded p-0.5 transition-colors hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
      >
        <X className="size-3.5" aria-hidden />
      </button>
    </span>
  );
}
