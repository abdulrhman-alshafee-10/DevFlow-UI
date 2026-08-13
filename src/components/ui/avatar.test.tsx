import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { getInitials } from '@/lib/utils';

import { Avatar, type AvatarSize } from './avatar';

describe('Avatar', () => {
  describe('image mode', () => {
    it('renders an <img> with alt=name and referrerPolicy="no-referrer" when src is provided', () => {
      render(<Avatar src="https://example.com/a.png" name="Ada Lovelace" />);

      const img = screen.getByRole('img') as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img.getAttribute('alt')).toBe('Ada Lovelace');
      expect(img.getAttribute('referrerpolicy')).toBe('no-referrer');
      expect(img.getAttribute('src')).toBe('https://example.com/a.png');
    });

    it('swaps to the initials fallback when the image onError fires', () => {
      render(
        <Avatar src="https://example.com/broken.png" name="Ada Lovelace" />,
      );

      const img = screen.getByRole('img');
      fireEvent.error(img);

      expect(screen.queryByRole('img')).toBeNull();
      const fallback = screen.getByLabelText('Ada Lovelace');
      expect(fallback).toBeInTheDocument();
      expect(fallback.textContent).toBe(getInitials('Ada Lovelace'));
    });
  });

  describe('fallback mode', () => {
    it('renders fallback element with aria-label=name and text=getInitials(name) when src is omitted', () => {
      render(<Avatar name="Grace Hopper" />);

      const fallback = screen.getByLabelText('Grace Hopper');
      expect(fallback).toBeInTheDocument();
      expect(fallback.textContent).toBe(getInitials('Grace Hopper'));
      expect(screen.queryByRole('img')).toBeNull();
    });

    it('honors the initials override', () => {
      render(<Avatar name="Grace Hopper" initials="GH!" />);

      const fallback = screen.getByLabelText('Grace Hopper');
      expect(fallback.textContent).toBe('GH!');
    });

    it('renders "?" for an empty name', () => {
      const { container } = render(<Avatar name="" />);

      // With an empty name we can't query by aria-label ("").
      // The inner fallback span is the only child of the outer span.
      const outer = container.firstElementChild;
      expect(outer).not.toBeNull();
      const inner = outer?.firstElementChild;
      expect(inner).not.toBeNull();
      expect(inner?.getAttribute('aria-label')).toBe('');
      expect(inner?.textContent).toBe('?');
    });
  });

  describe('size mapping', () => {
    const cases: Array<[AvatarSize, string]> = [
      ['xs', 'h-6'],
      ['sm', 'h-8'],
      ['md', 'h-10'],
      ['lg', 'h-12'],
      ['xl', 'h-16'],
    ];

    it.each(cases)(
      'applies the %s size classes to the outer span',
      (size, heightClass) => {
        const { container } = render(<Avatar name="Ada" size={size} />);
        const outer = container.firstElementChild as HTMLElement;
        expect(outer.className).toContain(heightClass);
      },
    );

    it('defaults to md when size is omitted', () => {
      const { container } = render(<Avatar name="Ada" />);
      const outer = container.firstElementChild as HTMLElement;
      expect(outer.className).toContain('h-10');
    });
  });

  it('forwards extra HTMLAttributes to the outer span', () => {
    const { container } = render(
      <Avatar name="Ada" data-testid="root" title="hello" />,
    );
    const outer = container.firstElementChild as HTMLElement;
    expect(outer.getAttribute('data-testid')).toBe('root');
    expect(outer.getAttribute('title')).toBe('hello');
  });
});
