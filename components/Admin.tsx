import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Mail, Calendar, User, AlignLeft, ShieldAlert } from 'lucide-react';

interface Lead {
    id: string;
    name: string;
    email: string;
    challenge: string;
    created_at: string;
}

export const Admin: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [secret, setSecret] = useState('');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const adminSecret = import.meta.env.VITE_ADMIN_SECRET || 'internova2025';

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLeads(data || []);
        } catch (err: any) {
            console.error('Error fetching leads:', err);
            setError('Erro ao carregar pedidos.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (secret === adminSecret) {
            setIsAuthenticated(true);
            fetchLeads();
        } else {
            setError('Código incorreto.');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
                <div className="bg-[#111] p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
                    <div className="flex justify-center mb-6 text-indigo-500">
                        <ShieldAlert size={48} />
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-2">Área Reservada</h1>
                    <p className="text-gray-400 text-center mb-8 text-sm">Insira o código de acesso para ver os pedidos.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={secret}
                                onChange={(e) => {
                                    setSecret(e.target.value);
                                    setError('');
                                }}
                                className="w-full bg-[#050505] border border-white/10 rounded p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors text-center tracking-widest"
                                placeholder="Código Secreto"
                                autoFocus
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest rounded transition-colors mt-4">
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
                    <h1 className="text-3xl font-bold tracking-tighter">Pedidos de Análise</h1>
                    <button
                        onClick={() => { setIsAuthenticated(false); setSecret(''); setLeads([]); }}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Sair
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <Loader2 size={48} className="animate-spin text-indigo-500" />
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center">
                        {error}
                    </div>
                ) : leads.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 text-gray-400 p-12 rounded-xl text-center">
                        Ainda não há pedidos de análise.
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {leads.map((lead) => (
                            <div key={lead.id} className="bg-[#111] border border-white/5 rounded-xl p-6 transition-all hover:border-indigo-500/30">
                                <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">

                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-indigo-400" />
                                            <span className="font-bold text-lg">{lead.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Mail size={16} />
                                            <a href={`mailto:${lead.email}`} className="hover:text-white hover:underline">{lead.email}</a>
                                        </div>
                                    </div>

                                    <div className="flex-1 bg-white/5 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm font-semibold uppercase tracking-wider">
                                            <AlignLeft size={16} />
                                            Desafio Atual
                                        </div>
                                        <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{lead.challenge}</p>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-500 text-sm md:w-48 justify-end">
                                        <Calendar size={16} />
                                        {new Date(lead.created_at).toLocaleDateString('pt-PT', {
                                            day: '2-digit', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
