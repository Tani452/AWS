import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../api';
import { ArrowLeft, Trash2, Plus, Volume2, Share2, ExternalLink } from 'lucide-react';

export default function MyShopScreen() {
  const { t, speak, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const shopId = user?.sub || user?.userId || 'my-shop';
  const publicShopUrl = `${window.location.origin}/#/shop/${shopId}`;

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.products || []);
    } catch (err) {
      alert('Failed to load products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (productId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from your shop?`)) return;
    setDeletingId(productId);
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.productId !== productId));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleShareShopWhatsApp = () => {
    const text = encodeURIComponent(
      `Namaste! Visit my KalaMitra artisan shop to see my latest handcrafted creations: ${publicShopUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="mobile-container p-5 space-y-5 pb-16">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/home')}
          aria-label="Back to home"
          className="w-11 h-11 rounded-2xl bg-white border border-slate-200 text-slate-800 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-indigo-950">
          {t('btnBigMyShop')} ({products.length})
        </h1>
        <button
          onClick={() => navigate('/add-product')}
          aria-label={t('btnBigAddProduct') || "Add new product"}
          className="w-11 h-11 rounded-2xl bg-saffron-600 text-white shadow-md active:scale-95 transition-transform flex items-center justify-center"
          title={t('btnBigAddProduct')}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Public Shop Link & WhatsApp Share Strip */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 p-4 rounded-3xl text-white flex items-center justify-between shadow-md">
        <div className="min-w-0 pr-2">
          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
            Public Storefront
          </span>
          <p className="text-xs font-medium text-indigo-100 truncate">
            No login required for buyers
          </p>
        </div>
        <div className="flex space-x-2 flex-shrink-0">
          <button
            onClick={() => window.open(publicShopUrl, '_blank')}
            aria-label="View public storefront in new tab"
            className="min-h-[44px] px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center space-x-1"
            title="View Public Storefront"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">View</span>
          </button>
          <button
            onClick={handleShareShopWhatsApp}
            aria-label="Share public storefront on WhatsApp"
            className="min-h-[44px] px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1"
            title="Share on WhatsApp"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Loading state skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-4 shadow-sm animate-pulse space-y-3">
              <div className="h-44 bg-slate-200 rounded-2xl" />
              <div className="h-5 bg-slate-200 rounded w-2/3" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border-2 border-dashed border-amber-200">
          <span className="text-5xl block mb-3">🧺</span>
          <h2 className="text-lg font-bold text-slate-800 mb-1">Your shop is empty</h2>
          <p className="text-sm text-slate-500 mb-6">Add your first handcrafted creation now.</p>
          <button
            onClick={() => navigate('/add-product')}
            className="px-6 py-3.5 bg-saffron-600 text-white font-bold rounded-2xl shadow-md inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>{t('btnBigAddProduct')}</span>
          </button>
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
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute top-3 right-3 bg-indigo-950/80 backdrop-blur text-white px-3 py-1.5 rounded-full text-base font-black shadow-md">
                  ₹{p.price}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                      {displayTitle}
                    </h3>
                    <span className="inline-block text-xs font-bold text-saffron-600 uppercase tracking-wider mt-0.5">
                      {p.category}
                    </span>
                  </div>

                  <button
                    onClick={() => speak(`${displayTitle}. Price: ${p.price} rupees. ${displayDesc}`, true)}
                    aria-label={t('readAloud') || "Read product details aloud"}
                    className="w-11 h-11 rounded-full bg-amber-50 text-amber-800 hover:bg-amber-100 flex items-center justify-center shrink-0"
                    title={t('readAloud')}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {displayDesc}
                </p>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end border-t border-slate-100">
                  <button
                    onClick={() => handleDelete(p.productId, displayTitle)}
                    disabled={deletingId === p.productId}
                    aria-label={`Delete ${displayTitle}`}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-sm font-bold flex items-center space-x-1.5 active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{deletingId === p.productId ? 'Deleting...' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
