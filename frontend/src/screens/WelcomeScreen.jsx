import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES, DICTIONARY, speakText, playAudioClip } from '../i18n';
import { Volume2, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WelcomeScreen() {
  const { lang, setLang, t, speak } = useLanguage();
  const navigate = useNavigate();

  const handleLanguageSelect = (code) => {
    setLang(code);
    // Play authentic studio neural audio clip in the selected regional language immediately
    const played = playAudioClip('welcomeListenInstruction', code);
    if (!played) {
      const item = DICTIONARY['welcomeListenInstruction'];
      const textToSpeak = item ? (item[code] || item['hi'] || item['en']) : '';
      const langObj = LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
      const phoneticFallback = item?.phonetic ? (item.phonetic[code] || item.phonetic['hi'] || '') : '';
      speakText(textToSpeak, langObj.bcp47, phoneticFallback);
    }
  };

  return (
    <div className="mobile-container flex flex-col justify-between p-6 max-w-2xl mx-auto py-10">
      {/* Header section with artwork emblem */}
      <div className="text-center pt-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-saffron-600 text-white shadow-md mb-6">
          <svg className="w-10 h-10 stroke-current fill-none stroke-[2.2]" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-6-14h12M6 13h12M4 7h16M4 17h16" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-indigo-900 tracking-wider mb-1 uppercase">
          {t('appName')}
        </h1>
        <p className="text-base font-semibold text-saffron-700 mb-1">
          कारीगर • Bharat Artisan Platform
        </p>
        <p className="text-sm font-medium text-slate-600 max-w-md mx-auto">
          {t('tagline')}
        </p>

        {/* Read aloud intro button */}
        <button
          onClick={() => speak('welcomeListenInstruction')}
          aria-label={t('readAloud') || "Read welcome instructions aloud"}
          className="mt-4 inline-flex items-center space-x-2 px-5 py-2.5 min-h-[44px] rounded-full bg-amber-100 text-amber-900 font-semibold text-sm hover:bg-amber-200 transition-colors"
        >
          <Volume2 className="w-4 h-4 text-saffron-600" />
          <span>{t('readAloud')}</span>
        </button>
      </div>

      {/* Language Selection Grid */}
      <div className="my-8">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider text-center mb-4">
          {t('selectLanguage')}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {LANGUAGES.map((l) => {
            const isSelected = l.code === lang;
            return (
              <button
                key={l.code}
                onClick={() => handleLanguageSelect(l.code)}
                className={`min-h-[58px] p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all border-2 active:scale-95 ${
                  isSelected
                    ? 'border-saffron-600 bg-saffron-50 shadow-md font-bold text-saffron-700'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="text-lg font-extrabold">{l.label}</span>
                <span className="text-[11px] text-slate-400 mt-0.5">{l.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* One primary action button */}
      <div className="pb-8 max-w-md w-full mx-auto">
        <button
          onClick={() => navigate('/auth')}
          className="w-full min-h-[60px] bg-saffron-600 hover:bg-saffron-700 active:bg-saffron-800 text-white font-extrabold text-xl rounded-2xl shadow-lg shadow-saffron-600/30 flex items-center justify-center space-x-3 transition-transform active:scale-[0.98]"
        >
          <span>{t('getStarted')}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
