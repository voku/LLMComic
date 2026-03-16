import { ComicPanel as ComicPanelType } from '../data';
import { ComicPanel } from './ComicPanel';

interface Props {
  panels: ComicPanelType[];
  startIndex: number;
}

export function ComicStrip({ panels, startIndex }: Props) {
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 py-4 md:grid-cols-2 md:gap-5 md:px-6 md:py-6">
      {panels.map((panel, i) => (
        <ComicPanel
          key={panel.id}
          panel={panel}
          index={startIndex + i}
          galleryPanels={panels}
          galleryIndex={i}
        />
      ))}
    </section>
  );
}
