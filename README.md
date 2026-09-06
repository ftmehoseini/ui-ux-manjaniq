# Telsi Talk — Registration

Persian-first, RTL registration flow for a Telsi Talk event: a darkened
auditorium, one lit card, and a single action.

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

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 ·
Estedad + Vazirmatn (both SIL OFL, self-hosted) · lucide-react.
`noUncheckedIndexedAccess` is on and `any` is an ESLint error.

---

## Two screens, one component

The form and the confirmation are two branches of `RegistrationPanel`.
`RegistrationStage` above it holds the only state machine in the flow:

```
form → (validation) → form            invalid input never leaves the client
form → submitting → success           a receipt came back
form → submitting → error → form      the submission failed; nothing typed is lost
```

The green check exists only inside the success branch. There is no prop that
renders it on a form that has not been submitted, and a failed request renders
an error message rather than a confirmation.

**Everything on the confirmation is server truth.** The name, the ticket count
and the door time come from the `EventRegistrationReceipt` the API returned —
not from the form that was just filled in — so the screen cannot claim a
registration the backend did not make.

The gold masthead over the banner appears with the confirmation, where the
card's own heading has become the visitor's name and something still has to say
which event was registered for. The artwork sets it in the left corner, which
under `dir="rtl"` is the trailing edge; it is set at the leading one instead.

## Where the data comes from

Everything reads through one interface, `EventApi` (`src/lib/api/client.ts`).
No component contains a fetch call or a URL.

| Source | When it is used |
| --- | --- |
| `http` | Default. Talks to `NEXT_PUBLIC_API_BASE_URL`. |
| `sample` | Opt-in via `NEXT_PUBLIC_DATA_SOURCE=sample`, plus a development fallback when no backend is configured. |

A production build with no `NEXT_PUBLIC_API_BASE_URL` gets the HTTP adapter and
therefore honest "not connected" states. It never silently serves sample data,
and whenever sample data *is* active the stage shows a visible marker, so a
sample screenshot cannot be mistaken for a real registration.

### The two calls

```
GET  /events/{slug}                    → EventDetail
POST /events/{slug}/registrations      → EventRegistrationReceipt
     { fullName, phone, quantity }
```

`src/lib/types.ts` is the contract. Status codes are translated into Persian a
visitor can act on (409 → «ظرفیت همین حالا تکمیل شد»), never shown raw. If the
real API differs, `src/lib/api/http.ts` is the only file that changes.

## Event data

Title, edition marker, banner, backdrop, price, date, venue, start time and
arrival deadline all come from `EventDetail`; `toRegistrationEvent` formats them
once on the server. Anything the organiser has not published — a banner, a
price, a door time — is omitted rather than invented.

Event clock labels are pinned to `Asia/Tehran` (`faEventTime`, `faEventDate`):
a door time has to mean 9:15 at the venue, not 9:15 wherever the page is opened.

`/` registers people for `NEXT_PUBLIC_EVENT_SLUG`; any event is also reachable
at `/events/<slug>/register`.

## No photography ships here

The background is composed in CSS — navy ground, lighting rig, centre glow,
vignette — and swaps for a real image the moment `event.coverUrl` is set. The
banner is a real slot that takes `event.bannerUrl` and renders a dashed plate
until one exists. Nothing about the interface is baked into an image.

## Persian and RTL

RTL is the default, not a mode. `<html lang="fa" dir="rtl">`, logical properties
throughout (`ps-`/`pe-`, `ms-`/`me-`, `start-`/`end-`), and no physical
`left`/`right` in layout code.

- **Persian digits are the convention** (`faDigits`, `faNumber`, `faPrice`), and
  what a visitor types is normalised back to ASCII before validation
  (`latinDigits`), so ۰۹۱۲… and 0912… are the same number.
- **"Forward" is `ArrowLeft`.** Directional glyphs are chosen for meaning.
- **No letter-spacing anywhere.** Persian is a connected script and tracking
  pulls the joins apart; contrast comes from scale, weight and leading.

## Accessibility

- Every input is labelled, with `aria-describedby` wired to its hint or error.
  An invalid field is marked three ways: `aria-invalid`, a message, and colour —
  never colour alone.
- One `h1` per state. On the confirmation it is the visitor's name, and focus
  moves to it when the card swaps without a navigation.
- Submitting, failed and confirmed are announced through one `role="status"`
  region.
- The CTA's focus ring is dark green, not white: on the white card a white ring
  is invisible.
- Controls are 52–56px tall, comfortably over the 44px touch target.
- `prefers-reduced-motion` disables all animation; the success check then
  arrives already drawn and its halo is not rendered.

Checked at 390 / 820 / 1440 with no horizontal overflow.

## Design tokens

`src/app/globals.css` is the single source of colour, shape and motion.
Two values deliberately depart from the source artwork, both measured: the CTA
green darkens through its gradient (white on flat `#00c83b` measures 2.3:1), and
gold has a second, darker value (`--ev-gold-ink`) for the places gold sets text
on white.
