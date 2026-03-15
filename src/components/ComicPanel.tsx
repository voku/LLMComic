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

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden bg-zinc-900 ${featured ? 'md:col-span-2' : ''}`}
      style={{ minHeight: featured ? '480px' : '400px' }}
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

        {/* Lighter gradient — lets the art breathe */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent pointer-events-none" />

        {/* Halftone dot-pattern overlay (comic texture) */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '6px 6px',
          }}
        />
      </div>

      {/* Panel content */}
      <div className="relative z-10 flex flex-col h-full p-3 md:p-4" style={{ minHeight: 'inherit' }}>
        {/* Title banner — comic caption style */}
        {panel.title && (
          <motion.div
            className="self-start mb-auto"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-5%' }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="bg-yellow-300 text-zinc-950 px-4 py-1.5 border-[3px] border-zinc-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] inline-block"
            >
              <h2 className="font-[--font-comic-title] text-xl md:text-2xl tracking-wide leading-tight">
                {panel.title}
              </h2>
            </div>
          </motion.div>
        )}

        {/* Spacer pushes narration boxes to the bottom */}
        <div className="flex-1 min-h-8" />

        {/* Narration boxes — classic comic caption boxes */}
        <div className="flex flex-col gap-2 max-w-[90%]">
          {panel.textBlocks.map((text, i) => (
            <motion.div
              key={i}
              className={`
                bg-amber-50 text-zinc-900 border-[3px] border-zinc-950
                shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                px-4 py-2.5
                ${i % 2 === 0 ? 'self-start' : 'self-end'}
              `}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
            >
              <p className="font-[--font-comic] text-sm md:text-base font-bold leading-snug">
                {text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
