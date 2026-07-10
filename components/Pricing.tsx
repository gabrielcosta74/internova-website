import React from 'react';
import { Check, Zap, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../lib/i18n/LanguageContext';

export const Pricing: React.FC = () => {
  const { t } = useLanguage();

  const plans = [
    {
      name: t('pricing', 'p1_name'),
      tagline: t('pricing', 'p1_tagline'),
      icon: <Target className="text-blue-600" size={24} />,
      description: t('pricing', 'p1_desc'),
      features: t('pricing', 'p1_features') as unknown as string[],
      highlight: false,
      benefit: t('pricing', 'p1_benefit')
    },
    {
      name: t('pricing', 'p2_name'),
      tagline: t('pricing', 'p2_tagline'),
      icon: <Zap className="text-brand" size={24} />,
      description: t('pricing', 'p2_desc'),
      features: t('pricing', 'p2_features') as unknown as string[],
      highlight: true,
      benefit: t('pricing', 'p2_benefit')
    },
    {
      name: t('pricing', 'p3_name'),
      tagline: t('pricing', 'p3_tagline'),
      icon: <TrendingUp className="text-emerald-600" size={24} />,
      description: t('pricing', 'p3_desc'),
      features: t('pricing', 'p3_features') as unknown as string[],
      highlight: false,
      benefit: t('pricing', 'p3_benefit')
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-gray-900">
              {t('pricing', 'title1')} <br className="hidden md:block" />
              <span className="text-brand">{t('pricing', 'title2')}</span>
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              {t('pricing', 'subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative p-10 rounded-3xl border flex flex-col transition-all duration-300 ${plan.highlight
                ? 'border-brand bg-white shadow-floating scale-100 md:scale-105 z-10'
                : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-brand text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-md">
                  {t('pricing', 'popular_badge')}
                </div>
              )}

              <div className="mb-8">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${plan.highlight ? 'bg-brand/10' : 'bg-white border border-gray-200'}`}>
                   {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className={`${plan.highlight ? 'text-brand' : 'text-gray-600'} text-sm font-bold uppercase tracking-wider mb-4`}>{plan.tagline}</p>
                <p className="text-gray-500 font-medium leading-relaxed">{plan.description}</p>
              </div>

              <div className="h-px w-full bg-gray-200 mb-8" />

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700 font-medium">
                    <div className={`mt-1 p-0.5 rounded-full ${plan.highlight ? 'bg-brand/10 text-brand' : 'bg-gray-200 text-gray-500'}`}>
                        <Check size={14} />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <div className="mb-6 p-4 rounded-xl bg-gray-100 italic text-sm text-center text-gray-600 font-medium">
                  "{plan.benefit}"
                </div>
                <a
                  href="#contact"
                  className={`block w-full py-4 rounded-full font-bold text-base text-center transition-all shadow-sm hover:shadow-md ${plan.highlight
                    ? 'bg-brand text-white hover:bg-brand-hover'
                    : 'bg-white text-gray-900 border border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {t('pricing', 'schedule_btn')}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center space-y-3"
        >
          <p className="text-gray-900 font-bold text-lg">
            {t('pricing', 'custom_title')}
          </p>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            {t('pricing', 'custom_desc')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};