import React from 'react';
import { ArrowRight, Monitor, Search, Workflow, TrendingUp } from 'lucide-react';
import { useLanguage } from '../lib/i18n/LanguageContext';

export const HeroMobile: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="relative min-h-[90vh] pb-32 flex items-center justify-center overflow-hidden pt-20">
            {/* Static Background Layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a2e] via-[#050505] to-[#000000]" />
                <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-indigo-900/40 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-purple-900/40 rounded-full blur-[100px]" />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 relative z-20 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm cursor-default shadow-lg">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-xs font-semibold tracking-widest uppercase text-gray-300">{t('hero', 'badge')}</span>
                </div>

                <h1
                    className="text-4xl md:text-5xl font-bold tracking-tighter mb-8 leading-[1.1] drop-shadow-2xl"
                    style={{ textShadow: '0 4px 18px rgba(0,0,0,0.65), 0 1px 2px rgba(0,0,0,0.9)' }}
                >
                    {t('hero', 'title1')} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 inline-block" style={{ textShadow: 'none' }}>{t('hero', 'title2')}</span>
                </h1>

                <p
                    className="text-base text-gray-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed drop-shadow-md"
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
                >
                    {t('hero', 'description')}
                </p>

                <div className="flex flex-col items-center justify-center gap-4">
                    <a
                        href="#pricing"
                        className="w-full group px-8 py-4 bg-white text-black font-bold text-sm tracking-widest uppercase rounded-sm flex items-center justify-center gap-3 active:bg-gray-200 transition-colors shadow-xl"
                    >
                        {t('hero', 'cta_primary')} <ArrowRight size={18} />
                    </a>
                    <a
                        href="#services"
                        className="w-full px-8 py-4 bg-transparent border border-white/20 text-white font-bold text-sm tracking-widest uppercase rounded-sm active:bg-white/5 transition-colors shadow-lg"
                    >
                        {t('hero', 'cta_secondary')}
                    </a>
                </div>

                {/* Feature Tickers - Static on Mobile */}
                <div className="mt-16 grid grid-cols-2 gap-8 max-w-5xl mx-auto border-t border-white/10 pt-12">
                    <div className="flex flex-col items-center gap-2">
                        <Monitor className="text-blue-400 mb-2 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                        <h3 className="font-bold text-center text-sm">{t('hero', 'ticker1_title')}</h3>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Search className="text-indigo-400 mb-2 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
                        <h3 className="font-bold text-center text-sm">{t('hero', 'ticker2_title')}</h3>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Workflow className="text-emerald-400 mb-2 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                        <h3 className="font-bold text-center text-sm">{t('hero', 'ticker3_title')}</h3>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <TrendingUp className="text-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                        <h3 className="font-bold text-center text-sm">{t('hero', 'ticker4_title')}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};
