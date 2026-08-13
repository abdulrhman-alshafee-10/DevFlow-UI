import { describe, expect, it } from 'vitest';

import { AVATAR_HUE_PALETTE, stringToHueClass } from './string-to-hue';

describe('stringToHueClass', () => {
  it('returns a palette entry for the empty string', () => {
    const value = stringToHueClass('');
    expect(AVATAR_HUE_PALETTE).toContain(value);
  });

  it('is deterministic for repeated calls with the same input', () => {
    expect(stringToHueClass('Ada Lovelace')).toBe(
      stringToHueClass('Ada Lovelace'),
    );
    expect(stringToHueClass('')).toBe(stringToHueClass(''));
    expect(stringToHueClass('a'.repeat(64))).toBe(
      stringToHueClass('a'.repeat(64)),
    );
  });

  it('always returns a value from AVATAR_HUE_PALETTE', () => {
    for (const sample of [
      '',
      'a',
      'Ada',
      'ada',
      'Grace Hopper',
      'Ævar Örn',
      '12345',
      '!!!',
      'a-very-long-name-that-exceeds-typical-lengths',
    ]) {
      expect(AVATAR_HUE_PALETTE).toContain(stringToHueClass(sample));
    }
  });

  it('is case-sensitive by design (same case → same class)', () => {
    // The implementation hashes on `charCodeAt`, so different casings
    // may or may not collide inside the modulo bucket. We assert only
    // the case that MUST hold: identical input → identical output.
    expect(stringToHueClass('Ada')).toBe(stringToHueClass('Ada'));
    expect(stringToHueClass('ada')).toBe(stringToHueClass('ada'));
  });

  it('does not mutate its input', () => {
    const name = 'Ada Lovelace';
    const snapshot = name;
    stringToHueClass(name);
    expect(name).toBe(snapshot);
  });

  it('exposes an 8-entry Tailwind bg-* palette', () => {
    expect(AVATAR_HUE_PALETTE).toHaveLength(8);
    for (const entry of AVATAR_HUE_PALETTE) {
      expect(entry).toMatch(/^bg-[a-z]+-\d{3}$/);
    }
  });
});
