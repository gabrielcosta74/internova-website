import React, { useState } from 'react';
import { Instagram, Linkedin, Mail, ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../lib/i18n/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', challenge: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.challenge) {
      setErrorMessage(t('footer', 'form_error_empty'));
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          name: formData.name,
          email: formData.email,
          challenge: formData.challenge
        }]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', challenge: '' });
      setTimeout(() => setStatus('idle'), 5000); // Reset after 5s

    } catch (error: any) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setErrorMessage(t('footer', 'form_error_submit'));
    }
  };

  return (
    <footer id="contact" className="bg-[#050505] border-t border-white/5 pt-32 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
          <div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight">
              {t('footer', 'title1')} <br />
              <span className="text-indigo-500">{t('footer', 'title2')}</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-md">
              {t('footer', 'subtitle')}
            </p>
            <a
              href="mailto:geral@internova.pt"
              className="inline-flex items-center gap-2 text-2xl font-semibold border-b border-white pb-1 hover:text-indigo-400 hover:border-indigo-400 transition-colors"
            >
              geral@internova.pt <ArrowUpRight size={24} />
            </a>
          </div>

          <div className="flex flex-col justify-end items-start md:items-end">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 w-full max-w-md">
              <h3 className="text-xl font-bold mb-6">{t('footer', 'form_title')}</h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">{t('footer', 'form_name')}</label>
                  <input
                    type="text"
                    className="w-full bg-[#050505] border border-white/10 rounded p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder={t('footer', 'form_name_placeholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={status === 'loading' || status === 'success'}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">{t('footer', 'form_email')}</label>
                  <input
                    type="email"
                    className="w-full bg-[#050505] border border-white/10 rounded p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder={t('footer', 'form_email_placeholder')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={status === 'loading' || status === 'success'}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">{t('footer', 'form_challenge')}</label>
                  <textarea
                    className="w-full bg-[#050505] border border-white/10 rounded p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors h-24"
                    placeholder={t('footer', 'form_challenge_placeholder')}
                    value={formData.challenge}
                    onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                    disabled={status === 'loading' || status === 'success'}
                  ></textarea>
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle size={16} className="shrink-0" />
                    <p>{errorMessage}</p>
                  </div>
                )}

                {status === 'success' && (
                  <div className="flex items-center gap-2 p-3 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <p>{t('footer', 'form_success')}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest rounded transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {status === 'loading' ? (
                    <><Loader2 size={18} className="animate-spin" /> {t('footer', 'form_submitting')}</>
                  ) : status === 'success' ? (
                    <><CheckCircle2 size={18} /> {t('footer', 'form_sent')}</>
                  ) : (
                    t('footer', 'form_submit')
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end pt-12 border-t border-white/10">
          <div className="mb-8 md:mb-0">
            <div className="text-3xl font-bold tracking-tighter uppercase mb-2">
              Inter<span className="text-indigo-500">nova</span>.
            </div>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Internova Studio. {t('footer', 'rights')}
            </p>
          </div>

          <div className="flex gap-6">
          </div>
        </div>
      </div>
    </footer>
  );
};