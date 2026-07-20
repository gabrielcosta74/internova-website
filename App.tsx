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
import { OnboardingProvider } from './lib/OnboardingContext';
import { OnboardingFlow } from './components/OnboardingFlow';

const HomeContent = () => {
  return (
    <>
      <div id="site-shell" className="relative min-h-screen bg-gray-50 text-gray-900 selection:bg-brand selection:text-white">
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
      <OnboardingFlow />
    </>
  );
};

const App: React.FC = () => {
  return (
    <DeviceProvider>
      <LanguageProvider>
        <OnboardingProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomeContent />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </BrowserRouter>
        </OnboardingProvider>
      </LanguageProvider>
    </DeviceProvider>
  );
};

export default App;
