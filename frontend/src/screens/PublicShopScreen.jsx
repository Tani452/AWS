import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getShop, submitEnquiry } from '../api';
import { ArrowLeft, MessageSquare, Check, Volume2, Store } from 'lucide-react';

export default function PublicShopScreen() {
  const { shopId } = useParams();
  const { t, lang, speak } = useLanguage();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Enquiry Modal state
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
        website: honeypot, // Honeypot trigger
      });
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setSelectedProduct(null);
        setMessage('');
      }, 2500);
    } catch (err) {
      alert('Failed to send enquiry: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mobile-container p-5 space-y-6">
      {/* Public Shop Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white text-2xl shadow-md">
            🪔
          </div>
          <div>
            <h1 className="text-xl font-black">{t('publicShopTitle')}</h1>
            <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">
              Shop ID: {shopId?.slice(0, 8)}
            </p>
          </div>
        </div>
        <p className="text-sm text-indigo-100 font-medium leading-relaxed">
          Direct from traditional Bharat artisans. Authentic handcrafted wares.
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-3xl h-48 animate-pulse" />
          ))}
        </div>
      )}

      {/* Products list */}
      <div className="space-y-4">
        {products.map((p) => {
          const displayTitle = lang === 'en' ? (p.title_en || p.title_hi) : (p.title_hi || p.title_en);
          const displayDesc = lang === 'en' ? (p.description_en || p.description_hi) : (p.description_hi || p.description_en);

          return (
            <div
              key={p.productId}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden"
            >
              <div className="relative h-48 bg-slate-100">
                <img
                  src={p.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
                  alt={displayTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-saffron-600 text-white px-3.5 py-1.5 rounded-full text-base font-black shadow-md">
                  ₹{p.price}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{displayTitle}</h3>
                  <span className="text-xs font-bold text-saffron-600 uppercase tracking-wider">
                    {p.category}
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {displayDesc}
                </p>

                <button
                  onClick={() => setSelectedProduct(p)}
                  className="w-full min-h-[50px] bg-indigo-900 hover:bg-indigo-950 active:scale-[0.98] text-white font-extrabold rounded-2xl flex items-center justify-center space-x-2 transition-transform shadow-md"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>{t('enquireButton')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enquiry Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-black text-indigo-950">
                  {t('enquireButton')}
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  {selectedProduct.title_en || selectedProduct.title_hi} (₹{selectedProduct.price})
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {successMsg ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">{t('enquirySentSuccess')}</h4>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3.5">
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('buyerNameLabel')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-base font-medium outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('buyerContactLabel')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerContact}
                    onChange={(e) => setBuyerContact(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-base font-medium outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('messageLabel')} *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Quantity needed, customization, or shipping question..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-base font-medium outline-none focus:border-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full min-h-[54px] bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center space-x-2 active:scale-95"
                >
                  <span>{submitting ? 'Sending...' : t('sendEnquiryBtn')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
