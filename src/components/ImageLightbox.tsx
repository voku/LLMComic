import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  prevLabel?: string;
  nextLabel?: string;
  counterLabel?: string;
}

interface ExpandButtonProps {
  onExpand: () => void;
}

/**
 * Full-screen image lightbox rendered into `document.body` via a React portal.
 *
 * - Locks body scroll while open.
 * - Closes on Escape key, backdrop click, or the ✕ button.
 * - The image uses `object-contain` so the full artwork is always visible,
 *   regardless of screen size or aspect ratio.
 */
export function ImageLightbox({
  src,
  alt,
  onClose,
  onPrev,
  onNext,
  prevLabel = 'Previous image',
  nextLabel = 'Next image',
  counterLabel,
}: LightboxProps) {
  // Lock body scroll while the lightbox is mounted
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev?.();
      if (e.key === 'ArrowRight') onNext?.();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  return createPortal(
    /* Backdrop — click outside image to close */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 p-3 sm:p-4 md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Full-screen view: ${alt}`}
    >
      <div className="absolute inset-x-2 top-2 z-10 flex items-start justify-between gap-2 sm:inset-x-3 sm:top-3 sm:gap-3 md:inset-x-5 md:top-5">
        {onPrev ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="flex h-11 min-w-11 items-center justify-center border-[3px] border-zinc-950 bg-[linear-gradient(180deg,#fff7d6_0%,#f4e3b3_100%)] px-3 font-[--font-comic-title] text-lg text-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:h-10 md:min-w-10 md:text-base"
            aria-label={prevLabel}
          >
            ‹
          </button>
        ) : (
          <div />
        )}

        <div className="flex gap-2">
          {onNext && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="flex h-11 min-w-11 items-center justify-center border-[3px] border-zinc-950 bg-[linear-gradient(180deg,#fff7d6_0%,#f4e3b3_100%)] px-3 font-[--font-comic-title] text-lg text-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:h-10 md:min-w-10 md:text-base"
              aria-label={nextLabel}
            >
              ›
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex h-11 w-11 items-center justify-center border-[3px] border-zinc-950 bg-[linear-gradient(180deg,#fff7d6_0%,#f4e3b3_100%)] font-[--font-comic-title] text-xl text-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:h-10 md:w-10"
            aria-label="Close full-screen view"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Full image — stop click from bubbling to backdrop */}
      <div className="flex max-h-full max-w-full flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt={alt}
          className="max-h-[calc(100vh-7.5rem)] max-w-full border-[4px] border-zinc-950 object-contain shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] sm:max-h-[82vh]"
          draggable={false}
        />
        {counterLabel && (
          <p className="rounded-full border-[3px] border-zinc-950 bg-zinc-100 px-3 py-1.5 text-center font-[--font-comic] text-xs font-bold text-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:px-4 sm:py-2 sm:text-sm md:text-base">
            {counterLabel}
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}

/**
 * Fullscreen expand button placed in the top-right corner of a comic image.
 * Uses `e.stopPropagation()` so it never triggers the parent's click handler.
 */
export function ExpandButton({ onExpand }: ExpandButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onExpand(); }}
      className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center border-[3px] border-zinc-950 bg-zinc-950/80 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] backdrop-blur-sm transition-transform hover:scale-105 active:scale-95 md:right-5 md:top-5 md:h-11 md:w-11"
      aria-label="View full screen"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 01-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L7.414 15H9a1 1 0 010 2H4a1 1 0 01-1-1v-4zm14 1a1 1 0 01-2 0v-1.586l-2.293 2.293a1 1 0 01-1.414-1.414L14.586 15H13a1 1 0 010-2h4a1 1 0 011 1v4z" clipRule="evenodd" />
      </svg>
    </button>
  );
}
