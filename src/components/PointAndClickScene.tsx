import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ComicPanel, ActionVerb, Hotspot } from '../data';
import { ImageGenerator } from './ImageGenerator';

const VERBS: ActionVerb[] = ['Inspect', 'Analyze', 'Interrogate'];

function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
}

export function PointAndClickScene({ panel }: { panel: ComicPanel }) {
  const [activeVerb, setActiveVerb] = useState<ActionVerb>('Inspect');
  const [message, setMessage] = useState(panel.textBlocks[0] || "Select an action and investigate the scene.");
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [discovered, setDiscovered] = useState<Set<string>>(new Set());
  const totalHotspots = panel.hotspots?.length ?? 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.3, 0.3, 0]);

  const handleHotspotClick = (hotspot: Hotspot) => {
    const response = hotspot.interactions[activeVerb];
    if (response) {
      setMessage(response);
      setDiscovered(prev => new Set(prev).add(hotspot.id));
    } else {
      setMessage(`I can't ${activeVerb.toLowerCase()} that.`);
    }
  };

  const discoveredCount = discovered.size;

  return (
    <div ref={containerRef} className="w-full bg-zinc-950 flex flex-col items-center py-12 md:py-20 px-4 md:px-12 relative z-20 overflow-hidden">

      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ opacity: bgOpacity, y: bgY }}
      >
        <ImageGenerator
          imageId={`${panel.id}-bg`}
          alt={`${panel.imageAlt} background texture`}
          className="w-full h-full object-cover blur-sm"
        />
        <div className="absolute inset-0 bg-zinc-950/80 mix-blend-multiply" />
      </motion.div>

      {/* Title */}
      {panel.title && (
        <div className="mb-6 w-full max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-10%" }}
            className="bg-red-600 inline-block text-white px-6 py-2.5 border-[3px] border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm"
          >
            <h2 className="font-[--font-comic-title] text-2xl md:text-3xl tracking-wide flex items-center gap-3">
              <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              {panel.title}
            </h2>
          </motion.div>
          {/* Discovery counter */}
          <div className="mt-3 flex items-center gap-2">
            {Array.from({ length: totalHotspots }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full border-2 border-zinc-600 transition-colors duration-500 ${
                  i < discoveredCount ? 'bg-yellow-400 border-yellow-400' : 'bg-zinc-800'
                }`}
              />
            ))}
            <span className="text-zinc-500 text-xs font-[--font-comic] ml-1">
              {discoveredCount}/{totalHotspots} clues found
            </span>
          </div>
        </div>
      )}

      {/* Game Screen Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, margin: "-10%" }}
        transition={{ duration: 0.5 }}
        className="flex flex-col w-full max-w-5xl border-[3px] border-zinc-950 overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-zinc-900 relative z-10 rounded-sm"
      >

        {/* Viewport */}
        <div className="relative w-full aspect-video bg-black overflow-hidden cursor-crosshair group">
          <div className="w-full h-full opacity-60 group-hover:opacity-75 transition-opacity duration-500">
            <ImageGenerator
              imageId={panel.id}
              alt={panel.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          {/* CRT Scanline Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.02),rgba(0,0,255,0.04))] bg-[length:100%_4px,3px_100%] pointer-events-none" />

          {/* Hotspots */}
          {panel.hotspots?.map(hotspot => {
            const isDiscovered = discovered.has(hotspot.id);
            return (
              <div
                key={hotspot.id}
                className={`absolute transition-all duration-300 rounded-sm ${
                  isDiscovered
                    ? 'border-2 border-yellow-400/50 bg-yellow-400/10'
                    : 'border-2 border-dashed border-white/20 bg-white/5 hover:border-red-400/80 hover:bg-red-400/15'
                }`}
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  width: `${hotspot.width}%`,
                  height: `${hotspot.height}%`,
                }}
                onMouseEnter={() => setHoveredHotspot(hotspot.label)}
                onMouseLeave={() => setHoveredHotspot(null)}
                onClick={() => handleHotspotClick(hotspot)}
              >
                {/* Label on hover */}
                <AnimatePresence>
                  {hoveredHotspot === hotspot.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-950/90 text-white text-xs font-[--font-comic] font-bold px-2 py-1 rounded whitespace-nowrap border border-zinc-700"
                    >
                      {hotspot.label}
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Pulsing indicator for undiscovered hotspots */}
                {!isDiscovered && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-ping opacity-40" />
                    <div className="absolute w-2 h-2 bg-white rounded-full opacity-80" />
                  </div>
                )}
                {/* Checkmark for discovered */}
                {isDiscovered && (
                  <div className="absolute top-1 right-1">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-zinc-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Status Bar — overlaid on bottom of viewport */}
          <div className="absolute bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-sm text-zinc-400 px-4 py-2 font-[--font-comic] text-sm flex items-center h-10">
            {hoveredHotspot ? (
              <span className="text-red-400 font-bold">
                {activeVerb} → <span className="text-white">{hoveredHotspot}</span>
              </span>
            ) : (
              <span className="opacity-50 font-bold">Click hotspots to investigate...</span>
            )}
          </div>
        </div>

        {/* Control Panel */}
        <div className="flex flex-col md:flex-row bg-zinc-900 border-t-[3px] border-zinc-950">
          {/* Verbs */}
          <div className="w-full md:w-auto p-3 md:p-4 flex md:flex-col gap-2 border-b-[3px] md:border-b-0 md:border-r-[3px] border-zinc-950 bg-zinc-950">
            {VERBS.map(verb => (
              <button
                key={verb}
                onClick={() => setActiveVerb(verb)}
                className={`font-[--font-comic-title] text-base md:text-lg tracking-wider py-2 px-4 border-2 transition-all text-center md:text-left rounded-sm flex-1 md:flex-none ${
                  activeVerb === verb
                    ? 'bg-red-600 border-red-600 text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] translate-x-0.5 -translate-y-0.5'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 hover:border-zinc-500'
                }`}
              >
                {verb}
              </button>
            ))}
          </div>

          {/* Dialogue Box */}
          <div className="w-full p-4 md:p-5 flex items-start bg-zinc-900 relative min-h-[100px] md:min-h-[120px]">
            <div className="absolute top-3 left-3 w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            {/* Speech bubble for dialogue */}
            <div className="ml-4 bg-white text-zinc-900 border-[3px] border-zinc-950 rounded-2xl px-4 py-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative max-w-full">
              <p className="font-[--font-comic] text-base md:text-lg leading-relaxed font-bold">
                <TypewriterText text={message} />
              </p>
              {/* Tail pointing left */}
              <div className="absolute left-0 top-4 -ml-3 w-0 h-0 border-t-[8px] border-b-[8px] border-r-[14px] border-t-transparent border-b-transparent border-r-zinc-950" />
              <div className="absolute left-0 top-[17px] -ml-[9px] w-0 h-0 border-t-[6px] border-b-[6px] border-r-[11px] border-t-transparent border-b-transparent border-r-white" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
