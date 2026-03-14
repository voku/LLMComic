import { ComicPanel as ComicPanelType } from '../data';
import { ComicPanel } from './ComicPanel';

interface Props {
  panels: ComicPanelType[];
  startIndex: number;
}

/**
 * Renders a group of comic panels in a comic-book grid layout.
 * Panels are arranged in a 2-column grid with black gutters.
 * If the group has an odd number of panels, the last panel spans both columns.
 */
export function ComicStrip({ panels, startIndex }: Props) {
  return (
    <section className="relative z-10 border-b-8 border-zinc-950">
      {/* Comic page gutters: dark background + small gap between panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px] bg-zinc-950">
        {panels.map((panel, i) => {
          const isFeatured = panels.length % 2 === 1 && i === panels.length - 1;
          return (
            <ComicPanel
              key={panel.id}
              panel={panel}
              index={startIndex + i}
              featured={isFeatured}
            />
          );
        })}
      </div>
    </section>
  );
}
