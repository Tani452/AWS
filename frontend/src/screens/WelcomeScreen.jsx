import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES } from '../i18n';
import { Volume2, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WelcomeScreen() {
  const { lang, setLang, t, speak } = useLanguage();
  const navigate = useNavigate();

  const handleLanguageSelect = (code) => {
    setLang(code);
    speak(t('welcomeListenInstruction'));
  };

  return (
    <div className="mobile-container flex flex-col justify-between p-6">
      {/* Header section with artwork emblem */}
      <div className="text-center pt-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-tr from-saffron-600 to-amber-400 text-white shadow-xl shadow-saffron-500/20 mb-6 text-5xl">
          🪔
        </div>
        <h1 className="text-3xl font-black text-indigo-950 tracking-tight mb-2">
          {t('appName')}
        </h1>
        <p className="text-lg font-medium text-amber-800">
          {t('tagline')}
        </p>

        {/* Read aloud intro button */}
        <button
          onClick={() => speak(t('welcomeListenInstruction'))}
          className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-100 text-amber-900 font-semibold text-sm hover:bg-amber-200 transition-colors"
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
      <div className="pb-8">
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
