import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { getStats } from '../api';
import { ArrowLeft, Clock, ShoppingBag, MessageSquare, Award, Volume2 } from 'lucide-react';

export default function ImpactScreen() {
  const { t, speak } = useLanguage();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    productsCount: 0,
    enquiriesCount: 0,
    estimatedMinutesSaved: 0,
    isEstimate: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="mobile-container p-5 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/home')}
          className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-800 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-indigo-950">
          {t('impactScreen')}
        </h1>
        <div className="w-10" />
      </div>

      {/* Hero Impact Badge */}
      <div className="bg-gradient-to-tr from-saffron-600 to-amber-500 rounded-3xl p-6 text-white text-center shadow-xl space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto text-3xl">
          ⏳
        </div>
        <div className="text-4xl font-black tracking-tight">
          {stats.estimatedMinutesSaved}
        </div>
        <div className="text-base font-bold text-amber-100">
          {t('minutesSavedUnit')}
        </div>
        <p className="text-xs text-amber-100/90 max-w-xs mx-auto leading-relaxed pt-1">
          Estimated based on 15 minutes saved per craft cataloged via voice & AI.
        </p>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-2 gap-3.5">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-center space-y-1.5">
          <ShoppingBag className="w-8 h-8 text-saffron-600 mx-auto" />
          <div className="text-3xl font-black text-slate-900">{stats.productsCount}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            {t('productsCountLabel')}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-center space-y-1.5">
          <MessageSquare className="w-8 h-8 text-indigo-600 mx-auto" />
          <div className="text-3xl font-black text-slate-900">{stats.enquiriesCount}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            {t('enquiriesCountLabel')}
          </div>
        </div>
      </div>

      {/* Bharat Impact Highlights Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-indigo-900 font-extrabold text-base">
          <Award className="w-5 h-5 text-saffron-600" />
          <span>Empowering Bharat Artisans</span>
        </div>
        <ul className="text-sm text-slate-600 space-y-2 font-medium">
          <li className="flex items-start space-x-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Bilingual e-commerce catalog ready for government & global export.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Zero middleman commission: direct buyer inquiries to your phone.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Dignity-first pricing assistant protecting fair artisan wages.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
