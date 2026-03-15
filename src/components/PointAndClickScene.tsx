import { ComicPanel } from '../data';
import { ImageGenerator } from './ImageGenerator';

const VERBS = ['Inspect', 'Analyze', 'Interrogate'] as const;

export function PointAndClickScene({ panel }: { panel: ComicPanel }) {
  const hotspots = panel.hotspots ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6">
      <article className="overflow-hidden rounded-sm border-[4px] border-zinc-950 bg-zinc-100 text-zinc-950 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-[4px] border-zinc-950 bg-red-600 px-4 py-4 text-white md:px-6">
          <p className="mb-2 font-[--font-comic-title] text-sm tracking-[0.3em] text-zinc-100">
            CASE FILE
          </p>
          <h2 className="font-[--font-comic-title] text-3xl leading-none tracking-wide md:text-4xl">
            {panel.title ?? 'Evidence Board'}
          </h2>
        </div>

        <div className="grid gap-0 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <div className="border-b-[4px] border-zinc-950 bg-zinc-950 p-4 md:p-6 xl:border-b-0 xl:border-r-[4px]">
            <div className="relative overflow-hidden rounded-sm border-[4px] border-zinc-950 bg-black">
              <div className="relative aspect-[16/10]">
                <ImageGenerator
                  imageId={panel.id}
                  alt={panel.imageAlt}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 via-transparent to-zinc-950/10" />
                {hotspots.map((hotspot, index) => (
                  <div
                    key={hotspot.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${hotspot.x + hotspot.width / 2}%`,
                      top: `${hotspot.y + hotspot.height / 2}%`,
                    }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-zinc-950 bg-yellow-300 font-[--font-comic-title] text-lg text-zinc-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {panel.textBlocks.map((text, index) => (
                <p
                  key={index}
                  className="rounded-2xl border-[3px] border-zinc-950 bg-white px-4 py-3 font-[--font-comic] text-base font-bold leading-relaxed text-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:text-lg"
                >
                  {text}
                </p>
              ))}
            </div>
          </div>

          <div className="bg-zinc-100 p-4 md:p-6">
            <h3 className="mb-4 border-b-[3px] border-zinc-950 pb-3 font-[--font-comic-title] text-2xl tracking-wide text-zinc-950">
              Evidence Notes
            </h3>

            <div className="space-y-4">
              {hotspots.map((hotspot, index) => (
                <section
                  key={hotspot.id}
                  className="rounded-sm border-[4px] border-zinc-950 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-zinc-950 bg-red-600 font-[--font-comic-title] text-lg text-white">
                      {index + 1}
                    </div>
                    <h4 className="font-[--font-comic-title] text-2xl leading-none tracking-wide text-zinc-950">
                      {hotspot.label}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {VERBS.map((verb) => {
                      const note = hotspot.interactions[verb];

                      if (!note) {
                        return null;
                      }

                      return (
                        <div key={verb} className="rounded-2xl border-[3px] border-zinc-950 bg-amber-50 px-4 py-3">
                          <p className="mb-1 font-[--font-comic-title] text-sm tracking-[0.2em] text-red-600">
                            {verb}
                          </p>
                          <p className="font-[--font-comic] text-base font-bold leading-relaxed text-zinc-900">
                            {note}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
