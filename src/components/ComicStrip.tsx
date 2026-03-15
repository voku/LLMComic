import { ComicPanel as ComicPanelType } from '../data';
import { ComicPanel } from './ComicPanel';

interface Props {
  panels: ComicPanelType[];
  startIndex: number;
}

/**
 * Renders a group of comic panels in a dynamic comic-book page layout.
 * Uses a varied grid to avoid the monotonous "wall of identical rectangles"
 * feel: the first panel in each strip gets a cinematic full-width layout,
 * subsequent panels sit in a classic 2-col grid, and a trailing odd panel
 * spans both columns.
 */
export function ComicStrip({ panels, startIndex }: Props) {
  // Split panels: first panel is "hero" (full-width), rest go in grid
  const hero = panels.length > 2 ? panels[0] : null;
  const gridPanels = hero ? panels.slice(1) : panels;

  return (
    <section className="relative z-10 bg-zinc-950">
      {/* Hero panel — full-width cinematic */}
      {hero && (
        <div className="border-[3px] border-zinc-950">
          <ComicPanel panel={hero} index={startIndex} featured />
        </div>
      )}

      {/* Remaining panels — 2-column grid */}
      {gridPanels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-1.5 bg-zinc-950 p-1 md:p-1.5">
          {gridPanels.map((panel, i) => {
            const globalIdx = startIndex + (hero ? i + 1 : i);
            const isFeatured = gridPanels.length % 2 === 1 && i === gridPanels.length - 1;
            return (
              <div
                key={panel.id}
                className={`border-[3px] border-zinc-950 overflow-hidden ${isFeatured ? 'md:col-span-2' : ''}`}
              >
                <ComicPanel
                  panel={panel}
                  index={globalIdx}
                  featured={isFeatured}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
