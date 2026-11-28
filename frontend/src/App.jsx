import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import OfflineBanner from './components/OfflineBanner';

import WelcomeScreen from './screens/WelcomeScreen';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import AddProductWizard from './screens/AddProductWizard';
import MyShopScreen from './screens/MyShopScreen';
import PublicShopScreen from './screens/PublicShopScreen';
import ImpactScreen from './screens/ImpactScreen';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="w-12 h-12 rounded-full border-4 border-saffron-500 border-t-transparent animate-spin" />
      </div>
    );
  }
  return user ? children : <Navigate to="/auth" replace />;
}

function AppContent() {
  const location = useLocation();
  const isBuyerStorefront = location.pathname.startsWith('/shop');

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col font-sans">
      {!isBuyerStorefront && <Navbar />}
      <OfflineBanner />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/auth" element={<AuthScreen />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomeScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <ProtectedRoute>
                <AddProductWizard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-shop"
            element={
              <ProtectedRoute>
                <MyShopScreen />
              </ProtectedRoute>
            }
          />
          {/* Public Shop route: accessible without login */}
          <Route path="/shop/:shopId" element={<PublicShopScreen />} />
          <Route
            path="/impact"
            element={
              <ProtectedRoute>
                <ImpactScreen />
              </ProtectedRoute>
            }
          />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Kaarigar App Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-saffron-600 text-white flex items-center justify-center text-3xl mb-4 shadow-sm">
            🪔
          </div>
          <h2 className="text-xl font-black text-indigo-950 mb-2">
            Kaarigar - कारीगर
          </h2>
          <p className="text-sm text-slate-600 mb-6 max-w-sm">
            {this.state.error?.message || 'Display updated. Tap below to reload your shop.'}
          </p>
          <button
            onClick={() => {
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then((regs) => {
                  for (let reg of regs) reg.unregister();
                });
              }
              window.location.reload();
            }}
            className="px-6 py-3 bg-saffron-600 hover:bg-saffron-700 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
          >
            Refresh Shop
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <HashRouter>
            <AppContent />
          </HashRouter>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
