import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, t as translate, speakText } from '../i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('kalamitra_lang') || 'hi';
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('kalamitra_lang', newLang);
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  const t = (key) => translate(key, lang);

  const speak = (keyOrText, isDirectText = false) => {
    const textToSpeak = isDirectText ? keyOrText : t(keyOrText);
    speakText(textToSpeak, currentLangObj.bcp47);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, currentLangObj, t, speak }}>
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
