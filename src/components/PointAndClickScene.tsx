import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
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
    }, 25); // Typing speed

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
}

export function PointAndClickScene({ panel }: { panel: ComicPanel }) {
  const [activeVerb, setActiveVerb] = useState<ActionVerb>('Inspect');
  const [message, setMessage] = useState(panel.textBlocks[0] || "Select an action and investigate the scene.");
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [discovered, setDiscovered] = useState<Set<string>>(new Set());

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

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-zinc-950 flex flex-col items-center justify-center py-24 px-4 md:px-12 relative z-20 border-b-8 border-zinc-900 overflow-hidden">
      
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
        <div className="mb-8 w-full max-w-5xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-10%" }}
            className="bg-yellow-300 inline-block text-zinc-950 px-6 py-3 border-[3px] border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <h2 className="font-[--font-comic-title] text-2xl md:text-3xl tracking-wide">
              Interactive Scene: {panel.title}
            </h2>
          </motion.div>
        </div>
      )}

      {/* Game Screen Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, margin: "-10%" }}
        transition={{ duration: 0.5 }}
        className="flex flex-col w-full max-w-5xl border-4 border-zinc-800 rounded-sm overflow-hidden shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] bg-zinc-900 relative z-10"
      >
        
        {/* Viewport */}
        <div className="relative w-full aspect-video bg-black overflow-hidden cursor-crosshair group">
          <div className="w-full h-full opacity-50 group-hover:opacity-60 transition-opacity duration-500">
            <ImageGenerator 
              imageId={panel.id}
              alt={panel.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          {/* CRT Scanline Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
          
          {/* Hotspots */}
          {panel.hotspots?.map(hotspot => {
            const isDiscovered = discovered.has(hotspot.id);
            return (
              <div
                key={hotspot.id}
                className={`absolute transition-all duration-300 ${
                  isDiscovered 
                    ? 'border-2 border-red-500/40 bg-red-500/10' 
                    : 'border-2 border-dashed border-white/30 bg-white/5 hover:border-red-500/80 hover:bg-red-500/20'
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
                {/* Pulsing indicator for undiscovered hotspots */}
                {!isDiscovered && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping opacity-50" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Status Bar */}
        <div className="bg-zinc-950 text-zinc-400 px-6 py-2 font-mono text-sm border-y-4 border-zinc-800 flex items-center h-12">
          {hoveredHotspot ? (
            <span className="text-red-400 font-bold uppercase tracking-widest">
              {activeVerb} <span className="text-white">{hoveredHotspot}</span>
            </span>
          ) : (
            <span className="uppercase tracking-widest opacity-50">Awaiting input...</span>
          )}
        </div>

        {/* Control Panel */}
        <div className="flex flex-col md:flex-row h-auto md:h-48 bg-zinc-900">
          {/* Verbs */}
          <div className="w-full md:w-1/3 p-6 grid grid-cols-1 gap-3 border-b-4 md:border-b-0 md:border-r-4 border-zinc-800 bg-zinc-950">
            {VERBS.map(verb => (
              <button
                key={verb}
                onClick={() => setActiveVerb(verb)}
                className={`font-mono text-lg uppercase tracking-widest py-2 px-4 border-2 transition-all text-left ${
                  activeVerb === verb 
                    ? 'bg-red-600 border-red-600 text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] translate-x-1 -translate-y-1' 
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-500'
                }`}
              >
                &gt; {verb}
              </button>
            ))}
          </div>

          {/* Dialogue Box */}
          <div className="w-full md:w-2/3 p-8 flex items-start bg-zinc-900 relative">
            <div className="absolute top-4 left-4 w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <p className="font-[--font-comic] text-lg md:text-xl text-green-400 leading-relaxed pl-4 font-bold">
              <TypewriterText text={message} />
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
