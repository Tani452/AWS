import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LANGUAGES } from '../i18n';
import { Volume2, Globe, LogOut, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { lang, setLang, t, speak } = useLanguage();
  const { user, logout } = useAuth();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-amber-200 shadow-sm px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand logo & name */}
        <Link to="/" className="flex items-center space-x-2 text-saffron-600 font-extrabold text-xl tracking-tight">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-saffron-600 to-amber-500 flex items-center justify-center text-white shadow-md">
            🪔
          </span>
          <div className="leading-tight">
            <span className="text-xl font-black text-indigo-900 block">KalaMitra</span>
            <span className="text-xs font-semibold text-saffron-600 tracking-wide block">कला मित्र</span>
          </div>
        </Link>

        {/* Right action controls */}
        <div className="flex items-center space-x-2">
          {/* Read aloud button */}
          <button
            onClick={() => speak(t('tagline'), true)}
            aria-label={t('readAloud')}
            className="p-2.5 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 active:scale-95 transition-transform"
            title={t('readAloud')}
          >
            <Volume2 className="w-5 h-5" />
          </button>

          {/* Persistent Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold text-sm shadow-sm active:scale-95 transition-transform"
            >
              <Globe className="w-4 h-4 text-saffron-600" />
              <span>{currentLangObj.label}</span>
            </button>

            {/* Language Selection Modal Dropdown */}
            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/20"
                  onClick={() => setShowLangMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t('selectLanguage')}
                  </div>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-base font-semibold hover:bg-amber-50 ${
                        l.code === lang ? 'text-saffron-600 bg-amber-50/80 font-bold' : 'text-slate-800'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="text-xs text-slate-400">{l.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Logout button if authenticated */}
          {user && (
            <button
              onClick={logout}
              title={t('logout')}
              aria-label={t('logout')}
              className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 active:scale-95 transition-transform"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
