import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './lib/i18n/LanguageContext';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Comparison } from './components/Comparison';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { Admin } from './components/Admin';
import { motion, useScroll, useSpring } from 'framer-motion';

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
        <Comparison />
        <Services />
        <Pricing />
      </main>
      <Footer />
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