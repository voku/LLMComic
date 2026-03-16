import { ComicStrip } from './components/ComicStrip';
import { PointAndClickScene } from './components/PointAndClickScene';
import { ImageGenerator } from './components/ImageGenerator';
import { ComicPageView } from './components/ComicPageView';
import { panels, comicPages, ComicPanel as ComicPanelType } from './data';

// ---------------------------------------------------------------------------
// Helper: group the flat panels array into alternating comic strips and
// interactive scenes so the grid renderer knows what to render.
// ---------------------------------------------------------------------------
type Section =
  | { type: 'strip'; panels: ComicPanelType[] }
  | { type: 'interactive'; panel: ComicPanelType };

function buildSections(allPanels: ComicPanelType[]): Section[] {
  const sections: Section[] = [];
  let strip: ComicPanelType[] = [];

  for (const panel of allPanels) {
    if (panel.type === 'interactive') {
      if (strip.length > 0) {
        sections.push({ type: 'strip', panels: strip });
        strip = [];
      }
      sections.push({ type: 'interactive', panel });
    } else {
      strip.push(panel);
    }
  }

  if (strip.length > 0) {
    sections.push({ type: 'strip', panels: strip });
  }

  return sections;
}

export default function App() {
  // Panels already shown via a PNG-backed comicPage — these must not be duplicated
  // in the strip layout below.
  const panelsInComicPages = new Set(comicPages.flatMap(p => p.panels.map(panel => panel.id)));
  // Remaining panels (those without a matching comicPage) rendered as SVG strips/scenes.
  const remainingPanels = panels.filter(panel => !panelsInComicPages.has(panel.id));
  const sections = buildSections(remainingPanels);
  let panelCount = 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-red-700 selection:text-white">
      <header className="border-b-4 border-zinc-900 bg-zinc-950 px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-sm border-[4px] border-zinc-950 bg-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="relative aspect-[16/10] md:aspect-[16/8]">
              <ImageGenerator
                imageId="main-intro-bg"
                alt="Rain-soaked noir city skyline at night"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),_transparent_35%),linear-gradient(to_top,_rgba(24,24,27,0.92),_rgba(24,24,27,0.18)_55%,_rgba(24,24,27,0.55))]" />
              <div className="absolute left-4 top-4 max-w-[min(92%,820px)] border-[4px] border-zinc-950 bg-[linear-gradient(180deg,#fff7d6_0%,#f4e3b3_100%)] px-4 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:left-8 md:top-8 md:px-6 md:py-5">
                <p className="mb-1 font-[--font-comic-title] text-sm tracking-[0.3em] text-red-600 md:text-base">
                  READ-ONLY COMIC EDITION
                </p>
                <h1 className="font-[--font-comic-title] text-4xl leading-none text-zinc-950 md:text-6xl lg:text-7xl">
                  The Case of Danny Krüger
                </h1>
                <p className="mt-2 font-[--font-comic] text-xl font-bold italic leading-tight text-zinc-950 md:text-3xl">
                  A small crime in the age of AI coding
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-5 max-w-4xl text-center">
            <p className="font-[--font-comic] text-base font-bold leading-relaxed text-zinc-300 md:text-lg">
              The story now reads as a static comic: each scene is fully visible, every clue is already on the page, and the artwork stays front and center.
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 py-6 md:py-8">
        {/* PNG-backed pages — only rendered when matching artwork exists */}
        {comicPages.length > 0 && (
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:gap-8 md:px-6">
            {comicPages.map((page, i) => (
              <ComicPageView key={page.id} page={page} pageNumber={i + 1} />
            ))}
          </div>
        )}

        {/* Remaining panels (no matching PNG) rendered as SVG strips / interactive scenes */}
        {sections.map((section) => {
          if (section.type === 'interactive') {
            return <PointAndClickScene key={section.panel.id} panel={section.panel} />;
          }

          const start = panelCount;
          panelCount += section.panels.length;
          const stripKey = section.panels[0]?.id ?? `strip-${start}`;
          return <ComicStrip key={stripKey} panels={section.panels} startIndex={start} />;
        })}
      </main>

      <footer className="relative z-10 border-t-4 border-zinc-900 bg-zinc-950 py-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-6 font-[--font-comic-title] text-4xl tracking-wide text-white md:text-5xl">
            Case Closed
          </h2>
          <p className="text-lg font-[--font-comic] text-zinc-300">
            Based on the blog post "The Case of Danny Krüger".
            <br />
            Presented here as a clean, static comic reader.
            <br />
            <a
              href="https://github.com/voku/LLMComic"
              target="_blank"
              rel="noreferrer"
              aria-label="Contribute to LLMComic on GitHub"
              className="text-red-500 underline underline-offset-4 hover:text-red-400"
            >
              Contribute on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
