import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { ComicPanel as ComicPanelType } from '../data';
import { ImageGenerator } from './ImageGenerator';

interface Props {
  panel: ComicPanelType;
  index: number;
}

export function ComicPanel({ panel, index }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imageOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-[150vh] w-full bg-zinc-950 border-b-8 border-zinc-900"
    >
      {/* Sticky Image Background */}
      <div className="absolute inset-0 z-0 clip-path-panel">
        <motion.div 
          className="sticky top-0 h-screen w-full overflow-hidden"
          style={{ opacity: imageOpacity }}
        >
          <motion.div style={{ scale: imageScale, y: imageY, width: '100%', height: '100%' }}>
            <ImageGenerator 
              panelId={panel.id}
              prompt={panel.imagePrompt || ''}
              fallbackSeed={panel.imageSeed}
              className="w-full h-full object-cover"
            />
          </motion.div>
          {/* Noir/Comic Filter Overlay - Lightened to let image pop */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-90 pointer-events-none" />
          
          {/* Halftone pattern effect (subtle) */}
          <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '4px 4px'
          }} />
        </motion.div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-8 items-end py-32 md:py-48 min-h-[150vh] justify-end pb-32">
        
        {/* Title Section (if exists) */}
        {panel.title && (
          <motion.div 
            className="absolute top-32 left-6 md:left-12 z-20 max-w-sm"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-20%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="bg-red-600 text-white px-6 py-4 border-4 border-zinc-950 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
              <h2 className="font-serif text-3xl md:text-4xl font-black uppercase tracking-wider leading-tight">
                {panel.title}
              </h2>
            </div>
          </motion.div>
        )}

        {/* Text Blocks */}
        <div className="flex flex-col gap-8 w-full max-w-xl ml-auto mt-auto">
          {panel.textBlocks.map((text, i) => {
            // Create a staggered parallax effect for each text block
            const blockY = useTransform(
              scrollYProgress, 
              [0.2, 0.8], 
              [20 + (i * 20), -20 - (i * 20)]
            );

            return (
              <motion.div
                key={i}
                style={{ y: blockY }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, margin: "-10%" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-yellow-50 text-zinc-950 p-5 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-zinc-950 relative"
              >
                {/* Comic speech bubble tail (only on the first block) */}
                {i === 0 && (
                  <>
                    <div className="absolute -left-4 top-6 w-0 h-0 border-t-[12px] border-t-transparent border-r-[16px] border-r-yellow-50 border-b-[12px] border-b-transparent z-10" />
                    <div className="absolute -left-6 top-[20px] w-0 h-0 border-t-[16px] border-t-transparent border-r-[20px] border-r-zinc-950 border-b-[16px] border-b-transparent z-0" />
                  </>
                )}
                
                <p className="font-sans text-lg md:text-xl leading-snug font-semibold">
                  {text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
