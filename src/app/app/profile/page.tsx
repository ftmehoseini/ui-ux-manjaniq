import * as React from "react";
import { getApi } from "@/lib/api";
import type { Member, Readiness } from "@/lib/types";
import { GOAL_LABELS, HORIZON_LABELS } from "@/lib/taxonomy";
import { AppPage, PageHeader } from "@/components/layout/page-header";
import { Badge, Card } from "@/components/ui/primitives";
import { EmptyState, ErrorState, ReadinessMeter } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";
import { ProvenanceMark } from "@/components/domain/provenance";

export const metadata = { title: "پروفایل" };

export default async function ProfilePage() {
  const api = getApi();
  const [member, readiness] = await Promise.all([
    api.getMember().catch((): null => null),
    api.getReadiness().catch((): null => null),
  ]);

  if (!member) {
    return (
      <AppPage>
        <PageHeader title="پروفایل" />
        <ErrorState
          className="mt-8"
          title="پروفایل بارگذاری نشد"
          description="اگر هنوز پروفایلی نساخته‌ای، از همین‌جا شروع کن."
          action={<ButtonLink href="/app/onboarding">ساخت پروفایل</ButtonLink>}
        />
      </AppPage>
    );
  }

  return (
    <AppPage>
      <PageHeader
        title="پروفایل"
        description="این اطلاعات مبنای ساخت پیشنهادهاست."
        action={<ButtonLink href="/app/onboarding" variant="secondary">ویرایش</ButtonLink>}
      />

      <div className="mt-8 flex flex-col gap-6">
        {readiness && <ReadinessCard readiness={readiness} />}

        <Card padding="lg">
          <h2 className="t-h3 text-ink">معرفی</h2>
          <p className="t-body mt-3 text-ink">{member.headline}</p>
          <p className="t-small mt-2 text-muted">
            {member.role}
            {member.company && ` — ${member.company}`}
            {member.city && `، ${member.city}`}
          </p>
        </Card>

        {/* Needs come before strengths: it is the section that drives match
            quality most, and the one members are likeliest to leave thin. */}
        <Card padding="lg" id="needs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="t-h3 text-ink">الان دنبال چه هستی</h2>
            <ButtonLink href="/app/onboarding" variant="secondary" size="sm">
              افزودن نیاز
            </ButtonLink>
          </div>

          {member.needs.length === 0 ? (
            <EmptyState
              className="mt-4"
              title="هنوز نیازی ثبت نکرده‌ای"
              description="تا وقتی نیازت مشخص نباشد، نمی‌توانیم پیشنهاد مرتبطی برایت بسازیم."
              action={<ButtonLink href="/app/onboarding">ثبت نیاز</ButtonLink>}
            />
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {member.needs.map((need) => (
                <li key={need.id} className="rounded-lg border border-line p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="t-label text-ink">{need.title}</h3>
                    <Badge tone="brand">{GOAL_LABELS[need.kind]}</Badge>
                    <span className="t-caption text-muted">{HORIZON_LABELS[need.horizon]}</span>
                  </div>
                  {need.detail && <p className="t-small mt-1.5 text-muted">{need.detail}</p>}
                  <ProvenanceMark provenance={need.provenance} className="mt-2" />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card padding="lg" id="strengths">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="t-h3 text-ink">در چه چیزی کمک می‌کنی</h2>
            <ButtonLink href="/app/onboarding" variant="secondary" size="sm">
              ویرایش
            </ButtonLink>
          </div>

          {member.strengths.length === 0 ? (
            <EmptyState
              className="mt-4"
              title="هنوز توانمندی‌ای ثبت نکرده‌ای"
              description="پیشنهاد وقتی ساخته می‌شود که تو هم چیزی برای دادن داشته باشی."
              action={<ButtonLink href="/app/onboarding">ثبت توانمندی</ButtonLink>}
            />
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {member.strengths.map((strength) => (
                <li key={strength.id} className="rounded-lg border border-line p-4">
                  <h3 className="t-label text-ink">{strength.title}</h3>
                  {strength.detail && (
                    <p className="t-small mt-1 text-muted">{strength.detail}</p>
                  )}
                  <ProvenanceMark provenance={strength.provenance} className="mt-2" />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <PreferencesCard member={member} />
      </div>
    </AppPage>
  );
}

function ReadinessCard({ readiness }: { readiness: Readiness }) {
  return (
    <Card padding="lg">
      <ReadinessMeter
        score={readiness.score}
        caption={
          readiness.gaps.length === 0
            ? "پروفایلت کامل است."
            : "با تکمیل موارد زیر، پیشنهادهای دقیق‌تری دریافت می‌کنی."
        }
      />
      {readiness.gaps.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {readiness.gaps.map((gap) => (
            <li key={gap.id} className="rounded-lg bg-surface-muted/70 p-3">
              <p className="t-label text-ink">{gap.action}</p>
              <p className="t-caption mt-0.5 text-muted">{gap.effect}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function PreferencesCard({ member }: { member: Member }) {
  const { preferences } = member;
  return (
    <Card padding="lg">
      <h2 className="t-h3 text-ink">ترجیح‌ها</h2>
      <dl className="mt-4 flex flex-col gap-3">
        <div>
          <dt className="t-caption text-muted">حوزه‌ها</dt>
          <dd className="t-small mt-0.5 text-ink">
            {preferences.industries.length > 0 ? preferences.industries.join("، ") : "محدودیتی ندارد"}
          </dd>
        </div>
        <div>
          <dt className="t-caption text-muted">شهرها</dt>
          <dd className="t-small mt-0.5 text-ink">
            {preferences.cities.length > 0 ? preferences.cities.join("، ") : "محدودیتی ندارد"}
          </dd>
        </div>
        <div>
          <dt className="t-caption text-muted">فرصت‌های خارج از نیازهای ثبت‌شده</dt>
          <dd className="t-small mt-0.5 text-ink">
            {preferences.openToDiscovery ? "نمایش داده می‌شود" : "نمایش داده نمی‌شود"}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
