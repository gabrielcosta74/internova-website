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
      icon: <Target className="text-indigo-400" size={24} />,
      description: t('pricing', 'p1_desc'),
      features: t('pricing', 'p1_features') as unknown as string[],
      highlight: false,
      benefit: t('pricing', 'p1_benefit')
    },
    {
      name: t('pricing', 'p2_name'),
      tagline: t('pricing', 'p2_tagline'),
      icon: <Zap className="text-yellow-400" size={24} />,
      description: t('pricing', 'p2_desc'),
      features: t('pricing', 'p2_features') as unknown as string[],
      highlight: true,
      benefit: t('pricing', 'p2_benefit')
    },
    {
      name: t('pricing', 'p3_name'),
      tagline: t('pricing', 'p3_tagline'),
      icon: <TrendingUp className="text-purple-400" size={24} />,
      description: t('pricing', 'p3_desc'),
      features: t('pricing', 'p3_features') as unknown as string[],
      highlight: false,
      benefit: t('pricing', 'p3_benefit')
    }
  ];

  return (
    <section id="pricing" className="py-32 bg-[#050505] border-t border-white/5">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
            {t('pricing', 'title1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{t('pricing', 'title2')}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('pricing', 'subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6, type: "spring", stiffness: 100 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className={`relative p-8 rounded-2xl border ${plan.highlight
                  ? 'border-indigo-500 bg-indigo-900/10 shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)]'
                  : 'border-white/10 bg-[#0a0a0a]'
                } flex flex-col`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest rounded-full">
                  {t('pricing', 'popular_badge')}
                </div>
              )}

              <div className="mb-6">
                <div className="mb-4">{plan.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-indigo-400 text-sm font-semibold mb-4 leading-snug">{plan.tagline}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{plan.description}</p>
              </div>

              <div className="h-px w-full bg-white/10 mb-8" />

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check size={16} className={plan.highlight ? "text-indigo-400" : "text-gray-500"} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <div className="mb-6 p-3 rounded-lg bg-white/5 border border-white/5 italic text-xs text-center text-gray-400">
                  "{plan.benefit}"
                </div>
                <a
                  href="#contact"
                  className={`block w-full py-4 rounded-lg font-bold text-sm tracking-widest uppercase text-center transition-all ${plan.highlight
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
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
          transition={{ delay: 0.8 }}
          className="mt-16 text-center space-y-2"
        >
          <p className="text-gray-400 font-medium">
            {t('pricing', 'custom_title')}
          </p>
          <p className="text-gray-500 text-sm">
            {t('pricing', 'custom_desc')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};