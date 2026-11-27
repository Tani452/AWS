import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Store, Share2, Download, BarChart3, Volume2, Check } from 'lucide-react';
import { exportCatalogCsv } from '../api';

export default function HomeScreen() {
  const { t, speak } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const shopId = user?.sub || user?.userId || 'my-shop';
  const publicShopUrl = `${window.location.origin}/#/shop/${shopId}`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(publicShopUrl);
      setCopied(true);
      speak(t('shareCopied'));
      setTimeout(() => setCopied(false), 3000);
    } catch {
      alert(`Public shop link: ${publicShopUrl}`);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportCatalogCsv();
    } catch (err) {
      alert('Failed to export catalog: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mobile-container p-5 space-y-6">
      {/* Artisan greeting card */}
      <div className="bg-gradient-to-r from-amber-500 to-saffron-600 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100 block mb-1">
              {t('greeting')}
            </span>
            <h1 className="text-2xl font-black tracking-tight">
              {user?.username || user?.email?.split('@')[0] || 'KalaMitra Artisan'}
            </h1>
          </div>
          <button
            onClick={() => speak(t('homeListenPrompt'))}
            aria-label={t('readAloud') || "Read greeting aloud"}
            className="w-11 h-11 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur flex items-center justify-center shrink-0"
            title={t('readAloud')}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm font-medium text-amber-50 mt-3 leading-relaxed">
          {t('homeListenPrompt')}
        </p>
      </div>

      {/* TWO HUGE PRIMARY BUTTONS (Min 64px touch target) */}
      <div className="space-y-4">
        {/* Big Button 1: Add Product */}
        <button
          onClick={() => navigate('/add-product')}
          className="w-full min-h-[72px] bg-saffron-600 hover:bg-saffron-700 active:bg-saffron-800 text-white rounded-3xl p-4 shadow-xl shadow-saffron-600/25 flex items-center space-x-4 transition-all active:scale-[0.98] border-2 border-saffron-500"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
            <PlusCircle className="w-8 h-8" />
          </div>
          <div className="text-left flex-1">
            <div className="text-xl font-black tracking-tight">{t('btnBigAddProduct')}</div>
            <div className="text-sm text-saffron-100 font-semibold">{t('btnBigAddProductSub')}</div>
          </div>
        </button>

        {/* Big Button 2: My Shop */}
        <button
          onClick={() => navigate('/my-shop')}
          className="w-full min-h-[72px] bg-indigo-900 hover:bg-indigo-950 active:bg-indigo-900 text-white rounded-3xl p-4 shadow-xl shadow-indigo-950/25 flex items-center space-x-4 transition-all active:scale-[0.98] border-2 border-indigo-800"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
            <Store className="w-8 h-8" />
          </div>
          <div className="text-left flex-1">
            <div className="text-xl font-black tracking-tight">{t('btnBigMyShop')}</div>
            <div className="text-sm text-indigo-200 font-semibold">{t('btnBigMyShopSub')}</div>
          </div>
        </button>
      </div>

      {/* SECONDARY ACTION CARDS */}
      <div className="space-y-3 pt-2">
        {/* Share Public Shop */}
        <button
          onClick={handleShare}
          className="w-full min-h-[58px] bg-white border-2 border-amber-200 hover:border-amber-400 active:bg-amber-50 rounded-2xl p-4 flex items-center justify-between text-left shadow-sm active:scale-[0.99] transition-all"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </div>
            <div>
              <span className="font-extrabold text-slate-800 text-base block">
                {t('shareShop')}
              </span>
              <span className="text-xs text-slate-500 font-medium block">
                {copied ? t('shareCopied') : publicShopUrl}
              </span>
            </div>
          </div>
        </button>

        {/* Export Catalog (CSV) */}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full min-h-[58px] bg-white border-2 border-slate-200 hover:border-slate-300 active:bg-slate-50 rounded-2xl p-4 flex items-center justify-between text-left shadow-sm active:scale-[0.99] transition-all"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-800 text-base block">
                {t('exportCatalog')}
              </span>
              <span className="text-xs text-slate-500 font-medium block">
                {exporting ? 'Generating CSV...' : 'B2B & Government format'}
              </span>
            </div>
          </div>
        </button>

        {/* Business Impact Screen */}
        <button
          onClick={() => navigate('/impact')}
          className="w-full min-h-[58px] bg-white border-2 border-slate-200 hover:border-slate-300 active:bg-slate-50 rounded-2xl p-4 flex items-center justify-between text-left shadow-sm active:scale-[0.99] transition-all"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-800 text-base block">
                {t('impactScreen')}
              </span>
              <span className="text-xs text-slate-500 font-medium block">
                Time saved & inquiries received
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
