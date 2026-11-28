import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getShop, submitEnquiry } from '../api';
import { MessageSquare, Check, Volume2, Share2, Sparkles, X, Globe, ShieldCheck } from 'lucide-react';
import { playProductAudio, LANGUAGES } from '../i18n';

export default function PublicShopScreen() {
  const { shopId } = useParams();
  const { t, lang, setLang, speak } = useLanguage();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Selected product for detail & enquiry modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [honeypot, setHoneypot] = useState(''); // Anti-spam trap
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    async function loadShop() {
      setLoading(true);
      try {
        const res = await getShop(shopId);
        setProducts(res.products || []);
      } catch (err) {
        console.error('Failed to load shop:', err);
      } finally {
        setLoading(false);
      }
    }
    loadShop();
  }, [shopId]);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitEnquiry({
        shopId,
        productId: selectedProduct?.productId || 'general',
        buyerName,
        buyerContact,
        message,
        quantity: Number(quantity) || 1,
        website: honeypot, // Honeypot anti-bot trap
      });
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setSelectedProduct(null);
        setMessage('');
        setBuyerName('');
        setBuyerContact('');
      }, 2500);
    } catch (err) {
      alert('Failed to send enquiry: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShareShopWhatsApp = () => {
    const shopUrl = window.location.href;
    const text = encodeURIComponent(
      `Namaste! Explore authentic Indian handcrafted wares directly from local artisans: ${shopUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleProductWhatsApp = (prod) => {
    const title = prod.title_en || prod.title_hi || 'handcrafted creation';
    const text = encodeURIComponent(
      `Namaste! I am interested in purchasing "${title}" (₹${prod.price}) on Kaarigar: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="mobile-container p-4 space-y-5 pb-16">
      {/* Customer Header Bar (Buyer-exclusive, zero artisan admin controls) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-amber-200 shadow-sm px-4 py-3 -mx-4 -mt-4 mb-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-10 h-10 rounded-xl bg-saffron-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 stroke-current fill-none stroke-[2.2]" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-6-14h12M6 13h12M4 7h16M4 17h16" />
              </svg>
            </span>
            <div className="leading-tight">
              <span className="text-xl font-black text-indigo-900 tracking-wider block">KAARIGAR</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center space-x-1 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Artisan Store</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Read aloud intro for buyers */}
            <button
              onClick={() => speak('Direct from traditional Bharat artisans. Authentic handcrafted wares with 100% fair artisan compensation.', true)}
              aria-label={t('readAloud') || "Read aloud"}
              className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 flex items-center justify-center active:scale-95 transition-transform"
              title={t('readAloud')}
            >
              <Volume2 className="w-4 h-4 text-saffron-600" />
            </button>

            {/* Buyer Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                aria-label="Select language"
                className="flex items-center space-x-1.5 px-3 min-h-[40px] rounded-xl bg-amber-50 border border-amber-200 text-slate-800 font-bold text-xs shadow-sm active:scale-95 transition-transform"
              >
                <Globe className="w-3.5 h-3.5 text-saffron-600" />
                <span>{currentLangObj.label}</span>
              </button>

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
                        className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-sm font-semibold hover:bg-amber-50 ${
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

            {/* Share Storefront */}
            <button
              onClick={handleShareShopWhatsApp}
              className="min-h-[40px] px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
              title="Share Shop on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Storefront Hero Card */}
      <div className="bg-white rounded-3xl border border-amber-200 p-6 shadow-sm space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Artisan Craft Collection
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Authentic Indian Handcrafts • Direct from the Maker
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-saffron-700 text-xs font-bold">
            🛒 Direct Buyer Store
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium pt-1">
          Every piece in this shop is handmade by traditional artisans. Zero middleman cut ensures 100% of your payment supports artisan families and craft preservation.
        </p>
      </div>

      {/* Loading state skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl h-56 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200">
          <span className="text-5xl block mb-3">🛍️</span>
          <h2 className="text-lg font-bold text-slate-800">No products available yet</h2>
          <p className="text-xs text-slate-500 mt-1">
            The artisan is currently updating their handcrafted catalog. Please check back soon!
          </p>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => {
          const displayTitle = lang === 'en'
            ? (p.title_en || p.title_hi)
            : (p['title_' + lang] || p.title_regional || p.title_hi || p.title_en);
          const displayDesc = lang === 'en'
            ? (p.description_en || p.description_hi)
            : (p['description_' + lang] || p.description_regional || p.description_hi || p.description_en);

          return (
            <div
              key={p.productId}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div
                className="relative h-56 bg-slate-100 cursor-pointer"
                onClick={() => setSelectedProduct(p)}
              >
                <img
                  src={p.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
                  alt={displayTitle}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute top-3 right-3 bg-saffron-600 text-white px-3.5 py-1.5 rounded-full text-base font-black shadow-md">
                  ₹{p.price}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      className="text-lg font-black text-slate-900 cursor-pointer hover:text-saffron-700"
                      onClick={() => setSelectedProduct(p)}
                    >
                      {displayTitle}
                    </h3>
                    <span className="text-xs font-bold text-saffron-600 uppercase tracking-wider">
                      {p.category}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const played = playProductAudio(p.productId, lang);
                      if (!played) {
                        speak(`${displayTitle}. ${t('price')}: ${p.price}. ${displayDesc}`, true);
                      }
                    }}
                    aria-label={t('readAloud') || "Read product description aloud"}
                    className="w-11 h-11 rounded-full bg-amber-50 text-amber-800 hover:bg-amber-100 flex items-center justify-center shrink-0"
                    title={t('readAloud')}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {displayDesc}
                </p>

                {/* Primary CTA Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="min-h-[44px] bg-saffron-600 hover:bg-saffron-700 active:scale-[0.98] text-white font-bold text-xs rounded-2xl flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t('enquireButton')}</span>
                  </button>

                  <button
                    onClick={() => handleProductWhatsApp(p)}
                    className="min-h-[44px] bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold text-xs rounded-2xl flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail & Enquiry Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg p-5 space-y-4 shadow-2xl my-auto animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-black text-indigo-950">
                  {lang === 'en'
                    ? (selectedProduct.title_en || selectedProduct.title_hi)
                    : (selectedProduct['title_' + lang] || selectedProduct.title_regional || selectedProduct.title_hi || selectedProduct.title_en)}
                </h3>
                <span className="text-sm font-black text-emerald-600">
                  ₹{selectedProduct.price}
                </span>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                aria-label="Close product details dialog"
                className="w-11 h-11 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center active:scale-95 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Image & Full Details */}
            <div className="space-y-3">
              <div className="h-44 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={selectedProduct.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
                  alt={selectedProduct.title_en}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {lang === 'en'
                    ? (selectedProduct.description_en || selectedProduct.description_hi)
                    : (selectedProduct['description_' + lang] || selectedProduct.description_regional || selectedProduct.description_hi || selectedProduct.description_en)}
                </p>
                {selectedProduct.materials && selectedProduct.materials.length > 0 && (
                  <div className="text-[11px] text-slate-500 font-semibold pt-1">
                    <span className="font-bold text-slate-700">Materials: </span>
                    {Array.isArray(selectedProduct.materials)
                      ? selectedProduct.materials.join(', ')
                      : selectedProduct.materials}
                  </div>
                )}
              </div>
            </div>

            {/* Enquiry Form */}
            <div className="border-t pt-3">
              {successMsg ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{t('enquirySentSuccess')}</h4>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-3">
                  <span className="text-xs font-black text-indigo-900 block">
                    {t('enquireButton')}
                  </span>

                  {/* Hidden Honeypot anti-bot trap */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                    tabIndex="-1"
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {t('buyerNameLabel')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Ramesh Patel"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {t('quantityLabel')}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {t('buyerContactLabel')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerContact}
                      onChange={(e) => setBuyerContact(e.target.value)}
                      placeholder="+91 98765 43210 / buyer@email.com"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {t('messageLabel')} *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Custom color, bulk discount, or delivery location..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-indigo-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full min-h-[48px] bg-saffron-600 hover:bg-saffron-700 text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
                  >
                    <span>{submitting ? 'Sending...' : t('sendEnquiryBtn')}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Buyer Storefront Trust Footer */}
      <footer className="text-center pt-8 pb-4 text-xs text-slate-500 font-medium space-y-1">
        <p className="font-bold text-slate-700">KAARIGAR • Empowering Traditional Bharat Artisans</p>
        <p>Direct-to-buyer handicrafts with 100% fair artisan compensation</p>
      </footer>
    </div>
  );
}
