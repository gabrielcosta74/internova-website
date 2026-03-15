import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowRight, Monitor, Search, Workflow, TrendingUp, Zap, Clock } from 'lucide-react';
import { useLanguage } from '../lib/i18n/LanguageContext';

export const HeroDesktop: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const { t } = useLanguage();

  // Motion values let framer update transforms outside React render cycles.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Calculate normalized position (-1 to 1)
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;

    pointerRef.current = { x, y };

    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      mouseX.set(pointerRef.current.x);
      mouseY.set(pointerRef.current.y);
      rafRef.current = null;
    });
  };

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Tuned for smoother interpolation without a sluggish feel.
  const springConfig = { stiffness: 240, damping: 34, mass: 0.7 };

  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  // --- TRANSFORMATION LOGIC (Camera Pan Effect) ---
  // If Mouse goes LEFT (-1) -> Camera looks LEFT -> World moves RIGHT (Positive)
  // This brings Left objects to center, and pushes Right objects off-screen.

  // Background moves slowly (Far distance)
  const bgX = useTransform(xSpring, [-1, 1], [28, -28]);
  const bgY = useTransform(ySpring, [-1, 1], [18, -18]);

  // Mid-ground elements (Strategy Card & Office Card)
  // Moderate movement
  const midX = useTransform(xSpring, [-1, 1], [44, -44]);
  const midY = useTransform(ySpring, [-1, 1], [24, -24]);

  // Foreground elements (Mobile Card & Notification)
  // Fast movement (High Sensitivity)
  const foreX = useTransform(xSpring, [-1, 1], [78, -78]);
  const foreY = useTransform(ySpring, [-1, 1], [34, -34]);

  // 3D Rotation to enhance the "looking" feeling
  // Mouse Left (-1) -> Rotate Y Positive (brings left side closer/forward)
  const rotateY = useTransform(xSpring, [-1, 1], ["8deg", "-8deg"]);
  // Mouse Top (-1) -> Rotate X Negative (tips top towards viewer)
  const rotateX = useTransform(ySpring, [-1, 1], ["-7deg", "7deg"]);

  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      id="top"
      ref={containerRef}
      onMouseMove={isMobile ? undefined : handleMouseMove}
      onMouseLeave={isMobile ? undefined : handleMouseLeave}
      className={`relative min-h-[90vh] pb-32 xl:min-h-screen xl:pb-0 flex items-center justify-center overflow-hidden pt-20 ${isMobile ? '' : 'perspective-1000'}`}
      style={isMobile ? {} : { perspective: '1200px' }} // Adds 3D depth perspective only on desktop
    >
      {/* Dynamic Background Layer */}
      <motion.div
        style={isMobile ? {} : { x: bgX, y: bgY, scale: 1.15 }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a2e] via-[#050505] to-[#000000]" />

        <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]" />
      </motion.div>

      {/* Floating Elements Container - Applies 3D Rotation */}
      {!isMobile && (
        <motion.div
          style={{ rotateX, rotateY }}
          className="absolute inset-0 z-10 pointer-events-none hidden xl:block preserve-3d will-change-transform"
        >

          {/* === LEFT SIDE === */}

          {/* Card 1: Strategy (Mid-ground) */}
          <motion.div
            style={{ x: midX, y: midY, z: 50 }}
            className="absolute top-[15%] left-[5%] 2xl:left-[10%] w-72 h-48 rounded-2xl overflow-hidden shadow-2xl rotate-[-6deg] border border-white/10 z-10 bg-[#111]"
          >
            <div className="absolute inset-0 bg-blue-500/10 z-10 mix-blend-overlay"></div>
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?fm=webp&q=60&w=600"
              alt={t('hero', 'card1_title')}
              loading="eager"
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-sm p-3 border-t border-white/10">
              <p className="text-xs font-semibold text-white">{t('hero', 'card1_title')}</p>
            </div>
          </motion.div>

          {/* Card 2: Analytics (Foreground - Moves Faster) */}
          <motion.div
            style={{ x: foreX, y: foreY, z: 100 }}
            className="absolute bottom-[15%] left-[12%] w-64 h-auto rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] rotate-[3deg] border border-white/10 bg-[#1a1a1a] z-20 p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Search className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t('hero', 'card2_title')}</p>
                <div className="flex gap-1 mt-1">
                  <div className="h-1 w-4 bg-green-500 rounded-full"></div>
                  <div className="h-1 w-6 bg-green-500 rounded-full"></div>
                  <div className="h-1 w-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">{t('hero', 'card2_desc')}</p>
          </motion.div>


          {/* === RIGHT SIDE === */}

          {/* Card 3: Office/Work (Mid-ground) */}
          <motion.div
            style={{ x: midX, y: midY, z: 50 }}
            className="absolute top-[20%] right-[5%] 2xl:right-[10%] w-80 h-64 rounded-xl overflow-hidden shadow-2xl rotate-[6deg] border border-white/10 z-10 bg-[#111]"
          >
            <div className="absolute inset-0 bg-emerald-500/10 z-10 mix-blend-overlay"></div>
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?fm=webp&q=60&w=800"
              alt={t('hero', 'card3_title')}
              loading="eager"
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
            />
          </motion.div>

          {/* Card 4: Automation (Foreground - Moves Faster) */}
          <motion.div
            style={{ x: foreX, y: foreY, z: 100 }}
            className="absolute bottom-[25%] right-[12%] w-64 bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl border border-green-500/30 p-4 rotate-[-3deg] shadow-[0_0_30px_rgba(34,197,94,0.15)] z-20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shadow-inner">
                <Workflow size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t('hero', 'card4_title')}</p>
                <p className="text-xs text-green-400 font-medium mt-1">{t('hero', 'card4_desc')}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Contrast layer to keep title readable over moving cards */}
      <div
        className="absolute inset-0 z-15 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.46) 34%, rgba(0,0,0,0.12) 58%, rgba(0,0,0,0) 75%)',
        }}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-300">{t('hero', 'badge')}</span>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-8 leading-[1.1] drop-shadow-2xl"
            style={{ textShadow: '0 4px 18px rgba(0,0,0,0.65), 0 1px 2px rgba(0,0,0,0.9)' }}
          >
            {t('hero', 'title1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 inline-block" style={{ textShadow: 'none' }}>{t('hero', 'title2')}</span>
          </h1>

          <p
            className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed drop-shadow-md"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
          >
            {t('hero', 'description')}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group min-w-[220px] px-8 py-4 bg-white text-black font-bold text-sm tracking-widest uppercase rounded-sm flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors shadow-xl"
            >
              {t('hero', 'cta_primary')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="#services"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-w-[220px] px-8 py-4 bg-transparent border border-white/20 text-white font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-white/5 transition-colors shadow-lg"
            >
              {t('hero', 'cta_secondary')}
            </motion.a>
          </div>
        </motion.div>

        {/* Feature Tickers - Simplified Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto border-t border-white/10 pt-12"
        >
          <div className="flex flex-col items-center gap-2">
            <Monitor className="text-blue-400 mb-2 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
            <h3 className="font-bold text-center">{t('hero', 'ticker1_title')}</h3>
            <p className="text-xs text-gray-400 uppercase tracking-wide text-center">{t('hero', 'ticker1_desc')}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Search className="text-indigo-400 mb-2 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
            <h3 className="font-bold text-center">{t('hero', 'ticker2_title')}</h3>
            <p className="text-xs text-gray-400 uppercase tracking-wide text-center">{t('hero', 'ticker2_desc')}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Workflow className="text-emerald-400 mb-2 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            <h3 className="font-bold text-center">{t('hero', 'ticker3_title')}</h3>
            <p className="text-xs text-gray-400 uppercase tracking-wide text-center">{t('hero', 'ticker3_desc')}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <TrendingUp className="text-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            <h3 className="font-bold text-center">{t('hero', 'ticker4_title')}</h3>
            <p className="text-xs text-gray-400 uppercase tracking-wide text-center">{t('hero', 'ticker4_desc')}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
