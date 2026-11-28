import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Mic,
  Store,
  Share2,
  Download,
  BarChart3,
  Volume2,
  Check,
  Package,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  X,
  Phone,
  Clock,
  User,
} from 'lucide-react';
import { exportCatalogCsv, getProducts, getStats } from '../api';

export default function HomeScreen() {
  const { t, speak, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ productsCount: 0, enquiriesCount: 0, enquiries: [] });
  const [showEnquiriesModal, setShowEnquiriesModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const shopId = user?.sub || user?.userId || 'my-shop';
  const publicShopUrl = `${window.location.origin}/#/shop/${shopId}`;

  const handleReplyWhatsApp = (enquiry, product) => {
    let cleanPhone = (enquiry.buyerContact || '').replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }
    const prodTitle = product
      ? (lang === 'en' ? (product.title_en || product.title_hi) : (product['title_' + lang] || product.title_regional || product.title_hi || product.title_en))
      : 'our handcrafted craft';
    const msg = `Namaste ${enquiry.buyerName || 'ji'}! Thank you for inquiring about "${prodTitle}" on Kaarigar.\nRegarding your message: "${enquiry.message}". How can I assist you with your order?`;
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    let mounted = true;
    // Always reset dashboard data immediately on user switch to prevent any cross-artisan data leak
    setProducts([]);
    setStats({ productsCount: 0, enquiriesCount: 0, enquiries: [] });
    setLoading(true);

    async function loadData() {
      try {
        const [prodRes, statsRes] = await Promise.allSettled([
          getProducts(),
          getStats(),
        ]);
        if (mounted) {
          if (prodRes.status === 'fulfilled' && prodRes.value?.products) {
            setProducts(prodRes.value.products);
          } else {
            setProducts([]);
          }
          if (statsRes.status === 'fulfilled' && statsRes.value) {
            setStats(statsRes.value);
          } else {
            setStats({ productsCount: 0, enquiriesCount: 0, enquiries: [] });
          }
        }
      } catch (err) {
        console.warn('Dashboard load note:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (user?.sub || user?.userId) {
      loadData();
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [user?.sub, user?.email]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(publicShopUrl);
      setCopied(true);
      speak('shareCopied');
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

  const rawName = user?.email ? user.email.split('@')[0] : (user?.username || 'Artisan');
  const artisanName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const totalValue = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);

  return (
    <div className="mobile-container p-4 md:p-6 space-y-6">
      {/* Top Header Row matching reference */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Namaste, {artisanName}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Handcrafted Artistry • Bharat Artisan Store
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Welcome status pill */}
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Welcome to KAARIGAR</span>
          </div>

          <button
            onClick={() => speak('homeListenPrompt')}
            aria-label={t('readAloud') || 'Read greeting aloud'}
            className="w-10 h-10 rounded-full bg-white hover:bg-amber-100 border border-amber-200 text-slate-700 flex items-center justify-center shrink-0 shadow-sm transition-colors"
            title={t('readAloud')}
          >
            <Volume2 className="w-4 h-4 text-saffron-600" />
          </button>
        </div>
      </div>

      {/* Hero Action Card: "Add a new craft in 5 minutes" */}
      <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg md:text-xl font-black text-slate-900">
            Add a new craft in 5 minutes
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            One photo, then just speak about your piece in your own language.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Terracotta Primary Button: Add product */}
          <button
            onClick={() => navigate('/add-product')}
            className="px-6 py-3.5 bg-saffron-600 hover:bg-saffron-700 active:bg-saffron-800 text-white font-bold text-sm rounded-2xl shadow-sm shadow-saffron-600/20 flex items-center space-x-2 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add product</span>
          </button>

          {/* Neutral Secondary Button: Speak instead */}
          <button
            onClick={() => navigate('/add-product')}
            className="px-5 py-3.5 bg-white hover:bg-amber-50 border border-amber-200 text-slate-800 font-bold text-sm rounded-2xl shadow-sm flex items-center space-x-2 active:scale-95 transition-all"
          >
            <Mic className="w-4 h-4 text-saffron-600" />
            <span>Speak instead</span>
          </button>

          {/* Neutral Secondary Button: My Shop */}
          <button
            onClick={() => navigate('/my-shop')}
            className="px-5 py-3.5 bg-white hover:bg-amber-50 border border-amber-200 text-slate-800 font-bold text-sm rounded-2xl shadow-sm flex items-center space-x-2 active:scale-95 transition-all"
          >
            <Store className="w-4 h-4 text-slate-600" />
            <span>{t('btnBigMyShop')}</span>
          </button>
        </div>
      </div>

      {/* Alert banner if pending buyer inquiries */}
      {(stats.enquiriesCount > 0 || (stats.enquiries && stats.enquiries.length > 0)) && (
        <div
          onClick={() => setShowEnquiriesModal(true)}
          className="bg-amber-100/70 border border-saffron-300 rounded-3xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-saffron-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <span>{stats.enquiriesCount || stats.enquiries?.length} New Buyer Inquiry Received!</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded-full font-bold">New</span>
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Tap to view buyer contact details and reply on WhatsApp.
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEnquiriesModal(true);
            }}
            className="px-4 py-2 bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold rounded-xl shadow-sm shrink-0"
          >
            View
          </button>
        </div>
      )}

      {/* 4 Metric / KPI Chips in a Grid matching reference image */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Metric 1: Listed */}
        <div className="bg-white rounded-3xl p-4 md:p-5 border border-amber-200/80 shadow-sm space-y-1 text-left">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>LISTED</span>
            <Package className="w-4 h-4 text-saffron-600" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-slate-900">
            {products.length || stats.productsCount || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            published to shop
          </div>
        </div>

        {/* Metric 2: Enquiries (Interactive) */}
        <div
          onClick={() => setShowEnquiriesModal(true)}
          className="bg-white rounded-3xl p-4 md:p-5 border border-amber-200/80 hover:border-saffron-400 shadow-sm hover:shadow-md space-y-1 text-left cursor-pointer active:scale-95 transition-all group"
          title="Click to view customer inquiries"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>ENQUIRIES</span>
            <div className="flex items-center space-x-1">
              {(stats.enquiriesCount > 0 || (stats.enquiries && stats.enquiries.length > 0)) && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
              <MessageSquare className="w-4 h-4 text-saffron-600 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-slate-900">
            {stats.enquiriesCount || (stats.enquiries?.length || 0)}
          </div>
          <div className="text-[11px] text-saffron-700 font-bold flex items-center space-x-1">
            <span>{stats.enquiriesCount > 0 ? `${stats.enquiriesCount} awaiting reply` : 'customer contacts'}</span>
            <span className="text-xs group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
        </div>

        {/* Metric 3: Value */}
        <div className="bg-white rounded-3xl p-4 md:p-5 border border-amber-200/80 shadow-sm space-y-1 text-left">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>CATALOG VALUE</span>
            <span className="text-saffron-600 font-black text-sm">₹</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-slate-900">
            ₹{totalValue > 0 ? totalValue.toLocaleString('en-IN') : '0'}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            100% fair artisan price
          </div>
        </div>

        {/* Metric 4: AI Drafts */}
        <div className="bg-white rounded-3xl p-4 md:p-5 border border-amber-200/80 shadow-sm space-y-1 text-left">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>TIME SAVED</span>
            <Sparkles className="w-4 h-4 text-saffron-600" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-slate-900">
            {(products.length || 1) * 15}m
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            via AI automation
          </div>
        </div>
      </div>

      {/* Recent Crafts Preview (if available) */}
      {products.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">Recent crafts</h3>
            <button
              onClick={() => navigate('/my-shop')}
              className="text-xs font-bold text-saffron-600 hover:text-saffron-700 flex items-center space-x-1"
            >
              <span>See all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((p) => {
              const displayTitle = lang === 'en'
                ? (p.title_en || p.title_hi)
                : (p['title_' + lang] || p.title_regional || p.title_hi || p.title_en);

              return (
                <div
                  key={p.productId}
                  onClick={() => navigate('/my-shop')}
                  className="bg-white rounded-3xl border border-amber-200/80 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2 group"
                >
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src={p.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                      alt={displayTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-emerald-800 backdrop-blur shadow-sm">
                      • Published
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {displayTitle}
                    </h4>
                    <div className="text-xs font-black text-saffron-600 mt-0.5">
                      ₹{p.price}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Action Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Share Public Shop */}
        <button
          onClick={handleShare}
          className="w-full min-h-[58px] bg-white border border-amber-200 hover:border-amber-300 active:bg-amber-50 rounded-2xl p-4 flex items-center justify-between text-left shadow-sm active:scale-[0.99] transition-all"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-saffron-700 flex items-center justify-center flex-shrink-0">
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </div>
            <div>
              <span className="font-extrabold text-slate-800 text-sm block">
                {t('shareShop')}
              </span>
              <span className="text-xs text-slate-500 font-medium block truncate max-w-[200px]">
                {copied ? t('shareCopied') : publicShopUrl}
              </span>
            </div>
          </div>
        </button>

        {/* Export Catalog (CSV) */}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full min-h-[58px] bg-white border border-amber-200 hover:border-amber-300 active:bg-amber-50 rounded-2xl p-4 flex items-center justify-between text-left shadow-sm active:scale-[0.99] transition-all"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-saffron-700 flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-800 text-sm block">
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
          className="w-full min-h-[58px] bg-white border border-amber-200 hover:border-amber-300 active:bg-amber-50 rounded-2xl p-4 flex items-center justify-between text-left shadow-sm active:scale-[0.99] transition-all"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-saffron-700 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-800 text-sm block">
                {t('impactScreen')}
              </span>
              <span className="text-xs text-slate-500 font-medium block">
                Time saved & inquiries received
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Customer Enquiries Modal */}
      {showEnquiriesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl border border-amber-200 animate-in fade-in zoom-in-95 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="bg-white px-5 sm:px-6 py-4 border-b border-amber-200/80 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-saffron-700 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {t('viewEnquiries') || 'Customer Inquiries'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {stats.enquiries?.length || stats.enquiriesCount || 0} messages from prospective buyers
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEnquiriesModal(false)}
                aria-label="Close dialog"
                className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content / List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {(!stats.enquiries || stats.enquiries.length === 0) ? (
                <div className="text-center py-12 px-4 bg-white rounded-3xl border border-amber-200/80 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-amber-100 text-saffron-600 flex items-center justify-center mx-auto text-2xl">
                    📬
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    No inquiries yet
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    {t('noEnquiriesYet') || 'When buyers view your shop and send custom requests or purchase inquiries, they will appear here.'}
                  </p>
                  <button
                    onClick={() => {
                      setShowEnquiriesModal(false);
                      handleShare();
                    }}
                    className="px-5 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs rounded-2xl shadow-sm inline-flex items-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Shop Link</span>
                  </button>
                </div>
              ) : (
                stats.enquiries.map((enq) => {
                  const matchedProduct = products.find((p) => p.productId === enq.productId);
                  const prodTitle = matchedProduct
                    ? (lang === 'en' ? (matchedProduct.title_en || matchedProduct.title_hi) : (matchedProduct['title_' + lang] || matchedProduct.title_regional || matchedProduct.title_hi || matchedProduct.title_en))
                    : 'Craft Item';

                  const dateStr = enq.createdAt
                    ? new Date(enq.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Recently';

                  return (
                    <div
                      key={enq.enquiryId || enq.createdAt}
                      className="bg-white rounded-3xl border border-amber-200/90 p-4 sm:p-5 shadow-sm space-y-3 hover:border-amber-300 transition-all text-left"
                    >
                      {/* Top info row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded-full bg-amber-100 text-saffron-700 font-black text-sm flex items-center justify-center shrink-0">
                            {(enq.buyerName || 'B')[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900">
                              {enq.buyerName || 'Prospective Buyer'}
                            </h4>
                            <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-medium">
                              <span>📞 {enq.buyerContact}</span>
                              <span>•</span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{dateStr}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-saffron-800 shrink-0">
                          Qty: {enq.quantity || 1}
                        </span>
                      </div>

                      {/* Product Preview tag if matched */}
                      {matchedProduct && (
                        <div className="flex items-center space-x-3 bg-amber-50/60 p-2.5 rounded-2xl border border-amber-100">
                          <img
                            src={matchedProduct.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=120&q=80'}
                            alt={prodTitle}
                            className="w-10 h-10 rounded-xl object-cover border border-amber-200 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inquired Craft</span>
                            <h5 className="text-xs font-bold text-slate-900 truncate">{prodTitle}</h5>
                          </div>
                          <div className="text-xs font-black text-saffron-600 shrink-0">
                            ₹{matchedProduct.price}
                          </div>
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Buyer Message:
                        </span>
                        <p className="text-xs text-slate-800 font-medium leading-relaxed italic">
                          "{enq.message}"
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          onClick={() => handleReplyWhatsApp(enq, matchedProduct)}
                          className="flex-1 min-h-[40px] px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center space-x-1.5 transition-all"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{t('replyOnWhatsApp') || 'Reply on WhatsApp'}</span>
                        </button>

                        {enq.buyerContact && (
                          <a
                            href={`tel:${enq.buyerContact}`}
                            className="min-h-[40px] px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center space-x-1.5 transition-all"
                          >
                            <Phone className="w-3.5 h-3.5 text-slate-600" />
                            <span>{t('callBuyer') || 'Call Buyer'}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-white px-5 sm:px-6 py-3.5 border-t border-amber-200/80 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Connect directly with buyers via WhatsApp or phone call
              </span>
              <button
                onClick={() => setShowEnquiriesModal(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
