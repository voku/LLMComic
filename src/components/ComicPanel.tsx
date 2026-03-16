import { useState } from 'react';
import { ComicPanel as ComicPanelType } from '../data';
import { ImageGenerator } from './ImageGenerator';
import { ImageLightbox, ExpandButton } from './ImageLightbox';
import { getGeneratedImagePath } from '../generatedImages';

interface Props {
  panel: ComicPanelType;
  index: number;
  /** When true the panel spans both columns in the comic grid */
  featured?: boolean;
}

export function ComicPanel({ panel, index, featured = false }: Props) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const imagePath = getGeneratedImagePath(panel.id, import.meta.env.BASE_URL);

  const hasText = panel.textBlocks.length > 0;
  const allRevealed = revealedCount >= panel.textBlocks.length;

  function handleClick() {
    if (!allRevealed) {
      setRevealedCount((c) => c + 1);
    }
  }

  return (
    <article
      className={`group overflow-hidden rounded-sm border-[4px] border-zinc-950 bg-zinc-900 text-zinc-950 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]${hasText && !allRevealed ? ' cursor-pointer select-none' : ''}`}
      onClick={handleClick}
      role={hasText && !allRevealed ? 'button' : undefined}
      aria-label={hasText && !allRevealed ? 'Click to reveal story text' : undefined}
    >
      <div className={`relative ${featured ? 'aspect-[16/11]' : 'aspect-[16/10]'}`}>
        <ImageGenerator
          imageId={panel.id}
          alt={panel.imageAlt}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),_transparent_30%),linear-gradient(to_top,_rgba(9,9,11,0.82),_rgba(9,9,11,0.08)_45%,_rgba(9,9,11,0.38))]" />

        {panel.title && (
          <div className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] md:left-5 md:top-5 md:max-w-[min(88%,32rem)]">
            <div className="inline-block max-w-full border-[4px] border-zinc-950 bg-[linear-gradient(180deg,#fff7d6_0%,#f4e3b3_100%)] px-4 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="mb-1 font-[--font-comic-title] text-[10px] tracking-[0.28em] text-red-600 md:text-xs">
                SCENE {index + 1}
              </p>
              <h2 className="font-[--font-comic-title] text-xl leading-none tracking-wide text-zinc-950 md:text-3xl">
                {panel.title}
              </h2>
            </div>
          </div>
        )}

        {/* Expand / fullscreen button – visible only on hover / keyboard focus */}
        {imagePath && <ExpandButton onExpand={() => setLightboxOpen(true)} />}

        {/* Revealed text blocks (one shown per click) */}
        {revealedCount > 0 && (
          <div className="absolute inset-x-3 bottom-10 md:inset-x-6 md:bottom-12">
            <div className="grid gap-3 md:max-w-[78%]">
              {panel.textBlocks.slice(0, revealedCount).map((text, textIndex) => (
                <div
                  key={textIndex}
                  className="rounded-sm border-[3px] border-zinc-950 bg-[linear-gradient(180deg,#fffdf3_0%,#f8ecd0_100%)] px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <p className="font-[--font-comic] text-sm font-bold leading-snug text-zinc-950 md:text-base">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom bar: progress dots (left) + tap-to-read hint (right) */}
        {hasText && (
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between md:inset-x-6 md:bottom-4">
            {/* Progress dots */}
            <div className="flex gap-1.5">
              {panel.textBlocks.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full border border-zinc-950 transition-colors ${
                    i < revealedCount ? 'bg-red-500' : 'bg-zinc-400/60'
                  }`}
                />
              ))}
            </div>

            {/* "Tap to read" hint */}
            {!allRevealed && (
              <div className="flex items-center gap-1 rounded-full border-[2px] border-zinc-950 bg-zinc-950/70 px-3 py-1 text-white backdrop-blur-sm">
                <span className="font-[--font-comic] text-xs font-bold">tap to read</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full-screen lightbox */}
      {lightboxOpen && imagePath && (
        <ImageLightbox src={imagePath} alt={panel.imageAlt} onClose={() => setLightboxOpen(false)} />
      )}
    </article>
  );
}
