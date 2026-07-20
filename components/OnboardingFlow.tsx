import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock3,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useOnboarding } from '../lib/OnboardingContext';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { supabase } from '../lib/supabase';

type AnswerKey = 'goal' | 'situation' | 'investment' | 'timeline';
type Answers = Partial<Record<AnswerKey, string>>;

interface Option {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface Question {
  key: AnswerKey;
  eyebrow: string;
  title: string;
  subtitle: string;
  options: Option[];
}

const copy = {
  pt: {
    badge: 'Diagnóstico gratuito · 2 minutos',
    startTitle: 'Vamos encontrar a forma mais rápida de atrair mais clientes.',
    scheduleTitle: 'Vamos preparar a sua sessão estratégica.',
    intro: 'Responda a 4 perguntas rápidas. No final, recebe uma recomendação ajustada ao seu negócio.',
    plan: 'Interesse inicial',
    back: 'Voltar',
    next: 'Continuar',
    close: 'Fechar diagnóstico',
    progress: 'Progresso',
    contactEyebrow: 'A sua recomendação inicial',
    contactTitle: 'Já temos uma direção clara para o seu crescimento.',
    contactSubtitle: 'Deixe os seus dados para receber a análise e confirmar a sessão gratuita com um especialista.',
    name: 'Nome',
    namePlaceholder: 'Como devemos tratar-lhe?',
    email: 'Email profissional',
    emailPlaceholder: 'nome@empresa.pt',
    phone: 'Telefone',
    phonePlaceholder: '+351 900 000 000',
    company: 'Empresa ou website',
    companyPlaceholder: 'Nome da empresa (opcional)',
    submitStart: 'Receber o meu plano gratuito',
    submitSchedule: 'Pedir sessão estratégica',
    submitting: 'A preparar o seu pedido…',
    privacy: 'Sem spam. Os seus dados são usados apenas para preparar este diagnóstico.',
    error: 'Não foi possível enviar agora. Confirme os dados e tente novamente.',
    successEyebrow: 'Pedido recebido',
    successTitle: 'O próximo passo já está em andamento.',
    successBody: 'Vamos analisar as suas respostas e entrar em contacto no prazo de 1 dia útil para partilhar recomendações e confirmar a sessão.',
    successNote: 'Diagnóstico gratuito, prático e sem compromisso.',
    finish: 'Voltar ao site',
    recommendationLabel: 'Estratégia sugerida',
    recommendations: {
      qualified: ['Google Ads + landing page de conversão', 'Captar procura com intenção e transformar cliques em contactos qualificados.'],
      bookings: ['Funil de marcação + automação', 'Reduzir a fricção entre o primeiro contacto e um agendamento confirmado.'],
      google: ['Presença Google + autoridade digital', 'Ser encontrado no momento certo e transmitir confiança antes do primeiro contacto.'],
      scale: ['Sistema de crescimento + automação', 'Aumentar o volume de oportunidades sem aumentar o trabalho manual da equipa.'],
    },
    questions: [
      {
        key: 'goal',
        eyebrow: 'Primeiro, o resultado',
        title: 'Qual é o principal objetivo do seu negócio neste momento?',
        subtitle: 'Escolha a opção com maior impacto nos próximos meses.',
        options: [
          { id: 'qualified', title: 'Atrair clientes qualificados', description: 'Gerar mais contactos com real intenção de comprar.', icon: Users },
          { id: 'bookings', title: 'Aumentar pedidos e marcações', description: 'Converter mais visitas em chamadas e agendamentos.', icon: CalendarCheck },
          { id: 'google', title: 'Ser mais visível no Google', description: 'Aparecer quando procuram os seus serviços.', icon: Search },
          { id: 'scale', title: 'Automatizar e escalar', description: 'Crescer com menos tarefas repetitivas.', icon: Workflow },
        ],
      },
      {
        key: 'situation',
        eyebrow: 'O ponto de partida',
        title: 'Como chegam hoje os novos clientes?',
        subtitle: 'Isto ajuda-nos a identificar a maior oportunidade de crescimento.',
        options: [
          { id: 'referrals', title: 'Sobretudo recomendações', description: 'O boca-a-boca ainda é o principal canal.', icon: Users },
          { id: 'social', title: 'Redes sociais', description: 'Publicamos, mas os resultados são irregulares.', icon: Sparkles },
          { id: 'website', title: 'Site ou Google', description: 'Já recebemos tráfego, mas converte pouco.', icon: Search },
          { id: 'ads', title: 'Já investimos em anúncios', description: 'Queremos melhorar o retorno do investimento.', icon: BarChart3 },
        ],
      },
      {
        key: 'investment',
        eyebrow: 'O ritmo certo',
        title: 'Que nível de investimento mensal faz sentido para crescer?',
        subtitle: 'Uma estimativa é suficiente. A recomendação será ajustada à sua realidade.',
        options: [
          { id: 'exploring', title: 'Quero perceber o ideal', description: 'Preciso primeiro de uma recomendação clara.', icon: Target },
          { id: 'starter', title: 'Até 500 € / mês', description: 'Quero validar uma estratégia com controlo.', icon: Zap },
          { id: 'growth', title: '500 € – 1.500 € / mês', description: 'Estou pronto para criar um canal consistente.', icon: TrendingUp },
          { id: 'scale', title: 'Mais de 1.500 € / mês', description: 'Procuro acelerar e otimizar resultados.', icon: BarChart3 },
        ],
      },
      {
        key: 'timeline',
        eyebrow: 'Última pergunta',
        title: 'Quando gostaria de começar a ver progresso?',
        subtitle: 'Assim conseguimos propor um plano realista e priorizar o contacto.',
        options: [
          { id: 'now', title: 'Nas próximas semanas', description: 'Quero avançar assim que houver um plano claro.', icon: Zap },
          { id: 'quarter', title: 'Nos próximos 2–3 meses', description: 'Estou a preparar o próximo ciclo de crescimento.', icon: CalendarCheck },
          { id: 'exploring', title: 'Ainda estou a explorar', description: 'Quero conhecer as opções e valores primeiro.', icon: Clock3 },
        ],
      },
    ] satisfies Question[],
  },
  en: {
    badge: 'Free diagnostic · 2 minutes',
    startTitle: 'Let’s find the fastest way to attract more clients.',
    scheduleTitle: 'Let’s prepare your strategy session.',
    intro: 'Answer 4 quick questions. At the end, you’ll get a recommendation tailored to your business.',
    plan: 'Initial interest',
    back: 'Back',
    next: 'Continue',
    close: 'Close diagnostic',
    progress: 'Progress',
    contactEyebrow: 'Your initial recommendation',
    contactTitle: 'We already have a clear direction for your growth.',
    contactSubtitle: 'Leave your details to receive the analysis and confirm your free session with a specialist.',
    name: 'Name',
    namePlaceholder: 'How should we address you?',
    email: 'Work email',
    emailPlaceholder: 'name@company.com',
    phone: 'Phone',
    phonePlaceholder: '+351 900 000 000',
    company: 'Company or website',
    companyPlaceholder: 'Company name (optional)',
    submitStart: 'Get my free plan',
    submitSchedule: 'Request strategy session',
    submitting: 'Preparing your request…',
    privacy: 'No spam. Your details are only used to prepare this diagnostic.',
    error: 'We could not send this right now. Check your details and try again.',
    successEyebrow: 'Request received',
    successTitle: 'Your next step is already in motion.',
    successBody: 'We’ll review your answers and contact you within 1 business day to share recommendations and confirm the session.',
    successNote: 'Free, practical and no-obligation diagnostic.',
    finish: 'Return to website',
    recommendationLabel: 'Suggested strategy',
    recommendations: {
      qualified: ['Google Ads + conversion landing page', 'Capture high-intent demand and turn clicks into qualified enquiries.'],
      bookings: ['Booking funnel + automation', 'Reduce friction between the first contact and a confirmed booking.'],
      google: ['Google presence + digital authority', 'Get found at the right moment and build trust before the first conversation.'],
      scale: ['Growth system + automation', 'Increase opportunity volume without adding manual work for your team.'],
    },
    questions: [
      {
        key: 'goal', eyebrow: 'First, the outcome', title: 'What is your main business goal right now?', subtitle: 'Choose the option with the most impact over the next few months.', options: [
          { id: 'qualified', title: 'Attract qualified clients', description: 'Generate more enquiries with real intent to buy.', icon: Users },
          { id: 'bookings', title: 'Increase leads and bookings', description: 'Turn more visits into calls and appointments.', icon: CalendarCheck },
          { id: 'google', title: 'Be more visible on Google', description: 'Show up when people search for your services.', icon: Search },
          { id: 'scale', title: 'Automate and scale', description: 'Grow with fewer repetitive tasks.', icon: Workflow },
        ],
      },
      {
        key: 'situation', eyebrow: 'Your starting point', title: 'How do new clients find you today?', subtitle: 'This helps us identify your biggest growth opportunity.', options: [
          { id: 'referrals', title: 'Mostly referrals', description: 'Word of mouth is still the main channel.', icon: Users },
          { id: 'social', title: 'Social media', description: 'We post, but results are inconsistent.', icon: Sparkles },
          { id: 'website', title: 'Website or Google', description: 'We already get traffic, but conversion is low.', icon: Search },
          { id: 'ads', title: 'We already run ads', description: 'We want to improve our return on investment.', icon: BarChart3 },
        ],
      },
      {
        key: 'investment', eyebrow: 'The right pace', title: 'What monthly investment level makes sense for growth?', subtitle: 'An estimate is enough. The recommendation will fit your reality.', options: [
          { id: 'exploring', title: 'Help me find the right level', description: 'I need a clear recommendation first.', icon: Target },
          { id: 'starter', title: 'Up to €500 / month', description: 'I want to validate a strategy with control.', icon: Zap },
          { id: 'growth', title: '€500–€1,500 / month', description: 'I’m ready to build a consistent channel.', icon: TrendingUp },
          { id: 'scale', title: 'More than €1,500 / month', description: 'I want to accelerate and optimise results.', icon: BarChart3 },
        ],
      },
      {
        key: 'timeline', eyebrow: 'Last question', title: 'When would you like to start seeing progress?', subtitle: 'This helps us propose a realistic plan and prioritise contact.', options: [
          { id: 'now', title: 'In the next few weeks', description: 'I’m ready once there is a clear plan.', icon: Zap },
          { id: 'quarter', title: 'In the next 2–3 months', description: 'I’m preparing the next growth cycle.', icon: CalendarCheck },
          { id: 'exploring', title: 'I’m still exploring', description: 'I want to understand options and pricing first.', icon: Clock3 },
        ],
      },
    ] satisfies Question[],
  },
} as const;

const emptyContact = { name: '', email: '', phone: '', company: '' };

export function OnboardingFlow() {
  const { isOpen, intent, plan, closeOnboarding } = useOnboarding();
  const { language } = useLanguage();
  const content = copy[language];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState(emptyContact);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isAdvancing, setIsAdvancing] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const advanceTimerRef = useRef<number | null>(null);

  const questions = content.questions;
  const isContactStep = step === questions.length;
  const totalSteps = questions.length + 1;
  const progress = status === 'success' ? 100 : ((step + 1) / totalSteps) * 100;
  const question = questions[step];
  const recommendation = content.recommendations[answers.goal as keyof typeof content.recommendations] ?? content.recommendations.qualified;

  useEffect(() => {
    if (!isOpen) return;

    setStep(0);
    setAnswers({});
    setContact(emptyContact);
    setStatus('idle');
    setIsAdvancing(false);
    document.body.style.overflow = 'hidden';
    const siteShell = document.getElementById('site-shell');
    siteShell?.setAttribute('inert', '');
    siteShell?.setAttribute('aria-hidden', 'true');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeOnboarding();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      if (advanceTimerRef.current !== null) window.clearTimeout(advanceTimerRef.current);
      document.body.style.overflow = '';
      siteShell?.removeAttribute('inert');
      siteShell?.removeAttribute('aria-hidden');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnboarding]);

  useEffect(() => {
    if (isOpen) headingRef.current?.focus();
  }, [isOpen, step, status]);

  const selectAnswer = (key: AnswerKey, value: string) => {
    if (isAdvancing) return;

    setIsAdvancing(true);
    setAnswers((current) => ({ ...current, [key]: value }));
    advanceTimerRef.current = window.setTimeout(() => {
      setStep((current) => current + 1);
      setIsAdvancing(false);
      advanceTimerRef.current = null;
    }, 220);
  };

  const goBack = () => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setIsAdvancing(false);
    if (step === 0) closeOnboarding();
    else setStep((current) => current - 1);
  };

  const getAnswerLabel = (key: AnswerKey) => {
    const selectedId = answers[key];
    return questions.find((item) => item.key === key)?.options.find((option) => option.id === selectedId)?.title ?? '—';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');

    const challenge = [
      `Origem: Onboarding — ${intent === 'schedule' ? 'Agendar' : 'Começar agora'}`,
      plan ? `Plano de interesse: ${plan}` : null,
      `Empresa / website: ${contact.company || 'Não indicado'}`,
      `Telefone: ${contact.phone}`,
      '',
      `Objetivo: ${getAnswerLabel('goal')}`,
      `Aquisição atual: ${getAnswerLabel('situation')}`,
      `Investimento: ${getAnswerLabel('investment')}`,
      `Prazo: ${getAnswerLabel('timeline')}`,
      '',
      `Recomendação apresentada: ${recommendation[0]}`,
    ].filter((line): line is string => line !== null).join('\n');

    const lead = { name: contact.name.trim(), email: contact.email.trim(), challenge };

    try {
      const { error } = await supabase.from('leads').insert([lead]);
      if (error) throw error;

      supabase.functions.invoke('notify-lead', { body: lead }).then(({ error: notificationError }) => {
        if (notificationError) console.error('Falha ao enviar notificação do onboarding:', notificationError);
      }).catch((notificationError) => {
        console.error('Falha ao enviar notificação do onboarding:', notificationError);
      });

      setStatus('success');
    } catch (error) {
      console.error('Erro ao enviar onboarding:', error);
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-y-auto bg-white"
        >
          <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
              <div className="text-xl font-bold tracking-tighter text-gray-900">
                Inter<span className="text-brand">nova</span>
              </div>
              <div className="hidden items-center gap-2 text-sm font-semibold text-gray-500 sm:flex">
                <ShieldCheck size={17} className="text-emerald-600" />
                {content.badge}
              </div>
              <button
                type="button"
                onClick={closeOnboarding}
                aria-label={content.close}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                <X size={20} />
              </button>
            </div>
            <div className="h-1 bg-gray-100" aria-label={content.progress}>
              <motion.div className="h-full bg-brand" animate={{ width: `${progress}%` }} transition={{ duration: 0.35 }} />
            </div>
          </header>

          <main className="mx-auto flex min-h-[calc(100vh-68px)] max-w-6xl items-center justify-center px-4 py-5 sm:px-5 md:min-h-[calc(100vh-84px)] md:px-8 md:py-10">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.section
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto flex max-w-2xl flex-col items-center py-8 text-center md:py-16"
                >
                  <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={40} />
                  </div>
                  <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">{content.successEyebrow}</p>
                  <h2 ref={headingRef} tabIndex={-1} id="onboarding-title" className="text-4xl font-extrabold tracking-tight text-gray-900 outline-none md:text-5xl">
                    {content.successTitle}
                  </h2>
                  <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-gray-600">{content.successBody}</p>
                  <div className="mt-8 flex items-center gap-2 rounded-full bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-600">
                    <ShieldCheck size={18} className="text-brand" /> {content.successNote}
                  </div>
                  <button type="button" onClick={closeOnboarding} className="mt-10 rounded-full bg-brand px-8 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-brand/20">
                    {content.finish}
                  </button>
                </motion.section>
              ) : isContactStep ? (
                <motion.section
                  key="contact"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid w-full max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
                >
                  <div className="pt-2 lg:pt-8">
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-brand">{content.contactEyebrow}</p>
                    <h2 ref={headingRef} tabIndex={-1} id="onboarding-title" className="text-4xl font-extrabold tracking-tight text-gray-900 outline-none md:text-5xl">
                      {content.contactTitle}
                    </h2>
                    <p className="mt-5 text-lg font-medium leading-relaxed text-gray-600">{content.contactSubtitle}</p>

                    <div className="mt-8 rounded-3xl border border-brand/15 bg-brand/[0.04] p-6">
                      <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white"><Target size={22} /></div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">{content.recommendationLabel}</p>
                          <h3 className="mt-1 text-lg font-bold text-gray-900">{recommendation[0]}</h3>
                          <p className="mt-2 text-sm font-medium leading-relaxed text-gray-600">{recommendation[1]}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="rounded-[2rem] border border-gray-200 bg-gray-50 p-6 shadow-sm md:p-8">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="sm:col-span-2">
                        <span className="mb-2 block text-sm font-bold text-gray-800">{content.name}</span>
                        <input required autoComplete="name" value={contact.name} onChange={(event) => setContact((current) => ({ ...current, name: event.target.value }))} placeholder={content.namePlaceholder} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10" />
                      </label>
                      <label className="sm:col-span-2">
                        <span className="mb-2 block text-sm font-bold text-gray-800">{content.email}</span>
                        <input required type="email" autoComplete="email" value={contact.email} onChange={(event) => setContact((current) => ({ ...current, email: event.target.value }))} placeholder={content.emailPlaceholder} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10" />
                      </label>
                      <label>
                        <span className="mb-2 block text-sm font-bold text-gray-800">{content.phone}</span>
                        <input required type="tel" autoComplete="tel" value={contact.phone} onChange={(event) => setContact((current) => ({ ...current, phone: event.target.value }))} placeholder={content.phonePlaceholder} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10" />
                      </label>
                      <label>
                        <span className="mb-2 block text-sm font-bold text-gray-800">{content.company}</span>
                        <input autoComplete="organization" value={contact.company} onChange={(event) => setContact((current) => ({ ...current, company: event.target.value }))} placeholder={content.companyPlaceholder} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10" />
                      </label>
                    </div>

                    {status === 'error' && <p role="alert" className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{content.error}</p>}

                    <button disabled={status === 'loading'} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-brand-hover disabled:translate-y-0 disabled:cursor-wait disabled:opacity-60">
                      {status === 'loading' ? <><Loader2 size={19} className="animate-spin" />{content.submitting}</> : <>{intent === 'schedule' ? content.submitSchedule : content.submitStart}<ArrowRight size={19} /></>}
                    </button>
                    <p className="mt-4 flex items-start justify-center gap-2 text-center text-xs font-medium leading-relaxed text-gray-500"><ShieldCheck size={15} className="mt-0.5 shrink-0" />{content.privacy}</p>
                  </form>
                </motion.section>
              ) : (
                <motion.section
                  key={question.key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full max-w-4xl"
                >
                  <div>
                    <div className="text-center">
                      {step === 0 ? (
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-brand sm:hidden">
                          <Sparkles size={13} />{content.badge}
                        </div>
                      ) : (
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-brand sm:mb-3 sm:text-sm">{question.eyebrow}</p>
                      )}
                      <h2 ref={headingRef} tabIndex={-1} id="onboarding-title" className="mx-auto max-w-3xl text-2xl font-extrabold tracking-tight text-gray-900 outline-none sm:text-3xl md:text-4xl">{question.title}</h2>
                      <p className={`mx-auto mt-2 max-w-2xl text-sm font-medium text-gray-500 sm:mt-3 sm:text-base ${step === 0 ? 'hidden sm:block' : ''}`}>{question.subtitle}</p>
                      {step === 0 && plan && <p className="mt-2 text-xs font-semibold text-gray-500">{content.plan}: <span className="text-gray-900">{plan}</span></p>}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4">
                      {question.options.map((option) => {
                        const selected = answers[question.key] === option.id;
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            aria-pressed={selected}
                            disabled={isAdvancing}
                            onClick={() => selectAnswer(question.key, option.id)}
                            className={`group relative flex min-h-28 flex-col items-start gap-2 rounded-2xl border p-3.5 text-left outline-none transition-all focus:ring-4 focus:ring-brand/10 disabled:cursor-default sm:min-h-32 sm:flex-row sm:gap-4 sm:p-5 ${selected ? 'border-brand bg-brand/[0.04] shadow-md shadow-brand/5' : 'border-gray-200 bg-white hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md'}`}
                          >
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors sm:h-11 sm:w-11 sm:rounded-xl ${selected ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-brand/10 group-hover:text-brand'}`}><Icon size={20} /></span>
                            <span className="pr-2 sm:pr-5">
                              <span className="block text-sm font-bold leading-snug text-gray-900 sm:text-base">{option.title}</span>
                              <span className="mt-1.5 hidden text-sm font-medium leading-relaxed text-gray-500 sm:block">{option.description}</span>
                            </span>
                            <span className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border transition-colors sm:right-4 sm:top-4 sm:h-6 sm:w-6 ${selected ? 'border-brand bg-brand text-white' : 'border-gray-200 bg-white text-transparent'}`}><Check size={12} strokeWidth={3} /></span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 sm:mt-9 sm:pt-6">
                    <button type="button" onClick={goBack} className="flex items-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-bold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:gap-2 sm:px-4 sm:py-3"><ArrowLeft size={17} />{content.back}</button>
                    <span className="px-3 text-xs font-bold tabular-nums text-gray-400">{step + 1} / {questions.length}</span>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
