import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useCallback, useRef, useState } from 'react';
import { ComicPanel as ComicPanelType } from '../data';
import { ImageGenerator } from './ImageGenerator';

interface Props {
  panel: ComicPanelType;
  index: number;
  /** When true the panel spans both columns in the comic grid */
  featured?: boolean;
}

/**
 * A single comic panel that reveals one narration bubble at a time.
 * Click / tap the panel to advance through the story text — each click
 * replaces the current bubble with the next one, like turning pages.
 */
export function ComicPanel({ panel, index, featured = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const total = panel.textBlocks.length;
  const [currentIdx, setCurrentIdx] = useState(0);
  const allRevealed = currentIdx >= total - 1;

  const advance = useCallback(() => {
    if (!allRevealed) setCurrentIdx((c) => Math.min(c + 1, total - 1));
  }, [allRevealed, total]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  /* Alternate bubble placement for visual variety */
  const isTop = currentIdx % 2 === 0;
  const isLeft = currentIdx < 2;

  return (
    <motion.div
      ref={containerRef}
      className="relative overflow-hidden bg-zinc-900 cursor-pointer select-none group"
      style={{ minHeight: featured ? '520px' : '420px' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
      onClick={advance}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') advance();
      }}
      aria-label={allRevealed ? panel.title ?? 'Comic panel' : 'Click to continue reading'}
    >
      {/* ── Background image with parallax ─────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: imageScale, y: imageY }}>
          <ImageGenerator
            imageId={panel.id}
            alt={panel.imageAlt}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Very light vignette — lets the art dominate */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/30 via-transparent to-zinc-950/40 pointer-events-none" />

        {/* Halftone dot-pattern overlay (comic texture) */}
        <div
          className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '6px 6px',
          }}
        />
      </div>

      {/* ── Panel content ──────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col h-full p-3 md:p-4" style={{ minHeight: 'inherit' }}>
        {/* Title banner */}
        {panel.title && (
          <motion.div
            className="self-start z-20"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-5%' }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-yellow-300 text-zinc-950 px-4 py-1.5 border-[3px] border-zinc-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] inline-block">
              <h2 className="font-[--font-comic-title] text-xl md:text-2xl tracking-wide leading-tight">
                {panel.title}
              </h2>
            </div>
          </motion.div>
        )}

        {/* Speech bubble area — takes most of the panel */}
        <div className="flex-1 relative min-h-0 flex items-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              className={`z-20 max-w-[80%] md:max-w-[65%]
                ${isTop ? 'self-start' : 'self-end'}
                ${isLeft ? 'mr-auto' : 'ml-auto'}
              `}
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              transition={{ duration: 0.25, type: 'spring', stiffness: 400, damping: 30 }}
            >
              {/* Bubble */}
              <div className="relative">
                <div className="bg-white text-zinc-900 border-[3px] border-zinc-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-4 py-2.5 rounded-2xl">
                  <p className="font-[--font-comic] text-sm md:text-base font-bold leading-snug">
                    {panel.textBlocks[currentIdx]}
                  </p>
                </div>
                {/* Speech bubble tail */}
                <div className={`absolute w-0 h-0 ${
                  isLeft ? 'left-6' : 'right-6'
                } -bottom-3 border-l-[10px] border-r-[10px] border-t-[14px] border-l-transparent border-r-transparent border-t-zinc-950`} />
                <div className={`absolute w-0 h-0 ${
                  isLeft ? 'left-[26px]' : 'right-[26px]'
                } -bottom-[9px] border-l-[8px] border-r-[8px] border-t-[11px] border-l-transparent border-r-transparent border-t-white`} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom bar: progress dots + click hint */}
        <div className="flex items-center justify-between pt-2 z-20">
          {/* Progress dots */}
          <div className="flex gap-1.5">
            {panel.textBlocks.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full border-2 border-zinc-950 transition-colors duration-300 ${
                  i <= currentIdx ? 'bg-yellow-300' : 'bg-zinc-800/60'
                }`}
              />
            ))}
          </div>

          {/* Click hint */}
          {!allRevealed && (
            <motion.div
              className="flex items-center gap-1.5 bg-zinc-950/70 backdrop-blur-sm text-zinc-300 text-xs md:text-sm font-[--font-comic] font-bold px-3 py-1 rounded-full border border-zinc-700"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span>TAP</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
              </svg>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
