import * as React from "react";

/**
 * The event stage.
 *
 * Registration is the one screen in the product that deliberately drops the
 * site chrome: no header, no footer, nothing competing with the single action
 * on it. That is why it is its own route group rather than a page inside
 * `(site)` — the marketing shell is not a layout it wants.
 */
export default function EventStageLayout({ children }: { children: React.ReactNode }) {
  return <main id="main">{children}</main>;
}
