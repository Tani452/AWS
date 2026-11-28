import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getStats, exportCatalogCsv } from '../api';
import { ArrowLeft, Clock, ShoppingBag, MessageSquare, Award, Volume2, Download, Check, Share2, Phone } from 'lucide-react';

export default function ImpactScreen() {
  const { t, speak } = useLanguage();
  const { user } = useAuth();
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
    setStats({
      productsCount: 0,
      enquiriesCount: 0,
      estimatedMinutesSaved: 0,
      isEstimate: true,
    });
    setLoading(true);

    async function loadStats() {
      try {
        const data = await getStats();
        setStats(data || { productsCount: 0, enquiriesCount: 0, estimatedMinutesSaved: 0, isEstimate: true });
      } catch (err) {
        console.warn('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    }

    if (user?.sub || user?.userId) {
      loadStats();
    } else {
      setLoading(false);
    }
  }, [user?.sub]);

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
          aria-label="Back to home"
          className="w-11 h-11 rounded-2xl bg-white border border-slate-200 text-slate-800 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-indigo-950">
          {t('impactScreen')}
        </h1>
        <button
          onClick={() => speak('impactScreen')}
          aria-label={t('readAloud') || "Read impact stats aloud"}
          className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center"
          title={t('readAloud')}
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Hero Impact Badge & Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-tr from-saffron-600 to-amber-500 rounded-3xl p-6 text-white text-center shadow-xl space-y-2 flex flex-col justify-center">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto text-2xl">
            ⏳
          </div>
          <div className="text-4xl font-black tracking-tight">
            {stats.estimatedMinutesSaved}
          </div>
          <div className="text-base font-bold text-amber-100">
            {t('minutesSavedUnit')}
          </div>
          <p className="text-[11px] text-amber-100/90 leading-relaxed font-medium bg-black/10 py-1 px-3 rounded-full">
            *Indicative: 15 mins saved / product
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center flex flex-col justify-center space-y-2">
          <ShoppingBag className="w-10 h-10 text-saffron-600 mx-auto" />
          <div className="text-4xl font-black text-slate-900">{stats.productsCount}</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">
            {t('productsCountLabel')}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center flex flex-col justify-center space-y-2">
          <MessageSquare className="w-10 h-10 text-indigo-600 mx-auto" />
          <div className="text-4xl font-black text-slate-900">{stats.enquiriesCount}</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">
            {t('enquiriesCountLabel')}
          </div>
        </div>
      </div>

      {/* Export & Highlights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* B2B / Marketplace CSV Export Button */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-indigo-950 font-black text-lg">
              <Download className="w-6 h-6 text-saffron-600" />
              <span>B2B & Government Marketplace Export</span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Download your complete bilingual catalog as a standardized CSV file ready for ONDC, GeM, or export marketplaces.
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full min-h-[54px] bg-saffron-600 hover:bg-saffron-700 active:scale-[0.98] text-white font-bold rounded-2xl flex items-center justify-center space-x-2 transition-transform shadow-sm disabled:opacity-50"
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
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-indigo-900 font-extrabold text-lg">
            <Award className="w-6 h-6 text-saffron-600" />
            <span>Empowering Bharat Artisans</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 font-medium">
            <li className="flex items-center space-x-2">
              <span className="text-emerald-500 font-bold text-base">✓</span>
              <span>Direct-to-buyer sales with zero commission cut</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-emerald-500 font-bold text-base">✓</span>
              <span>Multilingual audio accessibility in 9 regional languages</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-emerald-500 font-bold text-base">✓</span>
              <span>Dignity-affirming labor wage protection (₹100/hr minimum)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Customer Inquiries Section */}
      {stats.enquiries && stats.enquiries.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-indigo-950 font-black text-lg">
              <MessageSquare className="w-5 h-5 text-saffron-600" />
              <span>{t('viewEnquiries') || 'Recent Buyer Inquiries'}</span>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-saffron-800 px-3 py-1 rounded-full">
              {stats.enquiries.length} Inquiries
            </span>
          </div>

          <div className="space-y-3">
            {stats.enquiries.map((enq) => {
              const cleanPhone = (enq.buyerContact || '').replace(/[^0-9]/g, '');
              const waPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
              const waUrl = `https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(`Namaste ${enq.buyerName || 'ji'}! Thank you for inquiring on Kaarigar regarding "${enq.message}".`)}`;

              return (
                <div key={enq.enquiryId || enq.createdAt} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="text-sm font-black text-slate-900">{enq.buyerName}</span>
                    <span className="text-slate-500 font-normal">{enq.createdAt ? new Date(enq.createdAt).toLocaleDateString('en-IN') : ''}</span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">📞 {enq.buyerContact} • Qty: {enq.quantity || 1}</div>
                  <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-200">
                    "{enq.message}"
                  </p>
                  <div className="flex items-center space-x-2 pt-1">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-sm"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{t('replyOnWhatsApp') || 'WhatsApp'}</span>
                    </a>
                    {enq.buyerContact && (
                      <a
                        href={`tel:${enq.buyerContact}`}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{t('callBuyer') || 'Call'}</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
