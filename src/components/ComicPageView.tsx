import { useState } from 'react';
import { ComicPage, Hotspot } from '../data';
import { getGeneratedImagePath } from '../generatedImages';
import { ImageLightbox, ExpandButton } from './ImageLightbox';

/**
 * Renders one uploaded comic-page PNG full-width in a single column.
 *
 * Scaling image maps are implemented with an SVG overlay whose viewBox
 * matches the coordinate space of the hotspot data (0–100 in each axis).
 * Because the SVG stretches to fill the image, every hotspot rectangle and
 * marker scales automatically at any viewport width — no JavaScript resize
 * listener required.
 */
export function ComicPageView({ page, pageNumber }: { page: ComicPage; pageNumber: number }) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Collect all hotspots from interactive panels on this page
  const hotspots: Hotspot[] = page.panels.flatMap(p => p.hotspots ?? []);
  const hasInteractive = hotspots.length > 0;

  const imagePath = getGeneratedImagePath(page.id, import.meta.env.BASE_URL);
  const aspectStyle = { aspectRatio: `${page.imageWidth} / ${page.imageHeight}` };

  // Narrative text blocks from all panels on this page
  const allTextBlocks = page.panels.flatMap(p => p.textBlocks);
  const hasText = allTextBlocks.length > 0;
  const allRevealed = revealedCount >= allTextBlocks.length;

  // Titles from panels (first non-empty wins for the page badge)
  const pageTitle = page.panels.find(p => p.title)?.title;

  const currentHotspot = hotspots.find(h => h.id === activeHotspot) ?? null;

  function handleImageClick() {
    if (!allRevealed) {
      setRevealedCount((c) => c + 1);
    }
  }

  return (
    <article className="overflow-hidden rounded-sm border-[4px] border-zinc-950 bg-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      {/* ── Image + scaling image map overlay ─────────────────────────── */}
      <div
        className={`group relative w-full${hasText && !allRevealed ? ' cursor-pointer select-none' : ''}`}
        style={aspectStyle}
        onClick={handleImageClick}
        role={hasText && !allRevealed ? 'button' : undefined}
        aria-label={hasText && !allRevealed ? 'Click to reveal story text' : undefined}
      >
        {imagePath ? (
          <img
            src={imagePath}
            alt={page.imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
            <span className="font-mono text-sm uppercase tracking-widest text-zinc-500">
              Image missing
            </span>
          </div>
        )}

        {/* Dark gradient so text and markers stay readable */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_35%),linear-gradient(to_top,_rgba(9,9,11,0.85),_rgba(9,9,11,0.06)_50%,_rgba(9,9,11,0.40))]" />

        {/* Page badge – visible only on hover / keyboard focus */}
        <div className="absolute left-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 md:left-5 md:top-5">
          <div className="inline-block border-[4px] border-zinc-950 bg-[linear-gradient(180deg,#fff7d6_0%,#f4e3b3_100%)] px-3 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:px-5 md:py-3">
            <p className="font-[--font-comic-title] text-[10px] tracking-[0.28em] text-red-600 md:text-xs">
              PAGE {pageNumber}
            </p>
            {pageTitle && (
              <h2 className="font-[--font-comic-title] text-lg leading-none tracking-wide text-zinc-950 md:text-2xl">
                {pageTitle}
              </h2>
            )}
          </div>
        </div>

        {/* Expand / fullscreen button – visible only on hover / keyboard focus */}
        {imagePath && <ExpandButton onExpand={() => setLightboxOpen(true)} />}

        {/* ── SVG scaling image map ──────────────────────────────────────
            viewBox="0 0 100 100" + preserveAspectRatio="none" maps the
            hotspot percentage coordinates (0–100) onto the full image area
            so every <rect> and marker scales with the rendered image size. */}
        {hasInteractive && (
          <svg
            className="absolute inset-0 h-full w-full opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-label="Interactive hotspot map"
            role="application"
          >
            {hotspots.map((hotspot, idx) => (
              <g key={hotspot.id}>
                {/* Clickable hotspot rectangle */}
                <rect
                  x={hotspot.x}
                  y={hotspot.y}
                  width={hotspot.width}
                  height={hotspot.height}
                  fill={activeHotspot === hotspot.id ? 'rgba(220,38,38,0.18)' : 'rgba(220,38,38,0.06)'}
                  stroke={activeHotspot === hotspot.id ? 'rgba(220,38,38,0.85)' : 'rgba(220,38,38,0.45)'}
                  strokeWidth="0.5"
                  className="cursor-pointer transition-colors"
                  onClick={(e) => { e.stopPropagation(); setActiveHotspot(
                    activeHotspot === hotspot.id ? null : hotspot.id
                  ); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={hotspot.label}
                  aria-pressed={activeHotspot === hotspot.id}
                />
                {/* Numbered marker at centre of hotspot */}
                <circle
                  cx={hotspot.x + hotspot.width / 2}
                  cy={hotspot.y + hotspot.height / 2}
                  r="4"
                  fill="rgb(220,38,38)"
                  stroke="rgb(9,9,11)"
                  strokeWidth="0.6"
                  className="pointer-events-none"
                />
                <text
                  x={hotspot.x + hotspot.width / 2}
                  y={hotspot.y + hotspot.height / 2 + 1.4}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="4"
                  fontWeight="bold"
                  fontFamily="Bangers, Impact, sans-serif"
                  className="pointer-events-none select-none"
                >
                  {idx + 1}
                </text>
              </g>
            ))}
          </svg>
        )}

        {/* Narration caption strip – revealed one block per click */}
        {revealedCount > 0 && (
          <div className="absolute inset-x-3 bottom-10 md:inset-x-5 md:bottom-12">
            <div className="flex flex-col gap-2 md:max-w-[72%]">
              {allTextBlocks.slice(0, revealedCount).map((text, i) => (
                <div
                  key={i}
                  className="rounded-sm border-[3px] border-zinc-950 bg-[linear-gradient(180deg,#fffdf3_0%,#f8ecd0_100%)] px-3 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:px-4 md:py-3"
                >
                  <p className="font-[--font-comic] text-xs font-bold leading-snug text-zinc-950 md:text-sm">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom bar: progress dots + tap-to-read hint */}
        {hasText && (
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between md:inset-x-5 md:bottom-4">
            <div className="flex gap-1.5">
              {allTextBlocks.map((_, i) => (
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

      {/* ── Hotspot detail panel (shown when a hotspot is active) ──────── */}
      {hasInteractive && (
        <div className="border-t-[4px] border-zinc-950 bg-zinc-100 p-4 md:p-6">
          <h3 className="mb-3 font-[--font-comic-title] text-xl tracking-wide text-zinc-950 md:mb-4 md:text-2xl">
            Evidence Notes
          </h3>

          {currentHotspot ? (
            <div className="rounded-sm border-[4px] border-zinc-950 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-zinc-950 bg-yellow-300 font-[--font-comic-title] text-base text-zinc-950">
                  {hotspots.indexOf(currentHotspot) + 1}
                </div>
                <h4 className="font-[--font-comic-title] text-xl leading-none tracking-wide text-zinc-950 md:text-2xl">
                  {currentHotspot.label}
                </h4>
              </div>
              <div className="space-y-3">
                {Object.entries(currentHotspot.interactions).map(([verb, note]) => (
                  <div key={verb} className="rounded-sm border-[3px] border-zinc-950 bg-amber-50 px-4 py-3">
                    <p className="mb-1 font-[--font-comic-title] text-sm tracking-[0.2em] text-red-600">
                      {verb}
                    </p>
                    <p className="font-[--font-comic] text-sm font-bold leading-relaxed text-zinc-900 md:text-base">
                      {note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {hotspots.map((hotspot, idx) => (
                <button
                  key={hotspot.id}
                  type="button"
                  onClick={() => setActiveHotspot(hotspot.id)}
                  className="flex items-center gap-3 rounded-sm border-[3px] border-zinc-950 bg-white px-3 py-3 text-left shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-shadow hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[3px] border-zinc-950 bg-red-600 font-[--font-comic-title] text-base text-white">
                    {idx + 1}
                  </span>
                  <span className="font-[--font-comic-title] text-lg leading-tight tracking-wide text-zinc-950">
                    {hotspot.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full-screen lightbox */}
      {lightboxOpen && imagePath && (
        <ImageLightbox src={imagePath} alt={page.imageAlt} onClose={() => setLightboxOpen(false)} />
      )}
    </article>
  );
}
