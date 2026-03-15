import { ComicStrip } from './components/ComicStrip';
import { PointAndClickScene } from './components/PointAndClickScene';
import { ImageGenerator } from './components/ImageGenerator';
import { panels, ComicPanel as ComicPanelType } from './data';

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
  const sections = buildSections(panels);
  let panelCount = 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-red-700 selection:text-white">
      <header className="border-b-4 border-zinc-900 bg-zinc-950">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-6 md:py-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-center">
          <div className="order-2 space-y-5 lg:order-1">
            <p className="font-[--font-comic-title] text-lg tracking-[0.3em] text-red-500">
              READ-ONLY COMIC EDITION
            </p>
            <h1
              className="font-[--font-comic-title] text-5xl leading-none text-white md:text-7xl lg:text-8xl"
              style={{ textShadow: '4px 4px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}
            >
              The Case of
              <br />
              <span className="text-red-500">Danny Krüger</span>
            </h1>
            <p className="max-w-2xl border-l-8 border-red-600 bg-zinc-900/80 px-5 py-4 font-[--font-comic] text-lg font-bold leading-relaxed text-zinc-100 md:text-xl">
              A static, image-first comic about what happens when generated code looks right enough to be believed.
            </p>
            <p className="max-w-2xl font-[--font-comic] text-base leading-relaxed text-zinc-300 md:text-lg">
              The investigation now reads like a finished graphic story: every scene is visible at once, every clue is written out, and nothing requires clicking to continue.
            </p>
          </div>

          <div className="order-1 overflow-hidden rounded-sm border-[4px] border-zinc-950 bg-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] lg:order-2">
            <div className="relative aspect-[4/5] md:aspect-[16/10] lg:aspect-[4/5]">
              <ImageGenerator
                imageId="main-intro-bg"
                alt="Rain-soaked noir city skyline at night"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 py-6 md:py-8">
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
