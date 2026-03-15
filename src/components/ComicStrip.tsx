import { ComicPanel as ComicPanelType } from '../data';
import { ComicPanel } from './ComicPanel';

interface Props {
  panels: ComicPanelType[];
  startIndex: number;
}

/**
 * Renders a group of comic panels in a comic-book grid layout.
 * Panels are arranged in a 2-column grid with thick black gutters.
 * If the group has an odd number of panels, the last panel spans both columns.
 */
export function ComicStrip({ panels, startIndex }: Props) {
  return (
    <section className="relative z-10 bg-zinc-950 border-b-4 border-zinc-950">
      {/* Thick black gutters between panels for a classic comic-page look */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-1.5 bg-zinc-950 p-1 md:p-1.5">
        {panels.map((panel, i) => {
          const isFeatured = panels.length % 2 === 1 && i === panels.length - 1;
          return (
            <div
              key={panel.id}
              className={`border-[3px] border-zinc-950 overflow-hidden ${isFeatured ? 'md:col-span-2' : ''}`}
            >
              <ComicPanel
                panel={panel}
                index={startIndex + i}
                featured={isFeatured}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
