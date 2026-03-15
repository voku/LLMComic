import { motion, useScroll, useTransform } from 'motion/react';
import { useMemo, useRef } from 'react';
import { ComicPanel as ComicPanelType } from '../data';
import { ImageGenerator } from './ImageGenerator';

interface Props {
  panel: ComicPanelType;
  index: number;
  /** When true the panel spans both columns in the comic grid */
  featured?: boolean;
}

const DEFAULT_MAX_CHARS_PER_LINE = 26;
const BASE_IMAGE_HEIGHT = 220;
const BASE_LINE_COUNT = 2;
const LINE_HEIGHT_INCREMENT = 44;
const TEXT_START_Y = 108;
const TEXT_LINE_SPACING = 42;
const CARD_WIDTH = 1200;
const CARD_PADDING = 44;
const ILLUSTRATION_WIDTH = 320;
const ILLUSTRATION_TOP = 116;
const ILLUSTRATION_BOTTOM_GAP = 96;
const TEXT_GAP = 40;
const TEXT_PANEL_EXTRA_RIGHT_PADDING = 44;
const MAX_CHARS_WITH_RIGHT_ILLUSTRATION = 19;
const MAX_CHARS_WITH_LEFT_ILLUSTRATION = 18;
const HEADER_WIDTH = 300;
const MAX_NARRATIVE_IMAGE_HEIGHT = 420;
const DECORATIVE_BAR_WIDTH = 104;
const DECORATIVE_BAR_HEIGHT = 8;
const DECORATIVE_BAR_OFFSET = 18;
const DECORATIVE_CIRCLE_OFFSET = 24;
const DECORATIVE_CIRCLE_Y = 134;
const DECORATIVE_CIRCLE_RADIUS = 11;
const TEXT_PANEL_TOP = 112;
const TEXT_PANEL_INSET = 18;
const TEXT_PANEL_MIN_HEIGHT = 88;
const TEXT_PANEL_RADIUS = 26;

type NarrativeScene =
  | 'code'
  | 'city'
  | 'factory'
  | 'network'
  | 'structure'
  | 'surveillance'
  | 'detective';

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function wrapComicText(text: string, maxCharsPerLine = DEFAULT_MAX_CHARS_PER_LINE) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = '';

  for (const rawWord of words) {
    let word = rawWord;

    while (word.length > maxCharsPerLine) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = '';
      }

      lines.push(word.slice(0, maxCharsPerLine));
      word = word.slice(maxCharsPerLine);
    }

    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (nextLine.length <= maxCharsPerLine || !currentLine) {
      currentLine = nextLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function pickNarrativeScene(panel: ComicPanelType, text: string): NarrativeScene {
  const source = `${panel.title ?? ''} ${panel.imageAlt ?? ''} ${text}`.toLowerCase();

  if (/robot|eye|warning|scan|analysis|interrogate/.test(source)) {
    return 'surveillance';
  }

  if (/factory|assembly|conveyor|apps|cheap/.test(source)) {
    return 'factory';
  }

  if (/city|marketplace|buildings|skyline|street/.test(source)) {
    return 'city';
  }

  if (/path|workflow|nodes|architecture|system|network|web/.test(source)) {
    return 'network';
  }

  if (/building|house|foundation|facade|crumbling|tower|blueprint/.test(source)) {
    return 'structure';
  }

  if (/code|search|tests|monitor|screen|keyboard|magnifying/.test(source)) {
    return 'code';
  }

  return 'detective';
}

function renderNarrativeScene(scene: NarrativeScene, width: number, height: number) {
  const midX = width / 2;
  const midY = height / 2;
  const lowerY = height - 46;

  switch (scene) {
    case 'code':
      return {
        label: 'EVIDENCE',
        accent: '#22c55e',
        markup: `
          <rect x="26" y="26" width="${width - 52}" height="${height - 52}" rx="24" fill="#0f172a" stroke="#22c55e" stroke-width="8" />
          <rect x="58" y="54" width="${width - 116}" height="${height - 124}" rx="20" fill="#111827" />
          <circle cx="${midX + 26}" cy="${midY - 8}" r="72" fill="none" stroke="#fef08a" stroke-width="18" />
          <path d="M${midX + 70} ${midY + 44} L${width - 42} ${lowerY}" stroke="#fef08a" stroke-width="18" stroke-linecap="round" />
          <rect x="84" y="86" width="${width - 168}" height="18" rx="9" fill="#22c55e" fill-opacity="0.8" />
          <rect x="84" y="124" width="${width - 210}" height="14" rx="7" fill="#93c5fd" fill-opacity="0.9" />
          <rect x="84" y="154" width="${width - 188}" height="14" rx="7" fill="#93c5fd" fill-opacity="0.7" />
          <rect x="84" y="184" width="${width - 234}" height="14" rx="7" fill="#93c5fd" fill-opacity="0.65" />
          <rect x="84" y="${height - 116}" width="${width - 184}" height="14" rx="7" fill="#22c55e" fill-opacity="0.8" />
          <rect x="84" y="${height - 86}" width="${width - 226}" height="14" rx="7" fill="#93c5fd" fill-opacity="0.7" />
        `,
      };
    case 'city':
      return {
        label: 'CITY FILE',
        accent: '#a855f7',
        markup: `
          <rect x="22" y="22" width="${width - 44}" height="${height - 44}" rx="24" fill="#111827" stroke="#a855f7" stroke-width="8" />
          <circle cx="${width - 82}" cy="82" r="34" fill="#fde047" fill-opacity="0.95" />
          <path d="M0 ${height - 98} C70 ${height - 160}, 140 ${height - 144}, 220 ${height - 118} S${width} ${height - 130}, ${width} ${height - 98} L${width} ${height} L0 ${height} Z" fill="#1f2937" />
          <rect x="42" y="${height - 214}" width="56" height="116" fill="#0f172a" />
          <rect x="106" y="${height - 248}" width="72" height="150" fill="#1d4ed8" fill-opacity="0.55" />
          <rect x="186" y="${height - 194}" width="44" height="96" fill="#0f172a" />
          <rect x="238" y="${height - 274}" width="58" height="176" fill="#312e81" fill-opacity="0.75" />
          <rect x="48" y="${height - 192}" width="8" height="8" fill="#fef08a" />
          <rect x="64" y="${height - 192}" width="8" height="8" fill="#fef08a" />
          <rect x="112" y="${height - 214}" width="10" height="10" fill="#fef08a" />
          <rect x="132" y="${height - 214}" width="10" height="10" fill="#fef08a" />
          <rect x="252" y="${height - 236}" width="10" height="10" fill="#fef08a" />
          <rect x="272" y="${height - 236}" width="10" height="10" fill="#fef08a" />
        `,
      };
    case 'factory':
      return {
        label: 'PRODUCTION',
        accent: '#f97316',
        markup: `
          <rect x="22" y="22" width="${width - 44}" height="${height - 44}" rx="24" fill="#1c1917" stroke="#f97316" stroke-width="8" />
          <path d="M18 ${height - 82} H${width - 18}" stroke="#fef08a" stroke-width="20" stroke-linecap="round" />
          <path d="M60 64 V${height - 118} H${width - 60}" stroke="#fb923c" stroke-width="14" fill="none" stroke-linecap="round" />
          <rect x="58" y="${height - 156}" width="64" height="48" rx="12" fill="#fef08a" />
          <rect x="${midX - 30}" y="${height - 176}" width="84" height="58" rx="12" fill="#fdba74" />
          <rect x="${width - 130}" y="${height - 156}" width="64" height="48" rx="12" fill="#fef08a" />
          <circle cx="94" cy="${height - 82}" r="18" fill="#111827" />
          <circle cx="${midX + 10}" cy="${height - 82}" r="18" fill="#111827" />
          <circle cx="${width - 98}" cy="${height - 82}" r="18" fill="#111827" />
        `,
      };
    case 'network':
      return {
        label: 'SYSTEM MAP',
        accent: '#38bdf8',
        markup: `
          <rect x="22" y="22" width="${width - 44}" height="${height - 44}" rx="24" fill="#082f49" stroke="#38bdf8" stroke-width="8" />
          <path d="M60 ${height - 70} C120 ${height - 126}, 154 ${height - 152}, ${midX} ${midY} S${width - 120} 116, ${width - 66} 76" fill="none" stroke="#fde047" stroke-width="18" stroke-linecap="round" />
          <circle cx="64" cy="${height - 74}" r="24" fill="#38bdf8" />
          <circle cx="${midX - 16}" cy="${midY + 18}" r="28" fill="#22c55e" />
          <circle cx="${width - 72}" cy="80" r="22" fill="#f97316" />
          <circle cx="136" cy="${midY - 8}" r="18" fill="#e879f9" />
          <circle cx="${width - 138}" cy="${midY + 52}" r="18" fill="#e879f9" />
          <path d="M136 ${midY - 8} L${midX - 16} ${midY + 18} L${width - 138} ${midY + 52}" stroke="#bae6fd" stroke-width="10" fill="none" stroke-linecap="round" />
        `,
      };
    case 'structure':
      return {
        label: 'STRUCTURE',
        accent: '#ef4444',
        markup: `
          <rect x="22" y="22" width="${width - 44}" height="${height - 44}" rx="24" fill="#1f2937" stroke="#ef4444" stroke-width="8" />
          <rect x="86" y="64" width="${width - 172}" height="${height - 160}" rx="18" fill="#334155" />
          <rect x="${midX - 36}" y="${height - 164}" width="72" height="68" fill="#475569" />
          <path d="M${midX} 64 V${height - 96} M${midX - 74} ${midY} H${midX + 74}" stroke="#94a3b8" stroke-width="10" stroke-linecap="round" />
          <path d="M${midX - 28} ${height - 120} L${midX - 4} ${height - 84} L${midX + 20} ${height - 132} L${midX + 44} ${height - 88}" stroke="#fef08a" stroke-width="10" stroke-linecap="round" fill="none" />
          <path d="M80 ${height - 64} L${width - 80} ${height - 64}" stroke="#ef4444" stroke-width="12" stroke-linecap="round" />
        `,
      };
    case 'surveillance':
      return {
        label: 'WARNING',
        accent: '#fb7185',
        markup: `
          <rect x="22" y="22" width="${width - 44}" height="${height - 44}" rx="24" fill="#09090b" stroke="#fb7185" stroke-width="8" />
          <path d="M56 ${midY} C106 ${midY - 62}, ${width - 106} ${midY - 62}, ${width - 56} ${midY} C${width - 106} ${midY + 62}, 106 ${midY + 62}, 56 ${midY} Z" fill="#111827" stroke="#fda4af" stroke-width="10" />
          <circle cx="${midX}" cy="${midY}" r="58" fill="#ef4444" />
          <circle cx="${midX}" cy="${midY}" r="24" fill="#020617" />
          <path d="M${midX + 68} ${midY + 68} L${width - 54} ${height - 48}" stroke="#fb7185" stroke-width="16" stroke-linecap="round" />
          <path d="M82 76 L124 118 L82 160" stroke="#fde047" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M${width - 82} 76 L${width - 124} 118 L${width - 82} 160" stroke="#fde047" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        `,
      };
    default:
      return {
        label: 'CASE NOTE',
        accent: '#facc15',
        markup: `
          <rect x="22" y="22" width="${width - 44}" height="${height - 44}" rx="24" fill="#111827" stroke="#facc15" stroke-width="8" />
          <circle cx="${midX}" cy="92" r="28" fill="#fef08a" />
          <path d="M${midX - 30} 136 H${midX + 30}" stroke="#fef08a" stroke-width="12" stroke-linecap="round" />
          <path d="M${midX} 136 V${height - 132}" stroke="#fef08a" stroke-width="14" stroke-linecap="round" />
          <path d="M${midX} ${midY} L${midX - 74} ${height - 64}" stroke="#fef08a" stroke-width="12" stroke-linecap="round" />
          <path d="M${midX} ${midY} L${midX + 74} ${height - 64}" stroke="#fef08a" stroke-width="12" stroke-linecap="round" />
          <rect x="62" y="${height - 86}" width="${width - 124}" height="18" rx="9" fill="#ef4444" fill-opacity="0.85" />
        `,
      };
  }
}

function createNarrativeImage(panel: ComicPanelType, text: string, blockIndex: number) {
  const scene = pickNarrativeScene(panel, text);
  const artOnLeft = blockIndex % 2 === 1;
  const textStartX = artOnLeft ? CARD_PADDING + ILLUSTRATION_WIDTH + TEXT_GAP : 72;
  const textWidth = CARD_WIDTH - ILLUSTRATION_WIDTH - CARD_PADDING * 2 - TEXT_GAP - TEXT_PANEL_EXTRA_RIGHT_PADDING;
  const maxCharsPerLine = artOnLeft ? MAX_CHARS_WITH_LEFT_ILLUSTRATION : MAX_CHARS_WITH_RIGHT_ILLUSTRATION;
  const lines = wrapComicText(text, maxCharsPerLine);
  const imageHeight = Math.max(
    BASE_IMAGE_HEIGHT,
    Math.min(
      BASE_IMAGE_HEIGHT + Math.max(0, lines.length - BASE_LINE_COUNT) * LINE_HEIGHT_INCREMENT,
      MAX_NARRATIVE_IMAGE_HEIGHT,
    ),
  );
  const context = [panel.title, panel.imageAlt].filter(Boolean).join(' • ');
  const description = `${context ? `${context}. ` : ''}${text}`;
  const footerText = context || 'Comic panel narration';
  const idPrefix = `${panel.id}-${blockIndex}`;
  const gradientId = `${idPrefix}-bg`;
  const patternId = `${idPrefix}-dots`;
  const titleId = `${idPrefix}-title`;
  const descriptionId = `${idPrefix}-desc`;
  const cardTitle = context ? `${context} — ${text}` : text;
  const illustrationHeight = imageHeight - ILLUSTRATION_TOP - ILLUSTRATION_BOTTOM_GAP;
  const illustrationX = artOnLeft ? CARD_PADDING : CARD_WIDTH - ILLUSTRATION_WIDTH - CARD_PADDING;
  const illustrationFrame = renderNarrativeScene(scene, ILLUSTRATION_WIDTH, illustrationHeight);
  const lineMarkup = lines
    .map((line, lineIndex) => {
      const y = TEXT_START_Y + lineIndex * TEXT_LINE_SPACING;
      return `<tspan x="${textStartX}" y="${y}">${escapeSvgText(line)}</tspan>`;
    })
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 ${imageHeight}" role="img" aria-labelledby="${titleId} ${descriptionId}">
      <title id="${titleId}">${escapeSvgText(cardTitle)}</title>
      <desc id="${descriptionId}">${escapeSvgText(description)}</desc>
      <defs>
        <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="55%" stop-color="#fde047" />
          <stop offset="100%" stop-color="#f97316" />
        </linearGradient>
        <pattern id="${patternId}" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="2" fill="#111827" fill-opacity="0.18" />
        </pattern>
      </defs>

      <rect width="${CARD_WIDTH}" height="${imageHeight}" fill="#09090b" rx="20" />
      <rect x="18" y="18" width="${CARD_WIDTH - 36}" height="${imageHeight - 36}" rx="14" fill="url(#${gradientId})" />
      <rect x="18" y="18" width="${CARD_WIDTH - 36}" height="${imageHeight - 36}" rx="14" fill="url(#${patternId})" />
      <rect x="${illustrationX - 8}" y="${ILLUSTRATION_TOP - 8}" width="${ILLUSTRATION_WIDTH + 16}" height="${illustrationHeight + 16}" rx="28" fill="#09090b" fill-opacity="0.28" />
      <g transform="translate(${illustrationX}, ${ILLUSTRATION_TOP})">
        ${illustrationFrame.markup}
      </g>
      <rect x="44" y="40" width="${HEADER_WIDTH}" height="54" rx="6" fill="#dc2626" stroke="#09090b" stroke-width="8" />
      <text x="72" y="76" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="800" letter-spacing="3">
        ${escapeSvgText(illustrationFrame.label)}
      </text>
      <rect
        x="${textStartX}"
        y="${TEXT_PANEL_TOP}"
        width="${textWidth}"
        height="${Math.max(illustrationHeight - TEXT_PANEL_INSET, TEXT_PANEL_MIN_HEIGHT)}"
        rx="${TEXT_PANEL_RADIUS}"
        fill="#fff7ed"
        fill-opacity="0.7"
      />
      <rect
        x="${textStartX + DECORATIVE_BAR_OFFSET}"
        y="130"
        width="${DECORATIVE_BAR_WIDTH}"
        height="${DECORATIVE_BAR_HEIGHT}"
        rx="4"
        fill="${illustrationFrame.accent}"
        fill-opacity="0.8"
      />
      <circle
        cx="${textStartX + textWidth - DECORATIVE_CIRCLE_OFFSET}"
        cy="${DECORATIVE_CIRCLE_Y}"
        r="${DECORATIVE_CIRCLE_RADIUS}"
        fill="${illustrationFrame.accent}"
        fill-opacity="0.85"
      />
      <text fill="#111827" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="800">
        ${lineMarkup}
      </text>
      <text x="${textStartX}" y="${imageHeight - 82}" fill="#111827" fill-opacity="0.72" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">
        ${escapeSvgText(footerText)}
      </text>
      <text x="${CARD_WIDTH - 112}" y="${imageHeight - 82}" fill="${illustrationFrame.accent}" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="800">
        ${String(blockIndex + 1).padStart(2, '0')}
      </text>
      <rect x="44" y="${imageHeight - 62}" width="${CARD_WIDTH - 88}" height="10" rx="5" fill="#111827" fill-opacity="0.24" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function ComicPanel({ panel, index, featured = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const narrativeCards = useMemo(
    () =>
      panel.textBlocks.map((text, blockIndex) => ({
        text,
        alt: [panel.title, panel.imageAlt, text].filter(Boolean).join('. '),
        src: createNarrativeImage(panel, text, blockIndex),
      })),
    [panel],
  );
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Subtle parallax on the background image
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden bg-zinc-900 ${featured ? 'md:col-span-2' : ''}`}
      style={{ minHeight: featured ? '420px' : '360px' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
    >
      {/* Background image with subtle parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ scale: imageScale, y: imageY }}
        >
          <ImageGenerator
            imageId={panel.id}
            alt={panel.imageAlt}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Noir gradient — darkens bottom so text is always readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/40 to-zinc-950/10 pointer-events-none" />

        {/* Halftone dot-pattern overlay (subtle noir texture) */}
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }}
        />
      </div>

      {/* Panel content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-4 md:p-5" style={{ minHeight: 'inherit' }}>
        {/* Title banner */}
        {panel.title && (
          <motion.div
            className="self-start mb-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-5%' }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-red-600 text-white px-4 py-2 border-4 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 inline-block">
              <h2 className="font-serif text-xl md:text-2xl font-black uppercase tracking-wider leading-tight">
                {panel.title}
              </h2>
            </div>
          </motion.div>
        )}

        {/* Spacer pushes caption boxes to the bottom */}
        <div className="flex-1" />

        {/* Caption / speech-bubble boxes */}
        <div className="flex flex-col gap-3">
          {narrativeCards.map((card, i) => (
            <motion.div
              key={i}
              className="shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <img
                src={card.src}
                alt={card.alt}
                className="block w-full h-auto"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
