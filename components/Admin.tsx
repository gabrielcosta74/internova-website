import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../lib/i18n/LanguageContext';
import pt from '../lib/i18n/pt.json';
import en from '../lib/i18n/en.json';
import {
    Loader2, Mail, Calendar, User, AlignLeft, ShieldAlert,
    LayoutDashboard, Inbox, Package, PenSquare, LogOut,
    CheckCircle2, MessageSquare, Search,
    ChevronDown, ChevronUp, Save, RefreshCw,
    Star, Menu, Check, Target, Zap, TrendingUp,
    Monitor, Globe, Workflow, ArrowRight, Eye
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
            { key: 'results', label: 'Link Resultados' },
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

const STATUS_CONFIG = {
    new:      { label: 'Novo',       color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
    read:     { label: 'Lido',       color: 'text-gray-400 bg-gray-400/10 border-gray-400/30' },
    replied:  { label: 'Respondido', color: 'text-green-400 bg-green-400/10 border-green-400/30' },
    archived: { label: 'Arquivado',  color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
};

// ─── Sub-components ───────────────────────────────────────────

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; sub?: string }> = ({ icon, label, value, sub }) => (
    <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex items-start gap-4">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">{icon}</div>
        <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
        </div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────
export const Admin: React.FC = () => {
    const { refreshContent } = useLanguage();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [secret, setSecret] = useState('');
    const [loginError, setLoginError] = useState('');
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const adminSecret = import.meta.env.VITE_ADMIN_SECRET || 'internova2025';

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (secret === adminSecret) {
            setIsAuthenticated(true);
        } else {
            setLoginError('Código incorreto.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setSecret('');
        setActiveTab('dashboard');
    };

    // ── Login Screen ──
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
                <div className="bg-[#111] p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
                    <div className="flex justify-center mb-6 text-indigo-500">
                        <ShieldAlert size={48} />
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-1">Internova Admin</h1>
                    <p className="text-gray-400 text-center mb-8 text-sm">Área reservada. Insira o código de acesso.</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={secret}
                            onChange={(e) => { setSecret(e.target.value); setLoginError(''); }}
                            className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors text-center tracking-widest"
                            placeholder="Código Secreto"
                            autoFocus
                        />
                        {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
                        <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest rounded-lg transition-colors">
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ── Sidebar Nav ──
    const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: 'dashboard', label: 'Dashboard',  icon: <LayoutDashboard size={18} /> },
        { id: 'leads',     label: 'Propostas',  icon: <Inbox size={18} /> },
        { id: 'plans',     label: 'Planos',     icon: <Package size={18} /> },
        { id: 'content',   label: 'Conteúdo',   icon: <PenSquare size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-60 bg-[#0d0d0d] border-r border-white/5 z-30 flex flex-col transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="p-6 border-b border-white/5">
                    <p className="text-lg font-bold tracking-tighter">Inter<span className="text-indigo-400">nova</span></p>
                    <p className="text-gray-500 text-xs mt-0.5">Painel Admin</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                ${activeTab === item.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-colors"
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="sticky top-0 z-10 bg-[#050505]/80 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center gap-4">
                    <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
                        <Menu size={20} />
                    </button>
                    <h1 className="font-semibold text-lg capitalize">
                        {navItems.find(n => n.id === activeTab)?.label}
                    </h1>
                </header>

                <main className="flex-1 p-6">
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
    const [stats, setStats] = useState({ total: 0, newLeads: 0, replied: 0 });
    const [recent, setRecent] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
            if (data) {
                setStats({
                    total: data.length,
                    newLeads: data.filter((l: Lead) => l.status === 'new' || !l.status).length,
                    replied: data.filter((l: Lead) => l.status === 'replied').length,
                });
                setRecent(data.slice(0, 5));
            }
            setLoading(false);
        };
        fetch();
    }, []);

    if (loading) return <div className="flex justify-center py-32"><Loader2 size={32} className="animate-spin text-indigo-500" /></div>;

    return (
        <div className="space-y-8 max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={<Inbox size={20} />}       label="Total Propostas"  value={stats.total} />
                <StatCard icon={<Star size={20} />}        label="Novas"            value={stats.newLeads} sub="Aguardam resposta" />
                <StatCard icon={<CheckCircle2 size={20} />} label="Respondidas"     value={stats.replied} />
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-300">Propostas Recentes</h2>
                    <button onClick={() => onNavigate('leads')} className="text-indigo-400 hover:text-indigo-300 text-sm">Ver todas →</button>
                </div>
                {recent.length === 0 ? (
                    <div className="bg-white/5 rounded-xl p-8 text-center text-gray-500">Ainda não há propostas.</div>
                ) : (
                    <div className="space-y-3">
                        {recent.map(lead => (
                            <div key={lead.id} className="bg-[#111] border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                                        <User size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm truncate">{lead.name}</p>
                                        <p className="text-gray-500 text-xs truncate">{lead.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_CONFIG[lead.status ?? 'new'].color}`}>
                                        {STATUS_CONFIG[lead.status ?? 'new'].label}
                                    </span>
                                    <span className="text-gray-600 text-xs hidden sm:block">
                                        {new Date(lead.created_at).toLocaleDateString('pt-PT')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
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
        const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.email.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || (l.status ?? 'new') === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="max-w-5xl space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Pesquisar nome ou email…"
                        className="w-full bg-[#111] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="bg-[#111] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                    <option value="all">Todos os estados</option>
                    <option value="new">Novos</option>
                    <option value="read">Lidos</option>
                    <option value="replied">Respondidos</option>
                    <option value="archived">Arquivados</option>
                </select>
                <button onClick={fetchLeads} className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-400 transition-colors">
                    <RefreshCw size={14} /> Atualizar
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-32"><Loader2 size={32} className="animate-spin text-indigo-500" /></div>
            ) : filtered.length === 0 ? (
                <div className="bg-white/5 rounded-xl p-12 text-center text-gray-500">Nenhuma proposta encontrada.</div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(lead => {
                        const isExpanded = expandedId === lead.id;
                        const status = lead.status ?? 'new';
                        return (
                            <div key={lead.id} className={`bg-[#111] border rounded-xl overflow-hidden transition-colors
                                ${isExpanded ? 'border-indigo-500/40' : 'border-white/5 hover:border-white/10'}`}>
                                {/* Row */}
                                <div
                                    className="p-4 flex items-center gap-4 cursor-pointer"
                                    onClick={() => {
                                        setExpandedId(isExpanded ? null : lead.id);
                                        if (!isExpanded && !noteEdit[lead.id]) {
                                            setNoteEdit(prev => ({ ...prev, [lead.id]: lead.notes ?? '' }));
                                        }
                                        // Mark as read
                                        if (status === 'new') updateStatus(lead.id, 'read');
                                    }}
                                >
                                    <div className="w-9 h-9 rounded-full bg-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0">
                                        <User size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold text-sm">{lead.name}</p>
                                            {status === 'new' && (
                                                <span className="w-2 h-2 rounded-full bg-blue-400" />
                                            )}
                                        </div>
                                        <p className="text-gray-500 text-xs truncate">{lead.email}</p>
                                    </div>
                                    <div className="hidden sm:block flex-1 min-w-0">
                                        <p className="text-gray-400 text-xs truncate">{lead.challenge}</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className={`text-xs px-2 py-0.5 rounded-full border hidden sm:block ${STATUS_CONFIG[status].color}`}>
                                            {STATUS_CONFIG[status].label}
                                        </span>
                                        <span className="text-gray-600 text-xs hidden md:block">
                                            {new Date(lead.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                        {isExpanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                                    </div>
                                </div>

                                {/* Expanded */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 border-t border-white/5 pt-4 space-y-4">
                                        {/* Contact info */}
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="bg-white/5 rounded-lg p-3 space-y-2">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Contacto</p>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail size={14} className="text-gray-500" />
                                                    <a href={`mailto:${lead.email}`} className="text-indigo-400 hover:underline">{lead.email}</a>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Calendar size={14} className="text-gray-500" />
                                                    {new Date(lead.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Desafio Atual</p>
                                                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{lead.challenge}</p>
                                            </div>
                                        </div>

                                        {/* Status + Notes */}
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Estado</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {(['new', 'read', 'replied', 'archived'] as Lead['status'][]).map(s => (
                                                        <button
                                                            key={s}
                                                            onClick={() => updateStatus(lead.id, s)}
                                                            disabled={savingId === lead.id}
                                                            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all
                                                                ${status === s
                                                                    ? STATUS_CONFIG[s].color + ' opacity-100'
                                                                    : 'border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20'}`}
                                                        >
                                                            {STATUS_CONFIG[s].label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Notas Internas</p>
                                                <div className="flex gap-2">
                                                    <textarea
                                                        rows={2}
                                                        value={noteEdit[lead.id] ?? lead.notes ?? ''}
                                                        onChange={e => setNoteEdit(prev => ({ ...prev, [lead.id]: e.target.value }))}
                                                        className="flex-1 bg-[#050505] border border-white/10 rounded-lg p-2 text-sm text-white resize-none focus:outline-none focus:border-indigo-500"
                                                        placeholder="Adicionar nota…"
                                                    />
                                                    <button
                                                        onClick={() => saveNote(lead.id)}
                                                        disabled={savingId === lead.id}
                                                        className="self-end p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                                                    >
                                                        {savingId === lead.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-1">
                                            <a
                                                href={`mailto:${lead.email}?subject=Internova - Resposta ao seu pedido de análise`}
                                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors"
                                                onClick={() => updateStatus(lead.id, 'replied')}
                                            >
                                                <Mail size={14} /> Responder por Email
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
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
        <div className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border-b border-white/5 shrink-0">
            <Eye size={13} className="text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Preview ao vivo</span>
            <span className="text-xs text-gray-600 ml-1">— {label}</span>
        </div>
        <div className="flex-1 overflow-y-auto bg-[#050505] p-5">
            <div className="pointer-events-none select-none">
                {children}
            </div>
        </div>
    </div>
);

/* ── Hero Preview ── */
const HeroPreview: React.FC<{ g: (k: string) => string }> = ({ g }) => (
    <div className="bg-[#050505] rounded-xl overflow-hidden border border-white/5">
        {/* Mock navbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
            <span className="text-sm font-bold tracking-tighter">Inter<span className="text-indigo-400">nova</span>.</span>
            <div className="flex gap-4">
                {['Consultoria', 'Resultados', 'Soluções'].map(n => (
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
                    <span className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-semibold">{g('cta_primary')}</span>
                )}
                {g('cta_secondary') && (
                    <span className="px-4 py-2 border border-white/20 rounded-lg text-sm text-gray-300">{g('cta_secondary')}</span>
                )}
            </div>
            {/* Tickers */}
            <div className="grid grid-cols-2 gap-2 pt-2">
                {[1, 2, 3, 4].map(i => (
                    g(`ticker${i}_title`) ? (
                        <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-white">{g(`ticker${i}_title`)}</p>
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
    <div className="bg-[#050505] rounded-xl overflow-hidden border border-white/5 p-5 space-y-4">
        <div className="text-center space-y-1">
            <h2 className="text-xl font-bold tracking-tight">
                {g('title1')} <span className="text-indigo-400">{g('title2')}</span> {g('title3')}
            </h2>
            {g('subtitle') && <p className="text-gray-500 text-xs">{g('subtitle')}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
            {/* Traditional */}
            <div className="bg-white/5 rounded-xl p-3 border border-red-500/10 space-y-2">
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
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-300">
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
    <div className="bg-[#050505] rounded-xl overflow-hidden border border-white/5 p-5 space-y-4">
        <div className="text-center space-y-1">
            <h2 className="text-xl font-bold tracking-tight">
                {g('title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{g('title2')}</span>
            </h2>
            {g('subtitle') && <p className="text-gray-500 text-xs">{g('subtitle')}</p>}
        </div>
        <div className="space-y-3">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-2">
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
    <div className="bg-[#050505] rounded-xl overflow-hidden border border-white/5 p-5 space-y-3 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
            {g('title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{g('title2')}</span>
        </h2>
        {g('subtitle') && <p className="text-gray-400 text-sm max-w-sm mx-auto">{g('subtitle')}</p>}
        <div className="flex justify-center gap-2 pt-2 flex-wrap">
            {['p1_name', 'p2_name', 'p3_name'].map((k, i) => (
                <span key={k} className={`text-xs px-3 py-1.5 rounded-lg border font-medium
                    ${i === 1 ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300' : 'border-white/10 text-gray-400'}`}>
                    {g(k)}
                </span>
            ))}
        </div>
        <p className="text-xs text-gray-500 pt-1 italic">"{g('custom_title')}"</p>
    </div>
);

/* ── Footer Preview ── */
const FooterPreview: React.FC<{ g: (k: string) => string }> = ({ g }) => (
    <div className="bg-[#050505] rounded-xl overflow-hidden border border-white/5 p-5 space-y-4">
        <div className="text-center space-y-1">
            <h2 className="text-xl font-bold tracking-tight">
                {g('title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{g('title2')}</span>
            </h2>
            {g('subtitle') && <p className="text-gray-500 text-xs">{g('subtitle')}</p>}
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
            <p className="font-semibold text-sm">{g('form_title')}</p>
            <div className="space-y-2">
                <div>
                    <p className="text-[10px] text-gray-500 mb-1">{g('form_name')}</p>
                    <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-600">
                        {g('form_name_placeholder')}
                    </div>
                </div>
                <div>
                    <p className="text-[10px] text-gray-500 mb-1">{g('form_email')}</p>
                    <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-600">
                        {g('form_email_placeholder')}
                    </div>
                </div>
                <div>
                    <p className="text-[10px] text-gray-500 mb-1">{g('form_challenge')}</p>
                    <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-600 h-12">
                        {g('form_challenge_placeholder')}
                    </div>
                </div>
                <div className="w-full bg-indigo-600 rounded-lg px-3 py-2 text-xs font-semibold text-center">
                    {g('form_submit')}
                </div>
            </div>
        </div>
    </div>
);

/* ── Nav Preview ── */
const NavPreview: React.FC<{ g: (k: string) => string }> = ({ g }) => (
    <div className="bg-[#050505] rounded-xl overflow-hidden border border-white/5">
        <div className="px-5 py-3 flex items-center justify-between border-b border-white/5">
            <span className="text-sm font-bold tracking-tighter">Inter<span className="text-indigo-400">nova</span>.</span>
            <div className="hidden sm:flex items-center gap-5">
                <span className="text-xs text-gray-400">{g('consulting')}</span>
                <span className="text-xs text-gray-400">{g('results')}</span>
                <span className="text-xs text-gray-400">{g('solutions')}</span>
                <span className="text-xs px-3 py-1.5 bg-indigo-600 rounded-lg font-semibold">{g('schedule')}</span>
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
            : 'border-white/10 bg-[#0a0a0a]'}`}>
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
            <div className="h-px bg-white/10" />
            <ul className="space-y-2 flex-1">
                {features.filter(Boolean).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-gray-300">
                        <Check size={12} className={`mt-0.5 shrink-0 ${highlight ? 'text-indigo-400' : 'text-gray-500'}`} />
                        {f}
                    </li>
                ))}
            </ul>
            {benefit && (
                <p className="text-[10px] italic text-gray-500 text-center border border-white/5 bg-white/5 rounded-lg py-2 px-3">
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
        <div className="space-y-4 h-full">
            {/* Plan + lang selectors */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2 flex-wrap">
                    {PLAN_KEYS.map(p => (
                        <button key={p} onClick={() => setActivePlan(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                ${activePlan === p ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                            {p === 'p2' ? '⭐ ' : ''}{PLAN_LABELS[p].split('—')[0].trim()}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-[#111] border border-white/10 rounded-lg overflow-hidden">
                        {(['pt', 'en'] as ContentLang[]).map(l => (
                            <button key={l} onClick={() => setLang(l)}
                                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors
                                    ${lang === l ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                                {l}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleSave} disabled={saving}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors
                            ${saved ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                        {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
                        {saved ? 'Guardado!' : saving ? 'A guardar…' : 'Guardar'}
                    </button>
                </div>
            </div>

            {/* Split pane */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4" style={{ minHeight: 600 }}>
                {/* ── Editor ── */}
                <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden flex flex-col">
                    <div className="px-4 py-2.5 border-b border-white/5 bg-[#0a0a0a] shrink-0">
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
                                            className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white resize-y focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                                        />
                                    ) : (
                                        <input type="text" value={val}
                                            onChange={e => handleChange(fieldKey, e.target.value)}
                                            className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
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
                <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden flex flex-col">
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
        <div className="space-y-4 h-full">
            {/* Section + lang + save bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    {sectionKeys.map(sec => (
                        <button key={sec} onClick={() => setActiveSection(sec)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                ${activeSection === sec ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                            {CONTENT_SECTIONS[sec].label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-[#111] border border-white/10 rounded-lg overflow-hidden">
                        {(['pt', 'en'] as ContentLang[]).map(l => (
                            <button key={l} onClick={() => setLang(l)}
                                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors
                                    ${lang === l ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                                {l}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleSave} disabled={saving}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors
                            ${saved ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                        {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
                        {saved ? 'Guardado!' : saving ? 'A guardar…' : `Guardar`}
                    </button>
                </div>
            </div>

            {/* Split pane */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4" style={{ minHeight: 600 }}>
                {/* ── Editor ── */}
                <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden flex flex-col">
                    <div className="px-4 py-2.5 border-b border-white/5 bg-[#0a0a0a] shrink-0">
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
                                            className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white resize-y focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                                        />
                                    ) : (
                                        <input type="text" value={val}
                                            onChange={e => handleChange(key, e.target.value)}
                                            className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
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
                <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden flex flex-col">
                    <PreviewShell label={section.label}>
                        {renderPreview()}
                    </PreviewShell>
                </div>
            </div>
        </div>
    );
};
