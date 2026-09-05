"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";

interface Setting {
  id: string;
  label: string;
  /** States the consequence, not the mechanism. */
  detail: string;
  defaultValue: boolean;
}

const VISIBILITY: readonly Setting[] = [
  {
    id: "profile-in-matches",
    label: "پروفایلم در پیشنهادهای دیگران نمایش داده شود",
    detail:
      "با خاموش‌کردن این گزینه، دیگر به کسی پیشنهاد نمی‌شوی و پیشنهادی هم برای تو ساخته نمی‌شود.",
    defaultValue: true,
  },
  {
    id: "show-company",
    label: "نام شرکتم پیش از پذیرش معرفی دیده شود",
    detail: "اگر خاموش باشد، طرف مقابل تا زمان پذیرش معرفی فقط سمت تو را می‌بیند.",
    defaultValue: true,
  },
  {
    id: "needs-visible",
    label: "نیازهایم در توضیح پیشنهاد به طرف مقابل نشان داده شود",
    detail:
      "این همان چیزی است که به طرف مقابل می‌گوید چرا گفت‌وگو با تو ارزش دارد. خاموش‌کردنش کیفیت پیشنهادها را کم می‌کند.",
    defaultValue: true,
  },
];

const NOTIFICATIONS: readonly Setting[] = [
  {
    id: "notify-matches",
    label: "پیشنهاد تازه",
    detail: "وقتی پیشنهاد مرتبطی برایت ساخته شد.",
    defaultValue: true,
  },
  {
    id: "notify-intro",
    label: "پاسخ به درخواست معرفی",
    detail: "وقتی طرف مقابل معرفی را پذیرفت یا رد کرد.",
    defaultValue: true,
  },
  {
    id: "notify-followup",
    label: "یادآوری پیگیری",
    detail: "وقتی موعد پیگیری یک ارتباط رسید.",
    defaultValue: true,
  },
];

export function SettingsPanels() {
  return (
    <div className="mt-8 flex flex-col gap-6">
      <SettingsGroup
        title="نمایش و حریم خصوصی"
        description="پروفایل‌های منجنیق به‌صورت عمومی قابل مرور نیستند. این گزینه‌ها تعیین می‌کند طرف مقابل پیش از پذیرش معرفی چه می‌بیند."
        settings={VISIBILITY}
      />
      <SettingsGroup title="اعلان‌ها" settings={NOTIFICATIONS} />
    </div>
  );
}

function SettingsGroup({
  title,
  description,
  settings,
}: {
  title: string;
  description?: string;
  settings: readonly Setting[];
}) {
  return (
    <Card padding="lg">
      <h2 className="t-h3 text-ink">{title}</h2>
      {description && <p className="t-small mt-1.5 text-muted">{description}</p>}
      <ul className="mt-4 flex flex-col gap-2">
        {settings.map((setting) => (
          <li key={setting.id}>
            <SettingToggle setting={setting} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

/**
 * A switch built on a real checkbox.
 *
 * The visual switch is the label's styling, so keyboard focus, activation and
 * screen-reader state all come from the native control rather than being
 * reconstructed with ARIA.
 */
function SettingToggle({ setting }: { setting: Setting }) {
  const [on, setOn] = React.useState(setting.defaultValue);
  const toast = useToast();

  return (
    <label
      htmlFor={setting.id}
      className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-line p-4 transition-colors hover:bg-surface-muted"
    >
      <span className="min-w-0">
        <span className="t-label block text-ink">{setting.label}</span>
        <span className="t-caption mt-0.5 block text-muted">{setting.detail}</span>
      </span>

      <span className="relative mt-0.5 shrink-0">
        <input
          id={setting.id}
          type="checkbox"
          checked={on}
          onChange={(event) => {
            setOn(event.target.checked);
            // TODO: persist through the settings endpoint once it exists.
            toast.show("تغییر در این نسخه ذخیره نمی‌شود؛ هنوز به سرور وصل نیست.", "info");
          }}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={cn(
            "block h-6 w-11 rounded-full transition-colors",
            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
            on ? "bg-brand" : "bg-line-strong",
          )}
        />
        <span
          aria-hidden
          className={cn(
            "absolute top-1 size-4 rounded-full bg-surface transition-[inset-inline-start] duration-200 motion-reduce:transition-none",
            // ON sits at the far (end) edge of the track, which under RTL is the
            // left side — logical properties keep that correct in both directions.
            on ? "start-6" : "start-1",
          )}
        />
      </span>
    </label>
  );
}
