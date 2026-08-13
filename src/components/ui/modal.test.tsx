import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalTitle,
  ModalTrigger,
} from './modal';

/**
 * Example-based tests for the DevFlow Modal compound component.
 *
 * Radix Dialog is the source of truth for behavior; these tests pin
 * the DevFlow-specific glue only: rendering, controlled/uncontrolled
 * state, the overlay opt-out, and prop forwarding to the underlying
 * `Dialog.Content`.
 *
 * jsdom note: Radix portals content into `document.body`, so we use
 * `screen.*` (which searches the whole document, not just the render
 * container) throughout.
 */
describe('Modal', () => {
  it('renders content on mount when uncontrolled with defaultOpen', () => {
    render(
      <Modal defaultOpen>
        <ModalTrigger>open</ModalTrigger>
        <ModalContent>
          <ModalTitle>Title</ModalTitle>
          <ModalDescription>Body copy</ModalDescription>
        </ModalContent>
      </Modal>,
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body copy')).toBeInTheDocument();
  });

  it('toggles content presence when the controlled `open` prop changes', () => {
    const { rerender } = render(
      <Modal open={false}>
        <ModalTrigger>open</ModalTrigger>
        <ModalContent>
          <ModalTitle>controlled title</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    expect(screen.queryByText('controlled title')).not.toBeInTheDocument();

    rerender(
      <Modal open={true}>
        <ModalTrigger>open</ModalTrigger>
        <ModalContent>
          <ModalTitle>controlled title</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    expect(screen.getByText('controlled title')).toBeInTheDocument();

    rerender(
      <Modal open={false}>
        <ModalTrigger>open</ModalTrigger>
        <ModalContent>
          <ModalTitle>controlled title</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    expect(screen.queryByText('controlled title')).not.toBeInTheDocument();
  });

  it('omits the overlay element when showOverlay={false}', () => {
    render(
      <Modal defaultOpen>
        <ModalContent showOverlay={false}>
          <ModalTitle>no overlay</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    // The overlay is portaled into document.body — search globally.
    expect(screen.queryByTestId('modal-overlay')).toBeNull();
  });

  it('renders the overlay by default (showOverlay=true implicitly)', () => {
    render(
      <Modal defaultOpen>
        <ModalContent>
          <ModalTitle>with overlay</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
  });

  it('forwards unknown props to the underlying Dialog.Content element', () => {
    render(
      <Modal defaultOpen>
        <ModalContent data-foo="bar" data-testid="mc" aria-describedby="desc">
          <ModalTitle>fwd</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    const content = screen.getByTestId('mc');
    expect(content).toBeInTheDocument();
    // Unknown data-* prop reaches the rendered DOM node...
    expect(content).toHaveAttribute('data-foo', 'bar');
    // ...as does a standard ARIA passthrough.
    expect(content).toHaveAttribute('aria-describedby', 'desc');
  });
});
