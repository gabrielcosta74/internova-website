import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../lib/i18n/LanguageContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? 'py-4 bg-[#050505]/80 backdrop-blur-md border-b border-white/5' : 'py-8 bg-transparent'
          }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter uppercase cursor-pointer" onClick={() => scrollTo('top')}>
            Inter<span className="text-indigo-500">nova</span>.
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('services')} className="text-sm font-medium text-gray-300 hover:text-white uppercase tracking-widest transition-colors">{t('nav', 'consulting')}</button>
            <button onClick={() => scrollTo('comparison')} className="text-sm font-medium text-gray-300 hover:text-white uppercase tracking-widest transition-colors">{t('nav', 'results')}</button>
            <button onClick={() => scrollTo('pricing')} className="text-sm font-medium text-gray-300 hover:text-white uppercase tracking-widest transition-colors">{t('nav', 'solutions')}</button>

            {/* Lang Switcher */}
            <div className="flex items-center gap-2 bg-white/5 tracking-widest rounded-full px-3 py-1 border border-white/10 text-xs font-semibold">
              <Globe size={14} className="text-gray-400" />
              <button onClick={() => setLanguage('pt')} className={`transition-colors ${language === 'pt' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>PT</button>
              <span className="text-gray-600">|</span>
              <button onClick={() => setLanguage('en')} className={`transition-colors ${language === 'en' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>EN</button>
            </div>

            <button
              onClick={() => scrollTo('contact')}
              className="px-6 py-2 bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-sm"
            >
              {t('nav', 'schedule')}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden z-50">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-[#050505] z-30 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <button onClick={() => scrollTo('services')} className="text-2xl font-light text-white uppercase tracking-widest">{t('nav', 'consulting')}</button>
            <button onClick={() => scrollTo('comparison')} className="text-2xl font-light text-white uppercase tracking-widest">{t('nav', 'results')}</button>
            <button onClick={() => scrollTo('pricing')} className="text-2xl font-light text-white uppercase tracking-widest">{t('nav', 'solutions')}</button>

            {/* Mobile Lang Switcher */}
            <div className="flex items-center gap-4 mt-4 bg-white/5 tracking-widest rounded-full px-6 py-2 border border-white/10 text-sm font-semibold">
              <Globe size={18} className="text-gray-400" />
              <button onClick={() => setLanguage('pt')} className={`transition-colors ${language === 'pt' ? 'text-white' : 'text-gray-500'}`}>PT</button>
              <span className="text-gray-600">|</span>
              <button onClick={() => setLanguage('en')} className={`transition-colors ${language === 'en' ? 'text-white' : 'text-gray-500'}`}>EN</button>
            </div>

            <button
              onClick={() => scrollTo('contact')}
              className="text-2xl font-bold text-indigo-500 uppercase tracking-widest mt-4"
            >
              {t('nav', 'schedule')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};