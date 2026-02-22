import React from 'react';
import { X, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../lib/i18n/LanguageContext';

export const Comparison: React.FC = () => {
    const { t } = useLanguage();

    const traditionalPoints = t('comparison', 'traditional_points') as unknown as string[];
    const internovaPoints = t('comparison', 'internova_points') as unknown as string[];
    return (
        <section id="comparison" className="py-32 bg-[#050505] relative border-b border-white/5 overflow-hidden">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-24 md:flex items-end justify-between"
                >
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
                            {t('comparison', 'title1')} <br />
                            <span className="text-gray-500">{t('comparison', 'title2')}</span> {t('comparison', 'title3')}
                        </h2>
                        <p className="text-gray-400 text-lg">
                            {t('comparison', 'subtitle')}
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* The Old Way */}
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="p-8 md:p-12 rounded-2xl border border-red-900/20 bg-gradient-to-b from-red-900/5 to-transparent relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-20 transition-transform duration-700 group-hover:scale-110">
                            <X size={120} className="text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-8 text-red-200">{t('comparison', 'traditional_title')}</h3>
                        <ul className="space-y-6">
                            {traditionalPoints.map((item, idx) => (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 + (idx * 0.1) }}
                                    className="flex items-start gap-4 text-gray-400"
                                >
                                    <X size={20} className="text-red-500 shrink-0 mt-1" />
                                    <span>{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* The Internova Way */}
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="p-8 md:p-12 rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-900/10 to-transparent relative overflow-hidden shadow-[0_0_50px_-12px_rgba(99,102,241,0.1)] group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-20 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
                            <Check size={120} className="text-indigo-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-8 text-indigo-200">{t('comparison', 'internova_title')}</h3>
                        <ul className="space-y-6">
                            {internovaPoints.map((item, idx) => (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 + (idx * 0.1) }}
                                    className="flex items-start gap-4 text-white font-medium"
                                >
                                    <div className="bg-indigo-500/20 p-1 rounded-full">
                                        <Check size={16} className="text-indigo-400 shrink-0" />
                                    </div>
                                    <span>{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};