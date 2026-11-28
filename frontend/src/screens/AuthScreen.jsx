import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Mail, ArrowRight, ShieldCheck, Volume2 } from 'lucide-react';

export default function AuthScreen() {
  const { user, login, signup, verify, logout } = useAuth();
  const { t, speak } = useLanguage();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'verify'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError('');
    setLoading(true);

    const cleanEmail = email.trim();
    const cleanPassword = password;

    try {
      if (mode === 'login') {
        const loggedUser = await login(cleanEmail, cleanPassword);
        if (loggedUser) {
          window.location.hash = '#/home';
          window.location.reload();
        }
      } else if (mode === 'signup') {
        const res = await signup(cleanEmail, cleanPassword);
        // If auto-confirmed (via PreSignUp Lambda trigger) or already complete:
        if (res?.isSignUpComplete || res?.nextStep?.signUpStep === 'DONE') {
          await login(cleanEmail, cleanPassword);
          window.location.hash = '#/home';
          window.location.reload();
        } else if (res?.nextStep?.signUpStep === 'CONFIRM_SIGN_UP_STEP') {
          setMode('verify');
        } else {
          await login(cleanEmail, cleanPassword);
          window.location.hash = '#/home';
          window.location.reload();
        }
      } else if (mode === 'verify') {
        await verify(cleanEmail, code.trim());
        // Immediately sign the user in with their credentials:
        if (cleanPassword) {
          await login(cleanEmail, cleanPassword);
          window.location.hash = '#/home';
          window.location.reload();
        } else {
          setMode('login');
          setError('');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (err.message && /already.*signed.*in/i.test(err.message)) {
        try {
          await logout();
          await login(cleanEmail, cleanPassword);
          navigate('/home', { replace: true });
          return;
        } catch {}
      }
      setError(err.message || 'Authentication failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-container p-6 flex flex-col justify-between max-w-md md:max-w-xl mx-auto my-6 bg-white/80 backdrop-blur rounded-3xl border border-amber-200/80 shadow-xl">
      <div>
        {/* Header tabs */}
        <div className="flex bg-slate-200/80 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-3 text-center rounded-xl font-bold text-base transition-all ${
              mode === 'login' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            {t('login')}
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-3 text-center rounded-xl font-bold text-base transition-all ${
              mode === 'signup' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            {t('signup')}
          </button>
        </div>

        {/* Read aloud help */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => speak(mode === 'signup' ? 'auth_signup' : 'auth_login')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-100 text-amber-900 rounded-full text-xs font-bold"
          >
            <Volume2 className="w-4 h-4 text-saffron-600" />
            <span>{t('readAloud')}</span>
          </button>
        </div>

        {/* Active Session Notice with Quick Action */}
        {user && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between shadow-sm">
            <div className="text-xs text-slate-900 font-medium">
              <span className="text-emerald-700 font-bold block">✓ Currently Signed In</span>
              <span className="truncate max-w-[160px] block font-semibold text-slate-700">{user.email || user.username || 'Artisan'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="px-3 py-1.5 bg-saffron-600 hover:bg-saffron-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                Go to Shop →
              </button>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  setError('');
                  window.location.reload();
                }}
                className="px-2.5 py-1.5 bg-white hover:bg-red-50 border border-slate-300 hover:border-red-300 text-slate-700 hover:text-red-700 rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Error message card */}
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode !== 'verify' ? (
            <>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="artisan@email.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 focus:border-saffron-600 focus:ring-2 focus:ring-saffron-500/20 bg-white text-slate-900 text-base font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {t('passwordLabel')}
                </label>
                <div className="relative">
                  <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 focus:border-saffron-600 focus:ring-2 focus:ring-saffron-500/20 bg-white text-slate-900 text-base font-medium outline-none"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                {t('verificationCodeLabel')}
              </label>
              <div className="relative">
                <ShieldCheck className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-saffron-600" />
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-saffron-500 bg-white text-slate-900 text-lg font-bold tracking-widest outline-none"
                />
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[58px] bg-saffron-600 hover:bg-saffron-700 active:bg-saffron-800 disabled:opacity-60 text-white font-extrabold text-lg rounded-2xl shadow-sm flex items-center justify-center space-x-2 transition-transform active:scale-[0.98]"
            >
              <span>
                {loading
                  ? '...'
                  : mode === 'verify'
                  ? t('verifyCodeBtn')
                  : mode === 'login'
                  ? t('submitLogin')
                  : t('submitSignup')}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      <div className="text-center py-4 text-xs text-slate-400 font-medium">
        Kaarigar • Powered by AWS & Gemini
      </div>
    </div>
  );
}
