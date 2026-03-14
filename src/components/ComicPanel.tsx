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
            panelId={panel.id}
            prompt={panel.imagePrompt || ''}
            fallbackSeed={panel.imageSeed}
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
        <div className="flex flex-col gap-2">
          {panel.textBlocks.map((text, i) => (
            <motion.div
              key={i}
              className="bg-yellow-50 text-zinc-950 px-4 py-2 border-4 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              {/* Speech-bubble tail on the first block */}
              {i === 0 && (
                <>
                  <div className="absolute -left-3 top-4 w-0 h-0 border-t-[8px] border-t-transparent border-r-[12px] border-r-yellow-50 border-b-[8px] border-b-transparent z-10" />
                  <div className="absolute -left-[22px] top-[12px] w-0 h-0 border-t-[12px] border-t-transparent border-r-[16px] border-r-zinc-950 border-b-[12px] border-b-transparent z-0" />
                </>
              )}
              <p className="font-sans text-sm md:text-base leading-snug font-semibold">
                {text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
