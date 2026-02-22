import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './lib/i18n/LanguageContext';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Admin } from './components/Admin';
import { motion, useScroll, useSpring } from 'framer-motion';

// Lazy loading below-the-fold components to improve mobile load time
const Services = React.lazy(() => import('./components/Services').then(module => ({ default: module.Services })));
const Comparison = React.lazy(() => import('./components/Comparison').then(module => ({ default: module.Comparison })));
const Pricing = React.lazy(() => import('./components/Pricing').then(module => ({ default: module.Pricing })));
const Footer = React.lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));

const Home = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-indigo-500 selection:text-white">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left z-50"
        style={{ scaleX }}
      />
      <Navbar />
      <main className="overflow-hidden">
        <Hero />
        <React.Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#050505]"><div className="animate-spin h-8 w-8 border-t-2 border-indigo-500 rounded-full"></div></div>}>
          <Comparison />
          <Services />
          <Pricing />
        </React.Suspense>
      </main>
      <React.Suspense fallback={<div className="h-32 bg-[#050505]"></div>}>
        <Footer />
      </React.Suspense>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;