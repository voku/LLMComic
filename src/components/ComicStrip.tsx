import { ComicPanel as ComicPanelType } from '../data';
import { ComicPanel } from './ComicPanel';

interface Props {
  panels: ComicPanelType[];
  startIndex: number;
}

export function ComicStrip({ panels, startIndex }: Props) {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 md:px-6 md:py-6">
      {panels.map((panel, i) => (
        <ComicPanel
          key={panel.id}
          panel={panel}
          index={startIndex + i}
          featured={i === 0}
        />
      ))}
    </section>
  );
}
