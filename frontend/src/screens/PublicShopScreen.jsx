import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getShop, submitEnquiry } from '../api';
import { MessageSquare, Check, Volume2, Share2, Sparkles, X } from 'lucide-react';

export default function PublicShopScreen() {
  const { shopId } = useParams();
  const { t, lang, speak } = useLanguage();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected product for detail & enquiry modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [honeypot, setHoneypot] = useState(''); // Anti-spam trap
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

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
      `Namaste! I am interested in purchasing "${title}" (₹${prod.price}) on KalaMitra: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="mobile-container p-4 space-y-5 pb-16">
      {/* Public Shop Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white text-2xl shadow-md">
              🪔
            </div>
            <div>
              <h1 className="text-xl font-black">{t('publicShopTitle')}</h1>
              <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">
                Shop: {shopId?.slice(0, 12)}
              </p>
            </div>
          </div>

          {/* WhatsApp Share Button */}
          <button
            onClick={handleShareShopWhatsApp}
            aria-label="Share shop on WhatsApp"
            className="min-h-[44px] px-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
            title="Share Shop on WhatsApp"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        <p className="text-xs text-indigo-100 font-medium leading-relaxed">
          Direct from traditional Bharat artisans. Authentic handcrafted wares with 100% fair artisan compensation.
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
      <div className="space-y-4">
        {products.map((p) => {
          const displayTitle = lang === 'en' ? (p.title_en || p.title_hi) : (p.title_hi || p.title_en);
          const displayDesc = lang === 'en' ? (p.description_en || p.description_hi) : (p.description_hi || p.description_en);

          return (
            <div
              key={p.productId}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden hover:shadow-lg transition-shadow"
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
                    onClick={() => speak(`${displayTitle}. Price: ${p.price} rupees. ${displayDesc}`, true)}
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
                    className="min-h-[48px] bg-indigo-900 hover:bg-indigo-950 active:scale-[0.98] text-white font-black text-xs rounded-2xl flex items-center justify-center space-x-1.5 shadow"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t('enquireButton')}</span>
                  </button>

                  <button
                    onClick={() => handleProductWhatsApp(p)}
                    className="min-h-[48px] bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-xs rounded-2xl flex items-center justify-center space-x-1.5 shadow"
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
                  {selectedProduct.title_en || selectedProduct.title_hi}
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
                  {lang === 'hi'
                    ? selectedProduct.description_hi || selectedProduct.description_en
                    : selectedProduct.description_en || selectedProduct.description_hi}
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
    </div>
  );
}
