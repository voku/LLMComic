import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { ComicPanel as ComicPanelType } from '../data';
import { ImageGenerator } from './ImageGenerator';

interface Props {
  panel: ComicPanelType;
  index: number;
  /** When true the panel spans both columns in the comic grid */
  featured?: boolean;
}

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function wrapComicText(text: string, maxCharsPerLine = 26) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (nextLine.length <= maxCharsPerLine || currentLine.length === 0) {
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

function createNarrativeImage(panel: ComicPanelType, text: string, blockIndex: number) {
  const lines = wrapComicText(text);
  const imageHeight = 220 + Math.max(0, lines.length - 2) * 44;
  const context = [panel.title, panel.imageAlt].filter(Boolean).join(' • ');
  const lineMarkup = lines
    .map((line, lineIndex) => {
      const y = 108 + lineIndex * 42;
      return `<tspan x="72" y="${y}">${escapeSvgText(line)}</tspan>`;
    })
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 ${imageHeight}" role="img" aria-labelledby="title desc">
      <title id="title">${escapeSvgText(`Narrative card ${blockIndex + 1}`)}</title>
      <desc id="desc">${escapeSvgText(`${context}. ${text}`)}</desc>
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="55%" stop-color="#fde047" />
          <stop offset="100%" stop-color="#f97316" />
        </linearGradient>
        <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="2" fill="#111827" fill-opacity="0.18" />
        </pattern>
      </defs>

      <rect width="1200" height="${imageHeight}" fill="#09090b" rx="20" />
      <rect x="18" y="18" width="1164" height="${imageHeight - 36}" rx="14" fill="url(#bg)" />
      <rect x="18" y="18" width="1164" height="${imageHeight - 36}" rx="14" fill="url(#dots)" />
      <rect x="44" y="40" width="250" height="54" rx="6" fill="#dc2626" stroke="#09090b" stroke-width="8" />
      <text x="72" y="76" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="800" letter-spacing="3">
        NARRATION
      </text>
      <text fill="#111827" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="800">
        ${lineMarkup}
      </text>
      <rect x="44" y="${imageHeight - 62}" width="1112" height="10" rx="5" fill="#111827" fill-opacity="0.24" />
      <text x="72" y="${imageHeight - 82}" fill="#111827" fill-opacity="0.72" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">
        ${escapeSvgText(context || panel.id)}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function ComicPanel({ panel, index, featured = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
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
          {panel.textBlocks.map((text, i) => (
            <motion.div
              key={i}
              className="shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <img
                src={createNarrativeImage(panel, text, i)}
                alt={[panel.title, panel.imageAlt, text].filter(Boolean).join('. ')}
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
