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
                  A NOIR CASE FILE
                </p>
                <h1 className="font-[--font-comic-title] text-4xl leading-none text-zinc-950 md:text-6xl lg:text-7xl">
                  The Case of Danny Krüger
                </h1>
                <p className="mt-2 font-[--font-comic] text-xl font-bold italic leading-tight text-zinc-950 md:text-3xl">
                  A detective story about AI code that looked right until reality caught up.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-5 grid max-w-6xl gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <section className="rounded-sm border-[4px] border-zinc-950 bg-zinc-900/85 p-5 text-left shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-[--font-comic-title] text-sm tracking-[0.28em] text-red-500">
                BEFORE YOU OPEN THE FILE
              </p>
              <p className="mt-3 font-[--font-comic] text-base font-bold leading-relaxed text-zinc-100 md:text-lg">
                Danny ships faster and faster with AI at his side. Then the clues start piling up: duplicate search results, missing products, and code that looks polished right up until the system meets the real world.
              </p>
              <p className="mt-3 font-[--font-comic] text-sm font-bold leading-relaxed text-zinc-300 md:text-base">
                Read it like a case report: follow the symptoms, inspect the evidence, and watch how verification exposes the gap between plausible code and understood systems.
              </p>
            </section>

            <section className="rounded-sm border-[4px] border-zinc-950 bg-[linear-gradient(180deg,#fff7d6_0%,#f4e3b3_100%)] p-5 text-zinc-950 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-[--font-comic-title] text-sm tracking-[0.28em] text-red-600">
                CONFIDENCE VS. UNDERSTANDING
              </p>
              <div className="mt-4 rounded-sm border-[3px] border-zinc-950 bg-white p-3">
                <svg viewBox="0 0 240 140" className="h-auto w-full" role="img" aria-labelledby="confidence-diagram-title">
                  <title id="confidence-diagram-title">Confidence versus understanding diagram</title>
                  <line x1="26" y1="12" x2="26" y2="116" stroke="#18181b" strokeWidth="3" />
                  <line x1="26" y1="116" x2="224" y2="116" stroke="#18181b" strokeWidth="3" />
                  <path d="M26 110 C48 38, 84 18, 110 34 S150 98, 224 70" fill="none" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="84" cy="28" r="7" fill="#facc15" stroke="#18181b" strokeWidth="3" />
                  <circle cx="144" cy="88" r="7" fill="#facc15" stroke="#18181b" strokeWidth="3" />
                  <circle cx="210" cy="74" r="7" fill="#facc15" stroke="#18181b" strokeWidth="3" />
                  <text x="34" y="18" fontSize="11" fontWeight="700" fill="#18181b">confidence</text>
                  <text x="162" y="132" fontSize="11" fontWeight="700" fill="#18181b">system knowledge</text>
                  <text x="52" y="20" fontSize="10" fontWeight="700" fill="#18181b">looks easy</text>
                  <text x="124" y="104" fontSize="10" fontWeight="700" fill="#18181b">hidden constraints</text>
                  <text x="172" y="58" fontSize="10" fontWeight="700" fill="#18181b">verification</text>
                </svg>
              </div>
              <p className="mt-3 font-[--font-comic] text-sm font-bold leading-relaxed md:text-base">
                The popular meme version is just a shorthand, but the feeling is familiar: confidence can surge long before real understanding arrives.
              </p>
            </section>
          </div>
        </div>
      </header>

      <main className="relative z-10 py-6 md:py-8">
        {/* PNG-backed pages — only rendered when matching artwork exists */}
        {comicPages.length > 0 && (
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:gap-8 md:px-6">
            {comicPages.map((page, i) => (
              <ComicPageView key={page.id} page={page} pageNumber={i + 1} pages={comicPages} pageIndex={i} />
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
            Danny's mistake was not using AI. It was confusing fluent output with verified knowledge.
          </p>

          <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
            <a
              href="https://github.com/voku/LLMComic"
              target="_blank"
              rel="noreferrer"
              aria-label="Read the original LLMComic project on GitHub"
              className="rounded-sm border-[4px] border-zinc-950 bg-zinc-900 p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1"
            >
              <p className="font-[--font-comic-title] text-sm tracking-[0.22em] text-red-500">ORIGINAL STORY</p>
              <p className="mt-2 font-[--font-comic] text-base font-bold text-zinc-100">
                Read the project source and original case file on GitHub.
              </p>
            </a>
            <a
              href="https://www.britannica.com/science/Dunning-Kruger-effect"
              target="_blank"
              rel="noreferrer"
              aria-label="Read a science explanation of the Dunning-Kruger effect"
              className="rounded-sm border-[4px] border-zinc-950 bg-zinc-900 p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1"
            >
              <p className="font-[--font-comic-title] text-sm tracking-[0.22em] text-red-500">SCIENCE</p>
              <p className="mt-2 font-[--font-comic] text-base font-bold text-zinc-100">
                Learn why low understanding often comes with poor self-evaluation.
              </p>
            </a>
            <a
              href="https://en.wikipedia.org/wiki/Dunning%E2%80%93Kruger_effect"
              target="_blank"
              rel="noreferrer"
              aria-label="Read more about the popular Dunning-Kruger diagram and its context"
              className="rounded-sm border-[4px] border-zinc-950 bg-zinc-900 p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1"
            >
              <p className="font-[--font-comic-title] text-sm tracking-[0.22em] text-red-500">POPULAR MEME</p>
              <p className="mt-2 font-[--font-comic] text-base font-bold text-zinc-100">
                See the broader context behind the familiar confidence-versus-knowledge diagram.
              </p>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
