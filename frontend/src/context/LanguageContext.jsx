import React, { createContext, useContext, useState } from 'react';
import { LANGUAGES, t as translate, speakText, DICTIONARY, AUDIO_CLIPS, playAudioClip, playProductAudio, stopAllAudio } from '../i18n';
import { getSynthesizedAudio } from '../api';

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

  const speak = async (keyOrText, isDirectText = false) => {
    // 1. Check if an authentic studio-quality native neural audio clip exists for this key
    if (!isDirectText && AUDIO_CLIPS[keyOrText]) {
      const started = playAudioClip(keyOrText, lang);
      if (started) return;
    }

    // 2. If called with direct text, check if it matches a known dictionary key with an audio clip
    if (isDirectText) {
      for (const [clipKey] of Object.entries(AUDIO_CLIPS)) {
        const item = DICTIONARY[clipKey];
        if (item && (item[lang] === keyOrText || item['hi'] === keyOrText || item['en'] === keyOrText)) {
          const started = playAudioClip(clipKey, lang);
          if (started) return;
        }
      }
    }

    // 3. For dynamic text (e.g. user voice transcript, custom product descriptions, catalog copy):
    // Use server-side natural native regional voice synthesis for 100% fluent, warm Bharat pronunciation
    let textToSpeak = '';
    let phoneticFallback = '';

    if (!isDirectText && DICTIONARY[keyOrText]) {
      const item = DICTIONARY[keyOrText];
      textToSpeak = item[lang] || item['en'] || item['hi'] || keyOrText;
      if (item.phonetic) {
        phoneticFallback = item.phonetic[lang] || item.phonetic['en'] || item.phonetic['hi'] || '';
      }
    } else {
      textToSpeak = keyOrText;
    }

    if (textToSpeak && textToSpeak.trim()) {
      try {
        stopAllAudio();
        const res = await getSynthesizedAudio(textToSpeak, lang);
        if (res?.audioDataUrl) {
          const dynamicAudio = new Audio(res.audioDataUrl);
          dynamicAudio.play().catch(console.warn);
          return;
        }
      } catch (err) {
        console.warn('Dynamic speech synthesis notice:', err);
      }
    }

    // 4. Fallback to Web Speech API
    speakText(textToSpeak, currentLangObj.bcp47, phoneticFallback);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, currentLangObj, t, speak, playProductAudio, playAudioClip, stopAllAudio }}>
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
