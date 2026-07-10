import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, BarChart3, Globe, Smartphone, Activity } from 'lucide-react';
import { useLanguage } from '../lib/i18n/LanguageContext';

const verbs = [
  { 
    text: 'Inove', 
    color: 'text-brand', 
    bg: 'bg-brand/10', 
    icon: <Smartphone className="w-8 h-8 text-brand" />, 
    desc: 'Desenvolvimento Mobile & Web',
    image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=800'
  },
  { 
    text: 'Destaque', 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-100', 
    icon: <Search className="w-8 h-8 text-emerald-600" />, 
    desc: 'Otimização SEO & Tráfego',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
  },
  { 
    text: 'Evolua', 
    color: 'text-blue-600', 
    bg: 'bg-blue-100', 
    icon: <BarChart3 className="w-8 h-8 text-blue-600" />, 
    desc: 'Estratégia Orientada a Dados',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  },
  { 
    text: 'Transforme', 
    color: 'text-orange-500', 
    bg: 'bg-orange-100', 
    icon: <Globe className="w-8 h-8 text-orange-500" />, 
    desc: 'Presença Digital Global',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
  },
];

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % verbs.length);
    }, 4000); // 4 seconds interval for better image reading time
    return () => clearInterval(interval);
  }, []);

  const currentVerb = verbs[currentIndex];

  return (
    <div className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden bg-white">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
          
          {/* Left Text Column */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                <div className="h-[80px] md:h-[100px] overflow-visible relative flex justify-center lg:justify-start items-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentVerb.text}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className={`absolute inline-block ${currentVerb.color}`}
                    >
                      {currentVerb.text}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="block mt-2 text-gray-800">
                  o seu negócio digital com a Internova.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Para aquilo que mais importa, ajude os potenciais clientes a encontrar a sua empresa mais facilmente. Alcance todos os seus objetivos num único local.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#pricing"
                  className="group w-full sm:w-auto px-8 py-4 bg-brand text-white font-bold text-base rounded-full flex items-center justify-center gap-2 hover:bg-brand-hover transition-all shadow-lg hover:shadow-brand/30 hover:-translate-y-0.5"
                >
                  Começar agora 
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <p className="text-sm text-gray-500 font-medium">
                  Consulta inicial gratuita.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Visual Column (Premium Composition) */}
          <div className="flex-1 w-full max-w-2xl relative flex justify-center items-center h-[450px] lg:h-[600px]">
             {/* Decorative Background blob */}
             <motion.div 
               animate={{ backgroundColor: currentVerb.color.replace('text-', 'bg-').replace('-600', '-200').replace('-500', '-200') }}
               className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-30 transition-colors duration-700 right-[-10%] top-[-10%]"
             />
             
             <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100/50">
               <AnimatePresence mode="wait">
                 <motion.img
                   key={currentVerb.image}
                   src={currentVerb.image}
                   alt={currentVerb.text}
                   initial={{ scale: 1.15, opacity: 0, filter: "blur(10px)" }}
                   animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                   exit={{ scale: 1.05, opacity: 0, filter: "blur(10px)" }}
                   transition={{ duration: 0.8, ease: "easeInOut" }}
                   className="absolute inset-0 w-full h-full object-cover"
                 />
               </AnimatePresence>
               
               {/* Sleek Gradient Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/10 to-transparent opacity-80" />
               
               {/* Sleek Floating Pill Card */}
               <div className="absolute bottom-8 left-8 sm:left-12 right-8 sm:right-auto">
                 <AnimatePresence mode="wait">
                    <motion.div
                      key={currentVerb.text}
                      initial={{ y: 30, opacity: 0, scale: 0.95 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: 15, opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, delay: 0.2, type: "spring", bounce: 0.3 }}
                      className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-full p-2 pr-8 shadow-2xl flex items-center gap-4"
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-inner ${currentVerb.bg}`}>
                        {currentVerb.icon}
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className={`text-sm font-bold uppercase tracking-wider ${currentVerb.color}`}>
                          {currentVerb.text}
                        </h3>
                        <p className="text-gray-700 text-sm font-semibold mt-0.5">
                          {currentVerb.desc}
                        </p>
                      </div>
                    </motion.div>
                 </AnimatePresence>
               </div>
               
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
