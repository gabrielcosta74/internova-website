import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../lib/i18n/LanguageContext';
import pt from '../lib/i18n/pt.json';
import en from '../lib/i18n/en.json';
import {
    Loader2, Mail, Calendar, ShieldCheck,
    LayoutDashboard, Inbox, Package, PenSquare, LogOut,
    CheckCircle2, Search,
    ChevronDown, ChevronUp, Save, RefreshCw,
    Star, Menu, Check, Target, Zap, TrendingUp,
    ArrowRight, Eye, ArrowUpRight,
    Building2, Phone, CircleDollarSign, Clock3, ExternalLink, Sparkles
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────
interface Lead {
    id: string;
    name: string;
    email: string;
    challenge: string;
    created_at: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    notes: string;
}

interface SiteContentRow {
    section: string;
    key: string;
    value_pt: string;
    value_en: string;
}

type Tab = 'dashboard' | 'leads' | 'plans' | 'content';

type ContentLang = 'pt' | 'en';

interface LeadDetails {
    source?: string;
    plan?: string;
    company?: string;
    phone?: string;
    goal?: string;
    acquisition?: string;
    investment?: string;
    timeline?: string;
    recommendation?: string;
}

// All editable sections and their keys with labels
const CONTENT_SECTIONS: Record<string, { label: string; keys: { key: string; label: string; multiline?: boolean; isArray?: boolean }[] }> = {
    hero: {
        label: 'Hero',
        keys: [
            { key: 'badge', label: 'Badge' },
            { key: 'title1', label: 'Título linha 1' },
            { key: 'title2', label: 'Título linha 2' },
            { key: 'description', label: 'Descrição', multiline: true },
            { key: 'cta_primary', label: 'Botão Principal' },
            { key: 'cta_secondary', label: 'Botão Secundário' },
            { key: 'ticker1_title', label: 'Ticker 1 Título' },
            { key: 'ticker1_desc', label: 'Ticker 1 Desc' },
            { key: 'ticker2_title', label: 'Ticker 2 Título' },
            { key: 'ticker2_desc', label: 'Ticker 2 Desc' },
            { key: 'ticker3_title', label: 'Ticker 3 Título' },
            { key: 'ticker3_desc', label: 'Ticker 3 Desc' },
            { key: 'ticker4_title', label: 'Ticker 4 Título' },
            { key: 'ticker4_desc', label: 'Ticker 4 Desc' },
        ]
    },
    comparison: {
        label: 'Comparação',
        keys: [
            { key: 'title1', label: 'Título parte 1' },
            { key: 'title2', label: 'Título parte 2' },
            { key: 'title3', label: 'Título parte 3' },
            { key: 'subtitle', label: 'Subtítulo', multiline: true },
            { key: 'traditional_title', label: 'Título Coluna Esquerda' },
            { key: 'traditional_points', label: 'Pontos Tradicionais (1 por linha)', multiline: true, isArray: true },
            { key: 'internova_title', label: 'Título Coluna Direita' },
            { key: 'internova_points', label: 'Pontos Internova (1 por linha)', multiline: true, isArray: true },
        ]
    },
    services: {
        label: 'Serviços',
        keys: [
            { key: 'title1', label: 'Título parte 1' },
            { key: 'title2', label: 'Título parte 2' },
            { key: 'subtitle', label: 'Subtítulo', multiline: true },
            { key: 's1_title', label: 'Serviço 1 Nome' },
            { key: 's1_desc', label: 'Serviço 1 Descrição', multiline: true },
            { key: 's1_tags', label: 'Serviço 1 Tags (1 por linha)', multiline: true, isArray: true },
            { key: 's2_title', label: 'Serviço 2 Nome' },
            { key: 's2_desc', label: 'Serviço 2 Descrição', multiline: true },
            { key: 's2_tags', label: 'Serviço 2 Tags (1 por linha)', multiline: true, isArray: true },
            { key: 's3_title', label: 'Serviço 3 Nome' },
            { key: 's3_desc', label: 'Serviço 3 Descrição', multiline: true },
            { key: 's3_tags', label: 'Serviço 3 Tags (1 por linha)', multiline: true, isArray: true },
        ]
    },
    pricing: {
        label: 'Planos',
        keys: [
            { key: 'title1', label: 'Título parte 1' },
            { key: 'title2', label: 'Título parte 2' },
            { key: 'subtitle', label: 'Subtítulo', multiline: true },
            { key: 'popular_badge', label: 'Badge "Mais Escolhido"' },
            { key: 'schedule_btn', label: 'Botão Agendar' },
            { key: 'custom_title', label: 'Solução personalizada Título' },
            { key: 'custom_desc', label: 'Solução personalizada Desc' },
            { key: 'p1_name', label: 'Plano 1 Nome' },
            { key: 'p1_tagline', label: 'Plano 1 Tagline' },
            { key: 'p1_desc', label: 'Plano 1 Descrição', multiline: true },
            { key: 'p1_features', label: 'Plano 1 Features (1 por linha)', multiline: true, isArray: true },
            { key: 'p1_benefit', label: 'Plano 1 Benefício' },
            { key: 'p2_name', label: 'Plano 2 Nome' },
            { key: 'p2_tagline', label: 'Plano 2 Tagline' },
            { key: 'p2_desc', label: 'Plano 2 Descrição', multiline: true },
            { key: 'p2_features', label: 'Plano 2 Features (1 por linha)', multiline: true, isArray: true },
            { key: 'p2_benefit', label: 'Plano 2 Benefício' },
            { key: 'p3_name', label: 'Plano 3 Nome' },
            { key: 'p3_tagline', label: 'Plano 3 Tagline' },
            { key: 'p3_desc', label: 'Plano 3 Descrição', multiline: true },
            { key: 'p3_features', label: 'Plano 3 Features (1 por linha)', multiline: true, isArray: true },
            { key: 'p3_benefit', label: 'Plano 3 Benefício' },
        ]
    },
    footer: {
        label: 'Rodapé / Formulário',
        keys: [
            { key: 'title1', label: 'Título parte 1' },
            { key: 'title2', label: 'Título parte 2' },
            { key: 'subtitle', label: 'Subtítulo', multiline: true },
            { key: 'form_title', label: 'Título Formulário' },
            { key: 'form_name', label: 'Label Nome' },
            { key: 'form_name_placeholder', label: 'Placeholder Nome' },
            { key: 'form_email', label: 'Label Email' },
            { key: 'form_email_placeholder', label: 'Placeholder Email' },
            { key: 'form_challenge', label: 'Label Desafio' },
            { key: 'form_challenge_placeholder', label: 'Placeholder Desafio', multiline: true },
            { key: 'form_submit', label: 'Botão Enviar' },
        ]
    },
    nav: {
        label: 'Navegação',
        keys: [
            { key: 'consulting', label: 'Link Consultoria' },
            { key: 'results', label: 'Link A nossa estratégia' },
            { key: 'solutions', label: 'Link Soluções' },
            { key: 'schedule', label: 'Botão Agendar' },
        ]
    }
};

// ─── Helpers ──────────────────────────────────────────────────
const getJsonDefault = (section: string, key: string, lang: 'pt' | 'en'): string => {
    const dict = lang === 'pt' ? pt : en;
    const sec = (dict as Record<string, Record<string, unknown>>)[section];
    if (!sec) return '';
    const val = sec[key];
    if (Array.isArray(val)) return val.join('\n');
    return (val as string) ?? '';
};

const parseLeadDetails = (challenge: string): LeadDetails => {
    const fields: Record<string, keyof LeadDetails> = {
        'Origem': 'source',
        'Plano de interesse': 'plan',
        'Empresa / website': 'company',
        'Telefone': 'phone',
        'Objetivo': 'goal',
        'Aquisição atual': 'acquisition',
        'Investimento': 'investment',
        'Prazo': 'timeline',
        'Recomendação apresentada': 'recommendation',
    };

    return challenge.split('\n').reduce<LeadDetails>((details, line) => {
        const separator = line.indexOf(':');
        if (separator === -1) return details;
        const key = line.slice(0, separator).trim();
        const field = fields[key];
        if (field) details[field] = line.slice(separator + 1).trim();
        return details;
    }, {});
};

const formatLeadDate = (date: string) => new Date(date).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

const STATUS_CONFIG = {
    new:      { label: 'Novo',       color: 'text-blue-700 bg-blue-50 border-blue-200' },
    read:     { label: 'Em análise', color: 'text-slate-600 bg-slate-50 border-slate-200' },
    replied:  { label: 'Contactado', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    archived: { label: 'Arquivado',  color: 'text-amber-700 bg-amber-50 border-amber-200' },
} as const;

// ─── Sub-components ───────────────────────────────────────────

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; sub?: string; tone?: string }> = ({ icon, label, value, sub, tone = 'bg-brand/10 text-brand' }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>{icon}</div>
        <div>
            <p className="mb-1 text-sm font-semibold text-gray-500">{label}</p>
            <p className="text-3xl font-extrabold tracking-tight text-gray-900">{value}</p>
            {sub && <p className="mt-1 text-xs font-medium text-gray-400">{sub}</p>}
        </div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────
export const Admin: React.FC = () => {
    const { refreshContent } = useLanguage();
    const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('internova_admin') === 'active');
    const [secret, setSecret] = useState('');
    const [loginError, setLoginError] = useState('');
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const adminSecret = import.meta.env.VITE_ADMIN_SECRET || 'internova2025';

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (secret === adminSecret) {
            setIsAuthenticated(true);
            sessionStorage.setItem('internova_admin', 'active');
            setLoginError('');
        } else {
            setLoginError('Código incorreto.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('internova_admin');
        setSecret('');
        setActiveTab('dashboard');
    };

    // ── Login Screen ──
    if (!isAuthenticated) {
        return (
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-5 py-10 text-gray-900">
                <div className="absolute inset-0 bg-[radial-gradient(#dbeafe_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
                <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
                <div className="relative w-full max-w-md rounded-[2rem] border border-gray-200 bg-white p-7 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.18)] sm:p-10">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="text-2xl font-bold tracking-tighter text-gray-900">Inter<span className="text-brand">nova</span></div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                            <ShieldCheck size={22} />
                        </div>
                    </div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand">Área reservada</p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Bem-vindo de volta.</h1>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">Aceda às oportunidades, conteúdos e soluções da Internova num único lugar.</p>
                    <form onSubmit={handleLogin} className="mt-8 space-y-4">
                        <label className="block text-sm font-bold text-gray-700" htmlFor="admin-code">Código de acesso</label>
                        <input
                            id="admin-code"
                            type="password"
                            value={secret}
                            onChange={(e) => { setSecret(e.target.value); setLoginError(''); }}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
                            placeholder="Introduza o código"
                            autoFocus
                        />
                        {loginError && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{loginError}</p>}
                        <button className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-4 font-bold text-white shadow-lg shadow-brand/15 transition-all hover:-translate-y-0.5 hover:bg-brand-hover">
                            Entrar no painel <ArrowRight size={18} />
                        </button>
                    </form>
                    <a href="/" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-400 transition-colors hover:text-brand">Voltar ao website <ArrowUpRight size={15} /></a>
                </div>
            </div>
        );
    }

    // ── Sidebar Nav ──
    const navItems: { id: Tab; label: string; description: string; group: string; icon: React.ReactNode }[] = [
        { id: 'dashboard', label: 'Visão geral', description: 'Resumo do negócio', group: 'Negócio', icon: <LayoutDashboard size={19} /> },
        { id: 'leads', label: 'Oportunidades', description: 'Leads e contactos', group: 'Negócio', icon: <Inbox size={19} /> },
        { id: 'plans', label: 'Soluções', description: 'Planos comerciais', group: 'Website', icon: <Package size={19} /> },
        { id: 'content', label: 'Conteúdo', description: 'Textos e secções', group: 'Website', icon: <PenSquare size={19} /> },
    ];
    const activeItem = navItems.find((item) => item.id === activeTab) ?? navItems[0];
    const groups = ['Negócio', 'Website'];

    return (
        <div className="flex min-h-screen bg-[#f6f8fb] text-gray-900">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <button aria-label="Fechar menu" className="fixed inset-0 z-20 bg-gray-950/25 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 z-30 flex h-full w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="border-b border-gray-100 px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold tracking-tighter text-gray-900">Inter<span className="text-brand">nova</span></p>
                            <p className="mt-0.5 text-xs font-semibold text-gray-400">Centro de gestão</p>
                        </div>
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" title="Sistema online" />
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto px-4 py-5">
                    {groups.map((group) => (
                        <div key={group} className="mb-6">
                            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">{group}</p>
                            <div className="space-y-1">
                                {navItems.filter((item) => item.group === group).map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all ${activeTab === item.id ? 'bg-brand text-white shadow-md shadow-brand/15' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                    >
                                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${activeTab === item.id ? 'bg-white/15' : 'bg-gray-100 text-gray-500'}`}>{item.icon}</span>
                                        <span>
                                            <span className="block text-sm font-bold">{item.label}</span>
                                            <span className={`mt-0.5 block text-[11px] font-medium ${activeTab === item.id ? 'text-indigo-100' : 'text-gray-400'}`}>{item.description}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
                <div className="border-t border-gray-100 p-4">
                    <a href="/" target="_blank" rel="noreferrer" className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-brand"><ExternalLink size={18} /> Ver website</a>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex min-h-screen flex-1 flex-col lg:ml-72">
                {/* Top bar */}
                <header className="sticky top-0 z-10 flex min-h-20 items-center gap-4 border-b border-gray-200 bg-white/90 px-5 backdrop-blur-xl md:px-8">
                    <button aria-label="Abrir menu" className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <Menu size={19} />
                    </button>
                    <div>
                        <h1 className="text-lg font-extrabold tracking-tight text-gray-900">{activeItem.label}</h1>
                        <p className="hidden text-xs font-medium text-gray-400 sm:block">{activeItem.description}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                        <span className="hidden rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 sm:inline-flex">Sistema online</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">IN</div>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 md:p-8">
                    {activeTab === 'dashboard' && <DashboardTab onNavigate={setActiveTab} />}
                    {activeTab === 'leads'     && <LeadsTab />}
                    {activeTab === 'plans'     && <PlansTab onSave={refreshContent} />}
                    {activeTab === 'content'   && <ContentTab onSave={refreshContent} />}
                </main>
            </div>
        </div>
    );
};

// ══════════════════════════════════════════════════════════════
// DASHBOARD TAB
// ══════════════════════════════════════════════════════════════
const DashboardTab: React.FC<{ onNavigate: (tab: Tab) => void }> = ({ onNavigate }) => {
    const [stats, setStats] = useState({ total: 0, newLeads: 0, replied: 0, thisWeek: 0 });
    const [recent, setRecent] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
            if (data) {
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                setStats({
                    total: data.length,
                    newLeads: data.filter((l: Lead) => l.status === 'new' || !l.status).length,
                    replied: data.filter((l: Lead) => l.status === 'replied').length,
                    thisWeek: data.filter((l: Lead) => new Date(l.created_at) >= sevenDaysAgo).length,
                });
                setRecent(data.slice(0, 5));
            }
            setLoading(false);
        };
        fetch();
    }, []);

    if (loading) return <div className="flex justify-center py-32"><Loader2 size={32} className="animate-spin text-brand" /></div>;

    const contactRate = stats.total > 0 ? Math.round((stats.replied / stats.total) * 100) : 0;

    return (
        <div className="mx-auto max-w-7xl space-y-7">
            <section className="relative overflow-hidden rounded-[2rem] bg-gray-900 px-6 py-8 text-white shadow-xl shadow-gray-900/10 sm:px-8 md:py-10">
                <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
                <div className="absolute bottom-0 right-1/3 h-32 w-32 rounded-full bg-blue-400/20 blur-2xl" />
                <div className="relative flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-bold text-indigo-100"><Sparkles size={14} /> Centro de crescimento</div>
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">O seu negócio, num só lugar.</h2>
                        <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-gray-300 sm:text-base">Acompanhe novas oportunidades, prepare o contacto comercial e mantenha o website sempre alinhado com a estratégia.</p>
                    </div>
                    <button onClick={() => onNavigate('leads')} className="flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-gray-900 transition-transform hover:-translate-y-0.5">Ver oportunidades <ArrowUpRight size={17} /></button>
                </div>
            </section>

            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <StatCard icon={<Inbox size={20} />} label="Total de leads" value={stats.total} sub="Desde o início" />
                <StatCard icon={<Star size={20} />} label="Por contactar" value={stats.newLeads} sub="Precisam de atenção" tone="bg-blue-50 text-blue-600" />
                <StatCard icon={<TrendingUp size={20} />} label="Últimos 7 dias" value={stats.thisWeek} sub="Novas oportunidades" tone="bg-violet-50 text-violet-600" />
                <StatCard icon={<CheckCircle2 size={20} />} label="Taxa de contacto" value={`${contactRate}%`} sub={`${stats.replied} contactados`} tone="bg-emerald-50 text-emerald-600" />
            </div>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
                    <div>
                        <h2 className="font-extrabold tracking-tight text-gray-900">Oportunidades recentes</h2>
                        <p className="mt-1 text-xs font-medium text-gray-400">Os últimos pedidos recebidos pelo website</p>
                    </div>
                    <button onClick={() => onNavigate('leads')} className="flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-hover">Ver todas <ArrowUpRight size={15} /></button>
                </div>
                {recent.length === 0 ? (
                    <div className="px-6 py-14 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400"><Inbox size={22} /></div>
                        <p className="font-bold text-gray-700">Ainda não há oportunidades.</p>
                        <p className="mt-1 text-sm text-gray-400">Os pedidos do onboarding vão aparecer aqui.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {recent.map((lead) => {
                            const details = parseLeadDetails(lead.challenge);
                            const leadStatus = lead.status ?? 'new';
                            return (
                            <button key={lead.id} onClick={() => onNavigate('leads')} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50 sm:px-6">
                                <div className="flex min-w-0 items-center gap-3.5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 font-bold text-brand">
                                        {lead.name.slice(0, 1).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 text-left">
                                        <p className="truncate text-sm font-bold text-gray-900">{lead.name}</p>
                                        <p className="mt-0.5 truncate text-xs font-medium text-gray-400">{details.goal || lead.email}</p>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-3">
                                    <span className={`hidden rounded-full border px-2.5 py-1 text-[11px] font-bold sm:inline-flex ${STATUS_CONFIG[leadStatus].color}`}>{STATUS_CONFIG[leadStatus].label}</span>
                                    <span className="hidden text-xs font-medium text-gray-400 md:block">{formatLeadDate(lead.created_at)}</span>
                                    <ChevronDown size={16} className="-rotate-90 text-gray-300" />
                                </div>
                            </button>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

// ══════════════════════════════════════════════════════════════
// LEADS TAB
// ══════════════════════════════════════════════════════════════
const LeadsTab: React.FC = () => {
    const [leads, setLeads]       = useState<Lead[]>([]);
    const [loading, setLoading]   = useState(true);
    const [search, setSearch]     = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [expandedId, setExpandedId]     = useState<string | null>(null);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [noteEdit, setNoteEdit] = useState<Record<string, string>>({});

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        setLeads(data || []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchLeads(); }, [fetchLeads]);

    const updateStatus = async (id: string, status: Lead['status']) => {
        setSavingId(id);
        await supabase.from('leads').update({ status }).eq('id', id);
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        setSavingId(null);
    };

    const saveNote = async (id: string) => {
        setSavingId(id);
        await supabase.from('leads').update({ notes: noteEdit[id] ?? '' }).eq('id', id);
        setLeads(prev => prev.map(l => l.id === id ? { ...l, notes: noteEdit[id] ?? '' } : l));
        setSavingId(null);
    };

    const filtered = leads.filter(l => {
        const query = search.toLowerCase();
        const details = parseLeadDetails(l.challenge);
        const matchSearch = l.name.toLowerCase().includes(query) ||
            l.email.toLowerCase().includes(query) ||
            details.company?.toLowerCase().includes(query) ||
            details.goal?.toLowerCase().includes(query);
        const matchStatus = statusFilter === 'all' || (l.status ?? 'new') === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="mx-auto max-w-7xl space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Pipeline comercial</p>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">Oportunidades</h2>
                    <p className="mt-1 text-sm font-medium text-gray-500">Consulte o diagnóstico e acompanhe cada contacto até à resposta.</p>
                </div>
                <button onClick={fetchLeads} className="flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 shadow-sm transition-all hover:border-gray-300 hover:text-brand">
                    <RefreshCw size={15} /> Atualizar
                </button>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:flex-row">
                <div className="relative flex-1">
                    <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar por nome, email ou empresa…" className="w-full rounded-xl border border-transparent bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-brand/30 focus:bg-white focus:ring-4 focus:ring-brand/10" />
                </div>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600 outline-none focus:border-brand/30 focus:ring-4 focus:ring-brand/10">
                    <option value="all">Todos os estados</option>
                    <option value="new">Novos</option>
                    <option value="read">Em análise</option>
                    <option value="replied">Contactados</option>
                    <option value="archived">Arquivados</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center py-32"><Loader2 size={32} className="animate-spin text-brand" /></div>
            ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400"><Search size={21} /></div>
                    <p className="font-bold text-gray-700">Nenhuma oportunidade encontrada.</p>
                    <p className="mt-1 text-sm text-gray-400">Altere a pesquisa ou o filtro selecionado.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((lead) => {
                        const isExpanded = expandedId === lead.id;
                        const leadStatus = lead.status ?? 'new';
                        const details = parseLeadDetails(lead.challenge);
                        const toggleLead = () => {
                            setExpandedId(isExpanded ? null : lead.id);
                            if (!isExpanded && !noteEdit[lead.id]) setNoteEdit((current) => ({ ...current, [lead.id]: lead.notes ?? '' }));
                            if (!isExpanded && leadStatus === 'new') updateStatus(lead.id, 'read');
                        };

                        return (
                            <article key={lead.id} className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${isExpanded ? 'border-brand/30 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                                <button type="button" onClick={toggleLead} className="flex w-full items-center gap-4 p-4 text-left sm:p-5">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 font-extrabold text-brand">{lead.name.slice(0, 1).toUpperCase()}</div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="truncate text-sm font-extrabold text-gray-900 sm:text-base">{lead.name}</h3>
                                            {leadStatus === 'new' && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                                        </div>
                                        <p className="mt-1 truncate text-xs font-medium text-gray-400">{details.company && details.company !== 'Não indicado' ? details.company : lead.email}</p>
                                    </div>
                                    <div className="hidden min-w-0 flex-1 md:block">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Objetivo</p>
                                        <p className="mt-1 truncate text-sm font-semibold text-gray-600">{details.goal || 'Pedido de contacto'}</p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-3">
                                        <span className={`hidden rounded-full border px-3 py-1.5 text-[11px] font-bold sm:inline-flex ${STATUS_CONFIG[leadStatus].color}`}>{STATUS_CONFIG[leadStatus].label}</span>
                                        <span className="hidden text-xs font-medium text-gray-400 lg:block">{formatLeadDate(lead.created_at)}</span>
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400">{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="border-t border-gray-100 bg-gray-50/70 p-4 sm:p-6">
                                        <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
                                            <div className="space-y-5">
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                                    {[
                                                        { label: 'Objetivo', value: details.goal, icon: <Target size={17} /> },
                                                        { label: 'Aquisição atual', value: details.acquisition, icon: <TrendingUp size={17} /> },
                                                        { label: 'Investimento', value: details.investment, icon: <CircleDollarSign size={17} /> },
                                                        { label: 'Prazo', value: details.timeline, icon: <Clock3 size={17} /> },
                                                    ].map((item) => (
                                                        <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4">
                                                            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">{item.icon}</div>
                                                            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-gray-400">{item.label}</p>
                                                            <p className="mt-1.5 text-sm font-bold leading-snug text-gray-700">{item.value || 'Não indicado'}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {details.recommendation && (
                                                    <div className="flex gap-3 rounded-2xl border border-brand/15 bg-brand/[0.04] p-4">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white"><Sparkles size={18} /></div>
                                                        <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand">Estratégia recomendada</p><p className="mt-1 text-sm font-bold text-gray-800">{details.recommendation}</p></div>
                                                    </div>
                                                )}

                                                <div>
                                                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Estado da oportunidade</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(['new', 'read', 'replied', 'archived'] as Lead['status'][]).map((statusOption) => (
                                                            <button key={statusOption} onClick={() => updateStatus(lead.id, statusOption)} disabled={savingId === lead.id} className={`rounded-full border px-3.5 py-2 text-xs font-bold transition-all ${leadStatus === statusOption ? STATUS_CONFIG[statusOption].color : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>{STATUS_CONFIG[statusOption].label}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <aside className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
                                                <div>
                                                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Contacto</p>
                                                    <div className="space-y-3 text-sm">
                                                        <a href={`mailto:${lead.email}`} className="flex items-start gap-2.5 font-semibold text-gray-700 hover:text-brand"><Mail size={16} className="mt-0.5 shrink-0 text-gray-400" /><span className="break-all">{lead.email}</span></a>
                                                        {details.phone && <a href={`tel:${details.phone}`} className="flex items-center gap-2.5 font-semibold text-gray-700 hover:text-brand"><Phone size={16} className="text-gray-400" />{details.phone}</a>}
                                                        {details.company && details.company !== 'Não indicado' && <p className="flex items-center gap-2.5 font-semibold text-gray-700"><Building2 size={16} className="text-gray-400" />{details.company}</p>}
                                                        <p className="flex items-center gap-2.5 text-xs font-medium text-gray-400"><Calendar size={16} />{formatLeadDate(lead.created_at)}</p>
                                                    </div>
                                                </div>
                                                <div className="border-t border-gray-100 pt-4">
                                                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-gray-400" htmlFor={`notes-${lead.id}`}>Notas internas</label>
                                                    <textarea id={`notes-${lead.id}`} rows={3} value={noteEdit[lead.id] ?? lead.notes ?? ''} onChange={(event) => setNoteEdit((current) => ({ ...current, [lead.id]: event.target.value }))} className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10" placeholder="Próximos passos, contexto…" />
                                                    <button onClick={() => saveNote(lead.id)} disabled={savingId === lead.id} className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:border-brand/30 hover:text-brand">{savingId === lead.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar nota</button>
                                                </div>
                                                <a href={`mailto:${lead.email}?subject=Internova - O seu diagnóstico estratégico`} onClick={() => updateStatus(lead.id, 'replied')} className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-bold text-white shadow-md shadow-brand/10 hover:bg-brand-hover"><Mail size={16} /> Contactar por email</a>
                                            </aside>
                                        </div>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ══════════════════════════════════════════════════════════════
// LIVE PREVIEW COMPONENTS (mirror actual site sections)
// ══════════════════════════════════════════════════════════════

const PreviewShell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 shrink-0">
            <Eye size={13} className="text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Preview ao vivo</span>
            <span className="text-xs text-gray-600 ml-1">— {label}</span>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-50 p-5">
            <div className="pointer-events-none select-none">
                {children}
            </div>
        </div>
    </div>
);

/* ── Hero Preview ── */
const HeroPreview: React.FC<{ g: (k: string) => string }> = ({ g }) => (
    <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
        {/* Mock navbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
            <span className="text-sm font-bold tracking-tighter">Inter<span className="text-indigo-400">nova</span>.</span>
            <div className="flex gap-4">
                {['A nossa estratégia', 'Consultoria', 'Soluções'].map(n => (
                    <span key={n} className="text-xs text-gray-500">{n}</span>
                ))}
            </div>
        </div>
        {/* Hero body */}
        <div className="px-6 pt-10 pb-8 space-y-5">
            {g('badge') && (
                <span className="inline-block text-xs px-3 py-1 rounded-full border border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
                    {g('badge')}
                </span>
            )}
            <div>
                <h1 className="text-3xl font-bold tracking-tighter leading-tight">
                    {g('title1')}<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                        {g('title2')}
                    </span>
                </h1>
            </div>
            {g('description') && (
                <p className="text-gray-400 text-sm leading-relaxed max-w-md">{g('description')}</p>
            )}
            <div className="flex gap-3">
                {g('cta_primary') && (
                    <span className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">{g('cta_primary')}</span>
                )}
                {g('cta_secondary') && (
                    <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600">{g('cta_secondary')}</span>
                )}
            </div>
            {/* Tickers */}
            <div className="grid grid-cols-2 gap-2 pt-2">
                {[1, 2, 3, 4].map(i => (
                    g(`ticker${i}_title`) ? (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-gray-800">{g(`ticker${i}_title`)}</p>
                                <p className="text-[10px] text-gray-500">{g(`ticker${i}_desc`)}</p>
                            </div>
                        </div>
                    ) : null
                ))}
            </div>
        </div>
    </div>
);

/* ── Comparison Preview ── */
const ComparisonPreview: React.FC<{ g: (k: string) => string; ga: (k: string) => string[] }> = ({ g, ga }) => (
    <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 p-5 space-y-4">
        <div className="text-center space-y-1">
            <h2 className="text-xl font-bold tracking-tight">
                {g('title1')} <span className="text-indigo-400">{g('title2')}</span> {g('title3')}
            </h2>
            {g('subtitle') && <p className="text-gray-500 text-xs">{g('subtitle')}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
            {/* Traditional */}
            <div className="bg-gray-50 rounded-xl p-3 border border-red-500/10 space-y-2">
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider">{g('traditional_title') || 'Tradicional'}</p>
                <ul className="space-y-1.5">
                    {ga('traditional_points').map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-400">
                            <span className="text-red-500 mt-0.5 shrink-0">✕</span> {pt}
                        </li>
                    ))}
                </ul>
            </div>
            {/* Internova */}
            <div className="bg-indigo-900/10 rounded-xl p-3 border border-indigo-500/20 space-y-2">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{g('internova_title') || 'Internova'}</p>
                <ul className="space-y-1.5">
                    {ga('internova_points').map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                            <span className="text-indigo-400 mt-0.5 shrink-0">✓</span> {pt}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

/* ── Services Preview ── */
const ServicesPreview: React.FC<{ g: (k: string) => string; ga: (k: string) => string[] }> = ({ g, ga }) => (
    <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 p-5 space-y-4">
        <div className="text-center space-y-1">
            <h2 className="text-xl font-bold tracking-tight">
                {g('title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{g('title2')}</span>
            </h2>
            {g('subtitle') && <p className="text-gray-500 text-xs">{g('subtitle')}</p>}
        </div>
        <div className="space-y-3">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
                    <p className="font-semibold text-sm">{g(`s${i}_title`)}</p>
                    <p className="text-gray-400 text-xs leading-relaxed">{g(`s${i}_desc`)}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {ga(`s${i}_tags`).map((tag, j) => (
                            <span key={j} className="text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/20 text-indigo-400 bg-indigo-500/5">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

/* ── Pricing (section header) Preview ── */
const PricingHeaderPreview: React.FC<{ g: (k: string) => string }> = ({ g }) => (
    <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 p-5 space-y-3 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
            {g('title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{g('title2')}</span>
        </h2>
        {g('subtitle') && <p className="text-gray-400 text-sm max-w-sm mx-auto">{g('subtitle')}</p>}
        <div className="flex justify-center gap-2 pt-2 flex-wrap">
            {['p1_name', 'p2_name', 'p3_name'].map((k, i) => (
                <span key={k} className={`text-xs px-3 py-1.5 rounded-lg border font-medium
                    ${i === 1 ? 'border-brand/30 bg-brand/10 text-brand' : 'border-gray-200 text-gray-500'}`}>
                    {g(k)}
                </span>
            ))}
        </div>
        <p className="text-xs text-gray-500 pt-1 italic">"{g('custom_title')}"</p>
    </div>
);

/* ── Footer Preview ── */
const FooterPreview: React.FC<{ g: (k: string) => string }> = ({ g }) => (
    <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 p-5 space-y-4">
        <div className="text-center space-y-1">
            <h2 className="text-xl font-bold tracking-tight">
                {g('title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{g('title2')}</span>
            </h2>
            {g('subtitle') && <p className="text-gray-500 text-xs">{g('subtitle')}</p>}
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
            <p className="font-semibold text-sm">{g('form_title')}</p>
            <div className="space-y-2">
                <div>
                    <p className="text-[10px] text-gray-500 mb-1">{g('form_name')}</p>
                    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600">
                        {g('form_name_placeholder')}
                    </div>
                </div>
                <div>
                    <p className="text-[10px] text-gray-500 mb-1">{g('form_email')}</p>
                    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600">
                        {g('form_email_placeholder')}
                    </div>
                </div>
                <div>
                    <p className="text-[10px] text-gray-500 mb-1">{g('form_challenge')}</p>
                    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 h-12">
                        {g('form_challenge_placeholder')}
                    </div>
                </div>
                <div className="w-full rounded-full bg-brand px-3 py-2 text-center text-xs font-semibold text-white">
                    {g('form_submit')}
                </div>
            </div>
        </div>
    </div>
);

/* ── Nav Preview ── */
const NavPreview: React.FC<{ g: (k: string) => string }> = ({ g }) => (
    <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
        <div className="px-5 py-3 flex items-center justify-between border-b border-gray-200">
            <span className="text-sm font-bold tracking-tighter">Inter<span className="text-indigo-400">nova</span>.</span>
            <div className="hidden sm:flex items-center gap-5">
                <span className="text-xs text-gray-400">{g('consulting')}</span>
                <span className="text-xs text-gray-400">{g('results')}</span>
                <span className="text-xs text-gray-400">{g('solutions')}</span>
                <span className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white">{g('schedule')}</span>
            </div>
        </div>
        <div className="p-4 text-center text-gray-600 text-xs">
            ↑ Barra de navegação do site
        </div>
    </div>
);

/* ── Plan Card Preview (used in PlansTab) ── */
const PlanCardPreview: React.FC<{
    name: string; tagline: string; desc: string;
    features: string[]; benefit: string; highlight: boolean;
    planKey: string;
}> = ({ name, tagline, desc, features, benefit, highlight, planKey }) => {
    const icon = planKey === 'p1'
        ? <Target size={22} className="text-indigo-400" />
        : planKey === 'p2'
            ? <Zap size={22} className="text-yellow-400" />
            : <TrendingUp size={22} className="text-purple-400" />;

    return (
        <div className={`relative rounded-2xl border p-5 flex flex-col gap-3 ${highlight
            ? 'border-indigo-500 bg-indigo-900/10 shadow-[0_0_40px_-10px_rgba(99,102,241,0.25)]'
            : 'border-gray-200 bg-gray-50'}`}>
            {highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Mais Escolhido
                </div>
            )}
            <div className="space-y-1">
                <div>{icon}</div>
                <p className="font-bold text-base tracking-tight">{name || '—'}</p>
                <p className="text-indigo-400 text-xs font-semibold leading-snug">{tagline}</p>
                <p className="text-gray-500 text-[11px] leading-relaxed">{desc}</p>
            </div>
            <div className="h-px bg-gray-100" />
            <ul className="space-y-2 flex-1">
                {features.filter(Boolean).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-gray-600">
                        <Check size={12} className={`mt-0.5 shrink-0 ${highlight ? 'text-indigo-400' : 'text-gray-500'}`} />
                        {f}
                    </li>
                ))}
            </ul>
            {benefit && (
                <p className="text-[10px] italic text-gray-500 text-center border border-gray-200 bg-gray-50 rounded-lg py-2 px-3">
                    "{benefit}"
                </p>
            )}
            <div className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase text-center
                ${highlight ? 'bg-white text-black' : 'bg-indigo-600 text-white'}`}>
                Agendar Diagnóstico
            </div>
        </div>
    );
};

// ══════════════════════════════════════════════════════════════
// PLANS TAB  (editor + live plan-card preview side by side)
// ══════════════════════════════════════════════════════════════
const PlansTab: React.FC<{ onSave: () => Promise<void> }> = ({ onSave }) => {
    type PlanKey = 'p1' | 'p2' | 'p3';
    const PLAN_KEYS: PlanKey[] = ['p1', 'p2', 'p3'];
    const PLAN_LABELS: Record<PlanKey, string> = {
        p1: 'Plano 1 — Presença & Autoridade',
        p2: 'Plano 2 — Crescimento & Tráfego',
        p3: 'Plano 3 — Escala & Automação',
    };
    const PLAN_FIELDS = [
        { key: 'name',     label: 'Nome do Plano',             multiline: false },
        { key: 'tagline',  label: 'Tagline',                   multiline: false },
        { key: 'desc',     label: 'Descrição',                 multiline: true  },
        { key: 'benefit',  label: 'Frase de Benefício',        multiline: false },
        { key: 'features', label: 'Funcionalidades (1 por linha)', multiline: true, isArray: true },
    ];

    const [activePlan, setActivePlan] = useState<PlanKey>('p1');
    const [lang, setLang] = useState<ContentLang>('pt');
    const [values, setValues] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved]   = useState(false);

    useEffect(() => {
        const load = async () => {
            const { data } = await supabase.from('site_content')
                .select('key, value_pt, value_en').eq('section', 'pricing');
            const map: Record<string, string> = {};
            PLAN_KEYS.forEach(p => {
                PLAN_FIELDS.forEach(f => {
                    const k = `${p}_${f.key}`;
                    map[`${k}_pt`] = getJsonDefault('pricing', k, 'pt');
                    map[`${k}_en`] = getJsonDefault('pricing', k, 'en');
                });
            });
            if (data) {
                data.forEach((row: { key: string; value_pt: string; value_en: string }) => {
                    if (row.value_pt !== null) map[`${row.key}_pt`] = row.value_pt;
                    if (row.value_en !== null) map[`${row.key}_en`] = row.value_en;
                });
            }
            setValues(map);
        };
        load();
    }, []);

    const g = (field: string) => values[`${activePlan}_${field}_${lang}`] ?? '';
    const getFeatures = () => g('features').split('\n').filter(Boolean);

    const handleChange = (fieldKey: string, val: string) =>
        setValues(prev => ({ ...prev, [`${fieldKey}_${lang}`]: val }));

    const handleSave = async () => {
        setSaving(true);
        const upserts: SiteContentRow[] = [];
        PLAN_KEYS.forEach(p => {
            PLAN_FIELDS.forEach(f => {
                const fullKey = `${p}_${f.key}`;
                const rawPt = values[`${fullKey}_pt`] ?? '';
                const rawEn = values[`${fullKey}_en`] ?? '';
                upserts.push({
                    section: 'pricing', key: fullKey,
                    value_pt: f.isArray ? JSON.stringify(rawPt.split('\n').filter(Boolean)) : rawPt,
                    value_en: f.isArray ? JSON.stringify(rawEn.split('\n').filter(Boolean)) : rawEn,
                });
            });
        });
        await supabase.from('site_content').upsert(upserts, { onConflict: 'section,key' });
        await onSave();
        setSaving(false); setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="mx-auto h-full max-w-7xl space-y-5">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Oferta comercial</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">Soluções e planos</h2>
                <p className="mt-1 text-sm font-medium text-gray-500">Edite a proposta de valor de cada solução e confirme o resultado na pré-visualização.</p>
            </div>
            {/* Plan + lang selectors */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2 flex-wrap">
                    {PLAN_KEYS.map(p => (
                        <button key={p} onClick={() => setActivePlan(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                ${activePlan === p ? 'bg-brand text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900'}`}>
                            {p === 'p2' ? '⭐ ' : ''}{PLAN_LABELS[p].split('—')[0].trim()}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
                        {(['pt', 'en'] as ContentLang[]).map(l => (
                            <button key={l} onClick={() => setLang(l)}
                                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors
                                    ${lang === l ? 'bg-brand text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                                {l}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleSave} disabled={saving}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors
                            ${saved ? 'bg-emerald-600 text-white' : 'bg-brand hover:bg-brand-hover text-white'}`}>
                        {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
                        {saved ? 'Guardado!' : saving ? 'A guardar…' : 'Guardar'}
                    </button>
                </div>
            </div>

            {/* Split pane */}
            <div className="grid min-h-[600px] grid-cols-1 gap-4 xl:grid-cols-2">
                {/* ── Editor ── */}
                <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Editor</p>
                        <p className="text-xs text-gray-600 mt-0.5">{PLAN_LABELS[activePlan]}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {PLAN_FIELDS.map(f => {
                            const fieldKey = `${activePlan}_${f.key}`;
                            const val = values[`${fieldKey}_${lang}`] ?? '';
                            return (
                                <div key={f.key}>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                        {f.label}
                                    </label>
                                    {f.multiline ? (
                                        <textarea rows={f.isArray ? 7 : 3} value={val}
                                            onChange={e => handleChange(fieldKey, e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 resize-y focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                                        />
                                    ) : (
                                        <input type="text" value={val}
                                            onChange={e => handleChange(fieldKey, e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    )}
                                    {f.isArray && (
                                        <p className="text-[10px] text-gray-600 mt-1">Uma funcionalidade por linha</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Preview ── */}
                <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <PreviewShell label={PLAN_LABELS[activePlan]}>
                        <PlanCardPreview
                            name={g('name')}
                            tagline={g('tagline')}
                            desc={g('desc')}
                            features={getFeatures()}
                            benefit={g('benefit')}
                            highlight={activePlan === 'p2'}
                            planKey={activePlan}
                        />
                    </PreviewShell>
                </div>
            </div>
        </div>
    );
};

// ══════════════════════════════════════════════════════════════
// CONTENT TAB  (editor + section-specific live preview)
// ══════════════════════════════════════════════════════════════
const ContentTab: React.FC<{ onSave: () => Promise<void> }> = ({ onSave }) => {
    const sectionKeys = Object.keys(CONTENT_SECTIONS) as (keyof typeof CONTENT_SECTIONS)[];
    const [activeSection, setActiveSection] = useState(sectionKeys[0]);
    const [lang, setLang]   = useState<ContentLang>('pt');
    const [values, setValues] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved]   = useState(false);

    useEffect(() => {
        const load = async () => {
            const { data } = await supabase.from('site_content').select('section, key, value_pt, value_en');
            const map: Record<string, string> = {};
            sectionKeys.forEach(sec => {
                CONTENT_SECTIONS[sec].keys.forEach(({ key }) => {
                    map[`${sec}.${key}.pt`] = getJsonDefault(sec, key, 'pt');
                    map[`${sec}.${key}.en`] = getJsonDefault(sec, key, 'en');
                });
            });
            if (data) {
                data.forEach((row: { section: string; key: string; value_pt: string | null; value_en: string | null }) => {
                    const fieldDef = CONTENT_SECTIONS[row.section]?.keys.find(k => k.key === row.key);
                    const apply = (lang: 'pt' | 'en', raw: string | null) => {
                        if (raw === null) return;
                        if (fieldDef?.isArray) {
                            try {
                                const arr = JSON.parse(raw) as string[];
                                map[`${row.section}.${row.key}.${lang}`] = Array.isArray(arr) ? arr.join('\n') : raw;
                            } catch { map[`${row.section}.${row.key}.${lang}`] = raw; }
                        } else {
                            map[`${row.section}.${row.key}.${lang}`] = raw;
                        }
                    };
                    apply('pt', row.value_pt);
                    apply('en', row.value_en);
                });
            }
            setValues(map);
        };
        load();
    }, []);

    // Getter helpers
    const g  = (sec: string, key: string) => values[`${sec}.${key}.${lang}`] ?? '';
    const ga = (sec: string, key: string) => (values[`${sec}.${key}.${lang}`] ?? '').split('\n').filter(Boolean);

    const handleChange = (key: string, val: string) =>
        setValues(prev => ({ ...prev, [`${activeSection}.${key}.${lang}`]: val }));

    const handleSave = async () => {
        setSaving(true);
        const fields = CONTENT_SECTIONS[activeSection].keys;
        const upserts: SiteContentRow[] = fields.map(({ key, isArray }) => {
            const rawPt = values[`${activeSection}.${key}.pt`] ?? '';
            const rawEn = values[`${activeSection}.${key}.en`] ?? '';
            return {
                section: activeSection, key,
                value_pt: isArray ? JSON.stringify(rawPt.split('\n').filter(Boolean)) : rawPt,
                value_en: isArray ? JSON.stringify(rawEn.split('\n').filter(Boolean)) : rawEn,
            };
        });
        await supabase.from('site_content').upsert(upserts, { onConflict: 'section,key' });
        await onSave();
        setSaving(false); setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const renderPreview = () => {
        const sec = activeSection;
        const gs  = (k: string) => g(sec, k);
        const gas = (k: string) => ga(sec, k);
        switch (sec) {
            case 'hero':       return <HeroPreview g={gs} />;
            case 'comparison': return <ComparisonPreview g={gs} ga={gas} />;
            case 'services':   return <ServicesPreview g={gs} ga={gas} />;
            case 'pricing':    return <PricingHeaderPreview g={gs} />;
            case 'footer':     return <FooterPreview g={gs} />;
            case 'nav':        return <NavPreview g={gs} />;
            default:           return null;
        }
    };

    const section = CONTENT_SECTIONS[activeSection];

    return (
        <div className="mx-auto h-full max-w-7xl space-y-5">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Gestão do website</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">Conteúdo</h2>
                <p className="mt-1 text-sm font-medium text-gray-500">Atualize os textos por secção e idioma com uma pré-visualização imediata.</p>
            </div>
            {/* Section + lang + save bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    {sectionKeys.map(sec => (
                        <button key={sec} onClick={() => setActiveSection(sec)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                ${activeSection === sec ? 'bg-brand text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900'}`}>
                            {CONTENT_SECTIONS[sec].label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
                        {(['pt', 'en'] as ContentLang[]).map(l => (
                            <button key={l} onClick={() => setLang(l)}
                                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors
                                    ${lang === l ? 'bg-brand text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                                {l}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleSave} disabled={saving}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors
                            ${saved ? 'bg-emerald-600 text-white' : 'bg-brand hover:bg-brand-hover text-white'}`}>
                        {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
                        {saved ? 'Guardado!' : saving ? 'A guardar…' : `Guardar`}
                    </button>
                </div>
            </div>

            {/* Split pane */}
            <div className="grid min-h-[600px] grid-cols-1 gap-4 xl:grid-cols-2">
                {/* ── Editor ── */}
                <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Editor</p>
                        <p className="text-xs text-gray-600 mt-0.5">Secção: {section.label}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {section.keys.map(({ key, label, multiline, isArray }) => {
                            const val = values[`${activeSection}.${key}.${lang}`] ?? '';
                            return (
                                <div key={key}>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                        {label}
                                    </label>
                                    {multiline ? (
                                        <textarea rows={isArray ? 5 : 3} value={val}
                                            onChange={e => handleChange(key, e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 resize-y focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                                        />
                                    ) : (
                                        <input type="text" value={val}
                                            onChange={e => handleChange(key, e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    )}
                                    {isArray && (
                                        <p className="text-[10px] text-gray-600 mt-1">Uma entrada por linha</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Preview ── */}
                <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <PreviewShell label={section.label}>
                        {renderPreview()}
                    </PreviewShell>
                </div>
            </div>
        </div>
    );
};
