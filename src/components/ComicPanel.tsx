import { ComicPanel as ComicPanelType } from '../data';
import { ImageGenerator } from './ImageGenerator';

interface Props {
  panel: ComicPanelType;
  index: number;
  /** When true the panel spans both columns in the comic grid */
  featured?: boolean;
}

export function ComicPanel({ panel, index, featured = false }: Props) {
  return (
    <article className="overflow-hidden rounded-sm border-[4px] border-zinc-950 bg-zinc-900 text-zinc-950 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className={`relative ${featured ? 'aspect-[16/11]' : 'aspect-[16/10]'}`}>
        <ImageGenerator
          imageId={panel.id}
          alt={panel.imageAlt}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),_transparent_30%),linear-gradient(to_top,_rgba(9,9,11,0.82),_rgba(9,9,11,0.08)_45%,_rgba(9,9,11,0.38))]" />
        <div className="absolute right-4 top-4 border-[3px] border-zinc-950 bg-red-600 px-3 py-1 text-xs font-[--font-comic-title] tracking-[0.25em] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:right-6 md:top-6 md:text-sm">
          SCENE {index + 1}
        </div>

        {panel.title && (
          <div className="absolute left-4 top-4 max-w-[min(82%,34rem)] md:left-6 md:top-6">
            <div className="inline-block max-w-full border-[4px] border-zinc-950 bg-[linear-gradient(180deg,#fff7d6_0%,#f4e3b3_100%)] px-4 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="font-[--font-comic-title] text-2xl leading-none tracking-wide text-zinc-950 md:text-4xl">
                {panel.title}
              </h2>
            </div>
          </div>
        )}

        <div className="absolute inset-x-3 bottom-3 md:inset-x-6 md:bottom-6">
          <div className="grid gap-3 md:max-w-[68%]">
            {panel.textBlocks.map((text, textIndex) => (
              <div
                key={textIndex}
                className="rounded-sm border-[3px] border-zinc-950 bg-[linear-gradient(180deg,#fffdf3_0%,#f8ecd0_100%)] px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <p className="font-[--font-comic] text-base font-bold leading-relaxed text-zinc-950 md:text-lg">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t-[4px] border-zinc-950 bg-zinc-950 px-4 py-3">
        <p className="font-[--font-comic-title] text-sm tracking-[0.25em] text-zinc-400">
          STATIC COMIC PANEL
        </p>
      </div>
    </article>
  );
}
