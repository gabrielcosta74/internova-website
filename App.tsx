import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './lib/i18n/LanguageContext';
import { DeviceProvider, useDevice } from './lib/DeviceContext';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Comparison } from './components/Comparison';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { Admin } from './components/Admin';
import { AnimatedProgressBar } from './components/AnimatedProgressBar';

const HomeContent = () => {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-indigo-500 selection:text-white">
      <AnimatedProgressBar />
      <Navbar />
      <main>
        <Hero />
        <Comparison />
        <Services />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DeviceProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeContent />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </DeviceProvider>
  );
};

export default App;