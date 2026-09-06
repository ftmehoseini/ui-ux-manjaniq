/** Joins class names, dropping falsy entries. Deliberately tiny — the project
 *  does not need a class-merging dependency for this. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
