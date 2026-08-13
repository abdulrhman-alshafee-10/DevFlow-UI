import { describe, expect, it } from 'vitest';

import { getInitials } from './get-initials';

describe('getInitials', () => {
  it('returns "?" for an empty string', () => {
    expect(getInitials('')).toBe('?');
  });

  it('returns "?" for a whitespace-only string', () => {
    expect(getInitials('   \t\n  ')).toBe('?');
  });

  it('returns a single initial for a single word', () => {
    expect(getInitials('Ada')).toBe('A');
  });

  it('returns two initials for two words', () => {
    expect(getInitials('Ada Lovelace')).toBe('AL');
  });

  it('caps at max = 2 by default for three words', () => {
    expect(getInitials('Grace Brewster Hopper')).toBe('GB');
  });

  it('honors an explicit max = 1', () => {
    expect(getInitials('Grace Brewster Hopper', 1)).toBe('G');
  });

  it('honors an explicit max = 3', () => {
    expect(getInitials('Grace Brewster Hopper', 3)).toBe('GBH');
  });

  it('returns an empty-like "?" fallback only when no letters were accepted', () => {
    // max = 5 but the name only exposes two initials → still 'GBH', no
    // padding.
    expect(getInitials('Grace Brewster Hopper', 5)).toBe('GBH');
  });

  it('skips a leading non-letter token and takes letters from the next', () => {
    expect(getInitials('123 Ada')).toBe('A');
  });

  it('returns "?" when every considered token starts with a non-letter', () => {
    expect(getInitials('!!! ???')).toBe('?');
  });

  it('preserves Unicode letters and uppercases them', () => {
    expect(getInitials('Ævar Örn')).toBe('ÆÖ');
  });

  it('does not mutate its input', () => {
    const name = '  Ada   Lovelace  ';
    const snapshot = name;
    getInitials(name);
    expect(name).toBe(snapshot);
  });

  it('collapses runs of whitespace as a single separator', () => {
    expect(getInitials('Ada   \t  Lovelace')).toBe('AL');
  });
});
