# Manjaniq — Web

Persian-first, RTL frontend for Manjaniq: an opportunity ecosystem that begins
with event-led professional matchmaking.

The product argument, in one line: **the right person, for the right reason, at
the right moment, with a clear next action.**

```bash
npm install
npm run dev        # http://localhost:3000 — runs on sample data, see below
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (`next/core-web-vitals` + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit`, strict |

---

## Starting position

This repository was empty. There was no existing Manjaniq frontend to audit,
no design tokens, no component library, no API contract and no brand assets, so
nothing here replaces prior work — it establishes it. Two consequences worth
knowing before reading the code:

- **The palette is provisional.** It is marked as such at the top of
  `src/app/globals.css`. It is a considered proposal, not the brand of record.
  Replacing the raw values in `:root` and `[data-theme="dark"]` re-themes the
  entire product without touching a component.
- **The logo is a placeholder.** `src/components/layout/logo.tsx` draws a launch
  arc — منجنیق is a catapult — reading `currentColor`. Swapping in the real
  artwork means editing that one file.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 ·
Estedad + Vazirmatn (both SIL OFL, self-hosted) · lucide-react.

`noUncheckedIndexedAccess` is on and `any` is an ESLint error.

---

## Art direction

The reference is a well-made printed programme or a private members' journal —
not a SaaS dashboard. The first pass of this site was a correct design system
that had not been art-directed: every band was the same height, every block was
a bordered white card in a symmetric grid, and it read as generated. What
changed:

**Two typefaces.** Estedad sets headlines, Vazirmatn sets everything read at
length. A second face with more character in its counters and terminals is most
of the difference between a designed page and a templated one, and restricting
it to display sizes keeps the cost to two small files.

**No letter-spacing, anywhere.** Persian is a connected script and tracking
pulls the joins apart. All the editorial contrast comes from scale, weight and
leading instead — which is why the display sizes are genuinely large rather
than politely large.

**Uneven vertical rhythm.** `Section` takes `tight` / `normal` / `tall`. A page
where every band is the same height reads as machine output.

**Grounds, not cards.** Sections alternate warm paper, surface, muted, a
full-bleed deep ink band for the one beat that should land hard, and brand.
Lists sit on hairline rules (`rule-t` / `rule-b`) rather than inside boxes;
where a grid is right, it is a one-pixel gap over a rule colour, not a row of
floating cards.

**A repeating graphic signature.** `TrajectoryArc` — منجنیق is a catapult — sits
behind the mastheads and closes the page, drawing itself once on arrival. One
ownable device is most of the difference between a brand and a theme.

**Paper grain.** A tiny SVG turbulence overlay (`.grain`), hidden from
assistive tech and from print.

**Numbered sections.** Oversized ghosted numerals set in the margin, the way a
printed article marks its parts.

**Honest image plates.** No photography was supplied. Rather than a grey box —
or, worse, stock photos of a "networking event" that never happened —
`PhotoFrame` renders an empty slot as a composed plate with a caption naming
what belongs there, and takes a real `src` with no layout change.

---

## Where the data comes from

Every page reads through one interface, `ManjaniqApi` (`src/lib/api/client.ts`).
No component contains a fetch call or a URL.

| Source | When it is used |
| --- | --- |
| `http` | Default. Talks to `NEXT_PUBLIC_API_BASE_URL`. |
| `sample` | Opt-in via `NEXT_PUBLIC_DATA_SOURCE=sample`, plus a development fallback when no backend is configured. |

A production build with no `NEXT_PUBLIC_API_BASE_URL` gets the HTTP adapter and
therefore honest "not connected" states. It never silently serves sample data,
and whenever sample data *is* active the application shell shows a persistent
banner, so a sample screenshot cannot be mistaken for a real one.

To point the app at a real backend:

```bash
NEXT_PUBLIC_DATA_SOURCE=http
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

The adapter maps interface methods onto REST paths and does nothing else; if
the real API differs, `src/lib/api/http.ts` is the only file that changes.

### Public trust content ships empty

`src/content/proof.ts` holds outcome stories and public metrics, and it is
empty on purpose. Testimonials, participant counts and partner logos are trust
claims — publishing an invented one costs more than showing nothing. Every
component that reads from it renders a deliberate empty state, and the homepage
replaces the usual metrics strip with *what the product counts as success*,
which is true on day one. `OutcomeStory.consented` is typed as literal `true`,
so an unconsented story cannot compile.

---

## Product rules the code enforces

These are in the type system rather than in review comments, because a rule a
reviewer has to remember is a rule that eventually ships broken.

**Inference is never dressed as fact.** Every claim carries a `Provenance` —
`declared` (the member wrote it), `canonical` (normalised onto the taxonomy) or
`inferred` (the engine's reading). `ProvenanceMark` renders it, and `inferred`
is the only variant that gets a colour, so a glance at any screen shows which
parts are Manjaniq's reading. Internal vocabulary never reaches the interface:
members see «گفتهٔ خودش» / «دستهٔ ثبت‌شده» / «برداشت منجنیق».

**A match is mutual by construction.** `Match` requires both `forYou` and
`forThem`, each a `Coverage` pairing a need with the strength that answers it.
There is no way to build a one-sided match, and the card renders both
directions, so a lopsided relationship looks lopsided instead of hiding behind
a score.

**A bare percentage is unrepresentable.** `Relevance` requires a non-optional
`basis`. Where the engine cannot explain a score, callers pass `null` and the UI
says so rather than showing a figure. "۹۲٪ تطابق" alone cannot be rendered.

**Readiness is not form completion.** `Readiness` carries `gaps`, each stating
the action *and* what it changes about match quality. `ReadinessMeter` requires
a caption; the number never appears alone.

**Success is not a contact count.** `ConnectionStage` and `OutcomeKind` model
the funnel the product optimises for — met → following up → next meeting →
opportunity. There is no profile-views or total-connections widget anywhere,
because neither moves a member closer to an opportunity.

**Privacy is a default, not a setting.** Profiles are not publicly browsable.
Event pages publish aggregate `CompositionSlice` figures, never a name list.
`ProfileVisibility` lets a restricted record render as a deliberate limited
state instead of missing data, and round assignments stay hidden until
`roundsPublished`.

---

## Layout of the code

```
src/
  app/
    (site)/          public: home, how-it-works, events, stories, about, privacy, login
    app/             authenticated: dashboard, onboarding, profile, matches,
                     opportunities, events, connections, notifications, settings
    globals.css      design tokens — the single source of colour, type and motion
  components/
    ui/              Button, Field, Card, Badge, Tag, FilterChip, Avatar, Tabs,
                     Dialog, Toast, ConceptPicker, Skeleton, Empty/Error states,
                     ReadinessMeter, SectionHeader
    domain/          MatchCard, WhyThisMatch, ProvenanceMark, OpportunityCard,
                     EventCard, ConnectionCard, NextActionCard, OnboardingFlow
    layout/          site header/footer, app shell, logo
    marketing/       homepage sections, FAQ, event CTA, story card
  content/           Persian copy, seed taxonomy, and the empty proof file
  lib/               types, API adapters, analytics, Persian formatting, taxonomy
```

Presentation, business rules and data access are separated: `lib/` holds no
JSX, `components/` holds no fetch calls, and `content/` holds no logic.

---

## Persian and RTL

RTL is the default, not a mode. `<html lang="fa" dir="rtl">`, logical
properties throughout (`ps-`/`pe-`, `ms-`/`me-`, `start-`/`end-`), and no
physical `left`/`right` in layout code.

- **Directional glyphs are chosen for meaning, not habit.** "Forward" is
  `ArrowLeft`, "back" is `ArrowRight`. The match card's exchange uses a
  *downward* arrow, which means the same thing in either text direction.
- **Tab lists mirror their arrow keys** — under RTL, ArrowLeft advances.
- **Persian digits are the convention** (`faDigits`, `faNumber`, `faPercent`).
  Anything a user must copy verbatim stays Latin and is wrapped in `.latin`.
- **Leading is tuned for Persian**: body copy sits at 1.85–1.9, and no grey body
  text falls below `0.875rem`.

## Accessibility

Targeting WCAG AA, verified in a browser rather than asserted:

- All text meets 4.5:1 (large text 3:1) on background, surface and muted
  surfaces, in both themes. The tertiary text token was darkened from `#838d99`
  to `#646d79` after measurement — it had been failing at 3.2–3.4:1.
- Interactive targets meet the 24×24 minimum; primary actions are 44px.
- One `h1` per page, no skipped heading levels.
- The dialog moves focus in, traps it, closes on Escape and restores focus to
  the trigger. The settings switch is a real checkbox styled by its label.
- Every input is labelled through `Field`, which wires `aria-describedby` for
  hints and errors.
- `prefers-reduced-motion` disables all animation.

Checked at 390 / 768 / 1024 / 1440 with no horizontal overflow on any route.

## Analytics

`src/lib/analytics.ts` defines the product's events as a closed union — typed,
greppable call sites, no vendor bundled. Attach a destination at runtime by
assigning `window.manjaniqAnalytics`; until then events are dropped in
production and logged in development.

## Not wired up

Deliberately left visible rather than faked, each with a single obvious place
to attach the real call:

- Sign-in (`login-form.tsx`) validates input and says the service is not
  connected.
- Settings toggles say plainly that changes are not saved yet.
- Introduction requests and outcome recording update local state and confirm
  via toast; they do not persist.
