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
    <article className="overflow-hidden rounded-sm border-[4px] border-zinc-950 bg-amber-50 text-zinc-950 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="relative border-b-[4px] border-zinc-950 bg-zinc-950 lg:border-b-0 lg:border-r-[4px]">
          <div className={`relative ${featured ? 'aspect-[16/11]' : 'aspect-[16/10]'}`}>
            <ImageGenerator
              imageId={panel.id}
              alt={panel.imageAlt}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/45 via-transparent to-zinc-950/10" />
            <div className="absolute left-4 top-4 bg-yellow-300 px-3 py-1 text-xs font-[--font-comic-title] tracking-[0.25em] text-zinc-950 border-[3px] border-zinc-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:left-6 md:top-6 md:text-sm">
              SCENE {index + 1}
            </div>
            {panel.title && (
              <div className="absolute inset-x-4 bottom-4 md:inset-x-6 md:bottom-6">
                <div className="inline-block max-w-full bg-zinc-950/90 px-4 py-3 text-white border-[3px] border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h2 className="font-[--font-comic-title] text-2xl leading-none tracking-wide md:text-3xl">
                    {panel.title}
                  </h2>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 bg-amber-50 p-4 md:p-6">
          {!panel.title && (
            <div className="border-b-[3px] border-zinc-950 pb-3">
              <h2 className="font-[--font-comic-title] text-2xl leading-none tracking-wide text-zinc-950 md:text-3xl">
                Scene {index + 1}
              </h2>
            </div>
          )}

          <div className="space-y-3">
            {panel.textBlocks.map((text, textIndex) => (
              <div
                key={textIndex}
                className="rounded-2xl border-[3px] border-zinc-950 bg-white px-4 py-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <p className="mb-2 font-[--font-comic-title] text-sm tracking-[0.2em] text-red-600">
                  PANEL NOTE {textIndex + 1}
                </p>
                <p className="font-[--font-comic] text-base font-bold leading-relaxed text-zinc-900 md:text-lg">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <p className="font-[--font-comic] text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
            Read-only comic panel
          </p>
        </div>
      </div>
    </article>
  );
}
