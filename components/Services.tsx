import React from 'react';
import { PenTool, Layout, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../lib/i18n/LanguageContext';

export const Services: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: PenTool,
      title: t('services', 's1_title'),
      description: t('services', 's1_desc'),
      // JSON strings parsed to array
      tags: t('services', 's1_tags') as unknown as string[]
    },
    {
      icon: Layout,
      title: t('services', 's2_title'),
      description: t('services', 's2_desc'),
      tags: t('services', 's2_tags') as unknown as string[]
    },
    {
      icon: TrendingUp,
      title: t('services', 's3_title'),
      description: t('services', 's3_desc'),
      tags: t('services', 's3_tags') as unknown as string[]
    }
  ];
  return (
    <section id="services" className="py-32 bg-[#050505] perspective-1000">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8"
        >
          <h2 className="text-4xl md:text-7xl font-bold tracking-tighter max-w-3xl">
            {t('services', 'title1')} <br className="hidden md:block" /> <span className="text-indigo-500">{t('services', 'title2')}</span>.
          </h2>
          <p className="text-gray-400 text-lg max-w-sm pb-2 border-b border-gray-800">
            {t('services', 'subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, rotateX: 45, y: 50 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: index * 0.1, duration: 0.6, type: "spring", bounce: 0.3 }}
              className="group relative p-8 h-full min-h-[400px] flex flex-col justify-between border border-white/10 rounded-xl bg-[#0a0a0a] hover:bg-[#0f0f0f] transition-colors hover:border-indigo-500/30"
            >
              <div>
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-8 text-indigo-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <service.icon size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-8">
                  {service.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-auto">
                {service.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-xs uppercase tracking-wider font-semibold px-3 py-1 bg-white/5 rounded-full text-gray-300 group-hover:bg-indigo-500/10 group-hover:text-indigo-300 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};