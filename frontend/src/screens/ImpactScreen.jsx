import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { getStats, exportCatalogCsv } from '../api';
import { ArrowLeft, Clock, ShoppingBag, MessageSquare, Award, Volume2, Download, Check } from 'lucide-react';

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
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

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

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportCatalogCsv();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      alert('Failed to export catalog: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mobile-container p-5 space-y-6 pb-16">
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
        <button
          onClick={() => speak(`${stats.estimatedMinutesSaved} minutes saved. Estimated based on 15 minutes per craft cataloged.`, true)}
          className="p-3 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200"
          title={t('readAloud')}
        >
          <Volume2 className="w-5 h-5" />
        </button>
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
        {/* Clearly labelled as estimate */}
        <p className="text-xs text-amber-100/90 max-w-xs mx-auto leading-relaxed pt-1 font-medium bg-black/10 py-1 px-3 rounded-full">
          *Indicative estimate based on 15 mins saved per product cataloged
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

      {/* B2B / Marketplace CSV Export Button */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-indigo-950 font-black text-base">
          <Download className="w-5 h-5 text-saffron-600" />
          <span>B2B & Government Marketplace Export</span>
        </div>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Download your complete bilingual catalog as a standardized CSV file ready for ONDC, GeM, or export marketplaces.
        </p>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full min-h-[54px] bg-indigo-900 hover:bg-indigo-950 active:scale-[0.98] text-white font-extrabold rounded-2xl flex items-center justify-center space-x-2 transition-transform shadow-md disabled:opacity-50"
        >
          {exportSuccess ? (
            <>
              <Check className="w-5 h-5 text-emerald-400" />
              <span>Downloaded Successfully!</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>{exporting ? 'Generating CSV...' : t('exportCatalog')}</span>
            </>
          )}
        </button>
      </div>

      {/* Bharat Impact Highlights Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-indigo-900 font-extrabold text-base">
          <Award className="w-5 h-5 text-saffron-600" />
          <span>Empowering Bharat Artisans</span>
        </div>
        <ul className="text-xs text-slate-600 space-y-2 font-medium">
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
