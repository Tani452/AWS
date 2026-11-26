import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import OfflineBanner from './components/OfflineBanner';

import WelcomeScreen from './screens/WelcomeScreen';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
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
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col font-sans">
      <Navbar />
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

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
