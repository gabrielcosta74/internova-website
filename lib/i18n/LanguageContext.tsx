import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import pt from './pt.json';
import en from './en.json';

type Language = 'pt' | 'en';
type Translations = typeof pt;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (section: keyof Translations, key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('pt');
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Check local storage first
        const storedLang = localStorage.getItem('app_language') as Language;
        if (storedLang === 'pt' || storedLang === 'en') {
            setLanguageState(storedLang);
        } else {
            // Auto-detect browser language
            const browserLang = navigator.language.toLowerCase();
            if (browserLang.startsWith('pt')) {
                setLanguageState('pt');
            } else {
                setLanguageState('en');
            }
        }
        setIsInitialized(true);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('app_language', lang);
    };

    const t = (section: keyof Translations, key: string): string => {
        const dictionary = language === 'pt' ? pt : en;
        // Type casting here because we know the structure of our JSON
        const sectionData = dictionary[section] as Record<string, any>;

        if (sectionData && sectionData[key] !== undefined) {
            return sectionData[key];
        }

        console.warn(`Translation missing for ${section}.${key} in language ${language}`);
        return key;
    };

    if (!isInitialized) return null; // Avoid hydration mismatch or flash of wrong language

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
