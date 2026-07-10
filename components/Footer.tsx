import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
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
      const lead = {
        name: formData.name,
        email: formData.email,
        challenge: formData.challenge,
      };

      const { error } = await supabase.from('leads').insert([lead]);

      if (error) throw error;

      try {
        const { error: fnError } = await supabase.functions.invoke('notify-lead', {
          body: lead,
        });
        if (fnError) console.error('Falha ao enviar email de notificação:', fnError);
      } catch (notifyError) {
        console.error('Falha ao enviar email de notificação:', notifyError);
      }

      setStatus('success');
      setFormData({ name: '', email: '', challenge: '' });
      setTimeout(() => setStatus('idle'), 5000); 

    } catch (error: any) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setErrorMessage(t('footer', 'form_error_submit'));
    }
  };

  return (
    <footer id="contact" className="bg-white border-t border-gray-100 pt-32 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
          <div>
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8 text-gray-900 leading-[1.1]">
              {t('footer', 'title1')} <br />
              <span className="text-brand">{t('footer', 'title2')}</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-md font-medium">
              {t('footer', 'subtitle')}
            </p>
            <a
              href="mailto:geral@internova.pt"
              className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900 border-b-2 border-gray-900 pb-1 hover:text-brand hover:border-brand transition-colors"
            >
              geral@internova.pt <ArrowUpRight size={28} />
            </a>
          </div>

          <div className="flex flex-col justify-end items-start md:items-end">
            <div className="p-10 rounded-3xl bg-gray-50 border border-gray-100 w-full max-w-md shadow-sm">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">{t('footer', 'form_title')}</h3>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{t('footer', 'form_name')}</label>
                  <input
                    type="text"
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                    placeholder={t('footer', 'form_name_placeholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={status === 'loading' || status === 'success'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{t('footer', 'form_email')}</label>
                  <input
                    type="email"
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                    placeholder={t('footer', 'form_email_placeholder')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={status === 'loading' || status === 'success'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{t('footer', 'form_challenge')}</label>
                  <textarea
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all h-32 resize-none"
                    placeholder={t('footer', 'form_challenge_placeholder')}
                    value={formData.challenge}
                    onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                    disabled={status === 'loading' || status === 'success'}
                  ></textarea>
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                    <AlertCircle size={18} className="shrink-0" />
                    <p>{errorMessage}</p>
                  </div>
                )}

                {status === 'success' && (
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm font-medium">
                    <CheckCircle2 size={18} className="shrink-0" />
                    <p>{t('footer', 'form_success')}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full py-4 bg-brand hover:bg-brand-hover text-white font-bold rounded-full transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
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

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100">
          <div className="mb-4 md:mb-0">
            <div className="text-2xl font-bold tracking-tighter text-gray-900 mb-1">
              Inter<span className="text-brand">nova</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">
              &copy; {new Date().getFullYear()} Internova Studio. {t('footer', 'rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};