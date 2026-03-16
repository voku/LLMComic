import { useState } from 'react';
import { ComicPanel } from '../data';
import { ImageGenerator } from './ImageGenerator';
import { ExpandButton, ImageLightbox } from './ImageLightbox';
import { getGeneratedImagePath } from '../generatedImages';

export function PointAndClickScene({ panel }: { panel: ComicPanel }) {
  const hotspots = panel.hotspots ?? [];
  const [revealedCount, setRevealedCount] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const imagePath = getGeneratedImagePath(panel.id, import.meta.env.BASE_URL);

  const hasText = panel.textBlocks.length > 0;
  const allRevealed = revealedCount >= panel.textBlocks.length;

  function handleImageClick() {
    if (!allRevealed) {
      setRevealedCount((c) => c + 1);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6">
      <article className="overflow-hidden rounded-sm border-[4px] border-zinc-950 bg-zinc-900 text-zinc-950 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div
          className={`relative aspect-[16/11] md:aspect-[16/9]${hasText && !allRevealed ? ' cursor-pointer select-none' : ''}`}
          onClick={handleImageClick}
          role={hasText && !allRevealed ? 'button' : undefined}
          aria-label={hasText && !allRevealed ? 'Click to reveal story text' : undefined}
        >
          <ImageGenerator
            imageId={panel.id}
            alt={panel.imageAlt}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),_transparent_30%),linear-gradient(to_top,_rgba(9,9,11,0.90),_rgba(9,9,11,0.12)_50%,_rgba(9,9,11,0.45))]" />

          {imagePath && <ExpandButton onExpand={() => setLightboxOpen(true)} />}

          <div className="absolute left-4 top-4 max-w-[min(86%,34rem)] md:left-6 md:top-6">
            <div className="inline-block max-w-full border-[4px] border-zinc-950 bg-[linear-gradient(180deg,#fff7d6_0%,#f4e3b3_100%)] px-4 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="mb-1 font-[--font-comic-title] text-sm tracking-[0.3em] text-red-600">
                CASE FILE
              </p>
              <h2 className="font-[--font-comic-title] text-2xl leading-none tracking-wide text-zinc-950 md:text-4xl">
                {panel.title ?? 'Evidence Board'}
              </h2>
            </div>
          </div>

          {hotspots.map((hotspot, index) => (
            <div
              key={hotspot.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${hotspot.x + hotspot.width / 2}%`,
                top: `${hotspot.y + hotspot.height / 2}%`,
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-zinc-950 bg-red-600 font-[--font-comic-title] text-lg text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:h-12 md:w-12 md:text-xl">
                {index + 1}
              </div>
            </div>
          ))}

          {/* Revealed text blocks (one per click) */}
          {revealedCount > 0 && (
            <div className="absolute inset-x-3 bottom-10 md:inset-x-6 md:bottom-12">
              <div className="grid gap-3 md:max-w-[70%]">
                {panel.textBlocks.slice(0, revealedCount).map((text, index) => (
                  <div
                    key={index}
                    className="rounded-sm border-[3px] border-zinc-950 bg-[linear-gradient(180deg,#fffdf3_0%,#f8ecd0_100%)] px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <p className="font-[--font-comic] text-base font-bold leading-relaxed text-zinc-950 md:text-lg">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom bar: progress dots + tap-to-read hint */}
          {hasText && (
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between md:inset-x-6 md:bottom-4">
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

              {!allRevealed && (
                <div className="flex items-center gap-1 rounded-full border-[2px] border-zinc-950 bg-zinc-950/70 px-3 py-1 text-white backdrop-blur-sm">
                  <span className="font-[--font-comic] text-xs font-bold">tap to read</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t-[4px] border-zinc-950 bg-zinc-100 p-4 md:p-6">
          <h3 className="mb-4 font-[--font-comic-title] text-2xl tracking-wide text-zinc-950 md:text-3xl">
            Evidence Notes
          </h3>

          <div className="grid gap-4 lg:grid-cols-2">
            {hotspots.map((hotspot, index) => (
              <section
                key={hotspot.id}
                className="rounded-sm border-[4px] border-zinc-950 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-zinc-950 bg-yellow-300 font-[--font-comic-title] text-lg text-zinc-950">
                    {index + 1}
                  </div>
                  <h4 className="font-[--font-comic-title] text-2xl leading-none tracking-wide text-zinc-950">
                    {hotspot.label}
                  </h4>
                </div>

                <div className="space-y-3">
                  {Object.entries(hotspot.interactions).map(([verb, note]) => (
                    <div key={verb} className="rounded-sm border-[3px] border-zinc-950 bg-amber-50 px-4 py-3">
                      <p className="mb-1 font-[--font-comic-title] text-sm tracking-[0.2em] text-red-600">
                        {verb}
                      </p>
                      <p className="font-[--font-comic] text-base font-bold leading-relaxed text-zinc-900">
                        {note}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>

      {lightboxOpen && imagePath && (
        <ImageLightbox
          src={imagePath}
          alt={panel.imageAlt}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}
