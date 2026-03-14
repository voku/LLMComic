import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { ComicPanel } from './components/ComicPanel';
import { PointAndClickScene } from './components/PointAndClickScene';
import { ImageGenerator } from './components/ImageGenerator';
import { panels, characterConfig } from './data';

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 font-sans selection:bg-red-700 selection:text-white">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-red-700 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Intro Screen */}
      <header className="relative h-[120vh] flex flex-col items-center justify-start pt-[30vh] overflow-hidden border-b-8 border-zinc-900">
        <div className="absolute inset-0 z-0 clip-path-panel">
          <motion.div 
            className="sticky top-0 h-screen w-full overflow-hidden"
            style={{ 
              opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]),
              scale: useTransform(scrollYProgress, [0, 0.1], [1, 1.1])
            }}
          >
            <ImageGenerator 
              panelId="main-intro-bg"
              prompt={`Scene: A dark, rainy cyberpunk city skyline at night. Noir comic style, high contrast ink. Style: ${characterConfig.style}`}
              fallbackSeed="noir-city"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{
              backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
              backgroundSize: '4px 4px'
            }} />
          </motion.div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ y: useTransform(scrollYProgress, [0, 0.1], [0, -100]) }}
          >
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white mb-6 drop-shadow-[6px_6px_0_rgba(0,0,0,1)]">
              The Case of <br />
              <span className="text-red-600">Danny Krüger</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            style={{ y: useTransform(scrollYProgress, [0, 0.1], [0, -50]) }}
          >
            <p className="text-xl md:text-2xl text-zinc-400 font-medium tracking-wide uppercase max-w-2xl mx-auto border-y border-zinc-800 py-4 bg-zinc-950/50 backdrop-blur-sm">
              A small crime in the age of AI coding
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
        >
          <span className="text-sm uppercase tracking-widest font-bold">Investigate</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown size={32} className="text-red-600" />
          </motion.div>
        </motion.div>
      </header>

      {/* Comic Panels & Interactive Scenes */}
      <main className="relative z-10">
        {panels.map((panel, index) => (
          panel.type === 'interactive' 
            ? <PointAndClickScene key={panel.id} panel={panel} />
            : <ComicPanel key={panel.id} panel={panel} index={index} />
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 py-24 text-center border-t border-zinc-900 relative z-10">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-bold text-white mb-6 uppercase tracking-wider">Case Closed</h2>
          <p className="text-zinc-400 text-lg">
            Based on the blog post "The Case of Danny Krüger".<br/>
            An interactive comic investigation.<br/>
            <a
              href="https://github.com/voku/LLMComic"
              target="_blank"
              rel="noreferrer"
              className="text-red-500 hover:text-red-400 underline underline-offset-4"
            >
              Contribute on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
