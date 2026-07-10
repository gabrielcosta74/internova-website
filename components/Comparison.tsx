import React from 'react';
import { X, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../lib/i18n/LanguageContext';

export const Comparison: React.FC = () => {
    const { t } = useLanguage();

    const traditionalPoints = t('comparison', 'traditional_points') as unknown as string[];
    const internovaPoints = t('comparison', 'internova_points') as unknown as string[];

    return (
        <section id="comparison" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="mb-20 text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-gray-900">
                            {t('comparison', 'title1')} <br className="hidden md:block" />
                            <span className="text-brand">{t('comparison', 'title2')}</span> {t('comparison', 'title3')}
                        </h2>
                        <p className="text-xl text-gray-600 font-medium">
                            {t('comparison', 'subtitle')}
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
                    {/* The Old Way */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.6 }}
                        className="p-10 rounded-3xl border border-gray-200 bg-gray-50 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-10 transition-transform duration-700 group-hover:scale-110">
                            <X size={120} className="text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-8 text-gray-700">{t('comparison', 'traditional_title')}</h3>
                        <ul className="space-y-6 relative z-10">
                            {traditionalPoints.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-gray-600 font-medium">
                                    <div className="bg-gray-200 p-1 rounded-full shrink-0 mt-0.5">
                                      <X size={16} className="text-gray-500" />
                                    </div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* The Internova Way */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.6 }}
                        className="p-10 rounded-3xl border border-brand/20 bg-brand/5 relative overflow-hidden shadow-sm hover:shadow-floating transition-shadow group"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
                            <Check size={120} className="text-brand" />
                        </div>
                        <h3 className="text-2xl font-bold mb-8 text-brand">{t('comparison', 'internova_title')}</h3>
                        <ul className="space-y-6 relative z-10">
                            {internovaPoints.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-gray-900 font-bold">
                                    <div className="bg-brand text-white p-1 rounded-full shrink-0 mt-0.5 shadow-sm">
                                        <Check size={16} />
                                    </div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};