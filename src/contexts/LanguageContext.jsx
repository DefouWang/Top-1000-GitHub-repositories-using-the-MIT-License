import { createContext, useContext, useState } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}