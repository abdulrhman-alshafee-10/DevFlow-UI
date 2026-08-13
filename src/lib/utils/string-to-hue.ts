/**
 * Map an arbitrary string to a deterministic Tailwind background hue.
 *
 * Used by the Avatar fallback so the same `name` always produces the
 * same accent color, without any runtime randomness or I/O.
 *
 * Pure: does not mutate `name`. Deterministic across processes and
 * runs (no `Math.random`, no timers, no external state).
 */

/**
 * Palette of Tailwind `bg-*` classes used for Avatar / chip accents.
 *
 * Exported so tests, the `<Avatar />` component, and any consumer can
 * assert palette membership against a single source of truth.
 */
export const AVATAR_HUE_PALETTE = [
  'bg-rose-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-violet-500',
  'bg-fuchsia-500',
  'bg-teal-500',
  'bg-indigo-500',
] as const;

/** The element type of the palette. */
export type AvatarHueClass = (typeof AVATAR_HUE_PALETTE)[number];

/**
 * DJB2 seed value (Dan Bernstein's classic non-cryptographic hash).
 * Chosen because empty-string input still produces a well-defined,
 * non-zero hash and therefore a well-defined palette index.
 */
const DJB2_SEED = 5381;

/**
 * DJB2 hash coerced to a non-negative 32-bit integer. The `>>> 0` at
 * each step keeps `hash` in `Uint32` range and side-steps the
 * unsigned-vs-signed pitfalls that come with `<<`.
 */
function djb2(input: string): number {
  let hash = DJB2_SEED;
  for (let i = 0; i < input.length; i += 1) {
    // hash * 33 + charCode, using bit tricks the same way DJB2 does.
    hash = ((hash << 5) + hash + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Return the Tailwind background class assigned to `name`.
 *
 * Case-sensitive by design: `stringToHueClass('Ada')` and
 * `stringToHueClass('ada')` may produce different classes. Empty
 * string is a legal input and returns a well-defined palette entry
 * (the DJB2 hash of the empty string is the seed value itself).
 */
export function stringToHueClass(name: string): AvatarHueClass {
  const index = djb2(name) % AVATAR_HUE_PALETTE.length;
  // Guaranteed in-bounds: `index` is in [0, palette.length).
  return AVATAR_HUE_PALETTE[index] as AvatarHueClass;
}
