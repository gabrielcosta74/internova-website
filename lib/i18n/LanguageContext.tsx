import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../supabase';
import pt from './pt.json';
import en from './en.json';

type Language = 'pt' | 'en';
type Translations = typeof pt;

type Overrides = Record<string, Record<string, { pt: string | null; en: string | null }>>;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (section: keyof Translations, key: string) => string;
    refreshContent: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('pt');
    const [isInitialized, setIsInitialized] = useState(false);
    const [overrides, setOverrides] = useState<Overrides>({});

    const fetchOverrides = useCallback(async () => {
        try {
            const { data } = await supabase.from('site_content').select('section, key, value_pt, value_en');
            if (data) {
                const map: Overrides = {};
                data.forEach((item: { section: string; key: string; value_pt: string | null; value_en: string | null }) => {
                    if (!map[item.section]) map[item.section] = {};
                    map[item.section][item.key] = { pt: item.value_pt, en: item.value_en };
                });
                setOverrides(map);
            }
        } catch {
            // silently fall back to JSON if table doesn't exist yet
        }
    }, []);

    useEffect(() => {
        const storedLang = localStorage.getItem('app_language') as Language;
        if (storedLang === 'pt' || storedLang === 'en') {
            setLanguageState(storedLang);
        } else {
            const browserLang = navigator.language.toLowerCase();
            setLanguageState(browserLang.startsWith('pt') ? 'pt' : 'en');
        }
        setIsInitialized(true);
        fetchOverrides();
    }, [fetchOverrides]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('app_language', lang);
    };

    const t = (section: keyof Translations, key: string): string => {
        // Check Supabase overrides first
        const override = overrides[section]?.[key];
        if (override !== undefined) {
            const val = language === 'pt' ? override.pt : override.en;
            if (val !== null && val !== undefined && val !== '') {
                // Try to parse as JSON array
                try {
                    const parsed = JSON.parse(val);
                    if (Array.isArray(parsed)) return parsed as unknown as string;
                } catch { /* not JSON, return as string */ }
                return val;
            }
        }

        // Fall back to JSON files
        const dictionary = language === 'pt' ? pt : en;
        const sectionData = dictionary[section] as Record<string, unknown>;
        if (sectionData && sectionData[key] !== undefined) {
            return sectionData[key] as string;
        }

        console.warn(`Translation missing for ${section}.${key} in language ${language}`);
        return key;
    };

    if (!isInitialized) return null;

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, refreshContent: fetchOverrides }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
