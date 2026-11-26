import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { t } = useLanguage();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-amber-500 text-amber-950 font-bold px-4 py-2.5 text-sm flex items-center justify-center space-x-2 shadow-sm animate-pulse">
      <WifiOff className="w-4 h-4 flex-shrink-0" />
      <span>{t('offlineAlert')}</span>
    </div>
  );
}
