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
      tags: t('services', 's1_tags') as unknown as string[],
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Layout,
      title: t('services', 's2_title'),
      description: t('services', 's2_desc'),
      tags: t('services', 's2_tags') as unknown as string[],
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      icon: TrendingUp,
      title: t('services', 's3_title'),
      description: t('services', 's3_desc'),
      tags: t('services', 's3_tags') as unknown as string[],
      color: 'text-brand',
      bg: 'bg-brand/10'
    }
  ];

  return (
    <section id="services" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
              Alcance todos os seus objetivos num <span className="text-brand">único local</span>.
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Simplificamos a complexidade do digital. Descubra as soluções integradas que preparamos para escalar o seu negócio.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative p-10 h-full flex flex-col border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-floating hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mb-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${service.bg} ${service.color}`}>
                  <service.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {service.description}
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-xs font-bold px-4 py-2 bg-gray-50 rounded-full text-gray-600 border border-gray-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
};