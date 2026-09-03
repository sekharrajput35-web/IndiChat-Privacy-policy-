import React, { useState } from 'react';
import { ThemeMode } from '../types';
import { loginAdminApi, authStorage } from '../services/api';
import { ShieldCheck, ShieldAlert, Lock, Eye, EyeOff, UserCheck, ArrowLeft, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';

interface AdminLoginProps {
  theme: ThemeMode;
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  theme,
  onLoginSuccess,
  onNavigateHome,
}) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!usernameOrEmail.trim()) {
      setErrorMessage('Administrator username or email is required.');
      return;
    }

    if (!password) {
      setErrorMessage('Administrator password is required.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginAdminApi(usernameOrEmail.trim(), password);
      if (response.success && response.token) {
        authStorage.setAdminToken(response.token);
        setSuccessMessage('Cryptographic administrator verification confirmed. Redirecting to Dashboard...');
        setTimeout(() => {
          onLoginSuccess();
        }, 800);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid administrator credentials. Access denied.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="admin-login-page"
      className={`min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden transition-colors ${
        theme === 'dark' ? 'bg-[#060810] text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Back to Public Portal Button */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center z-10">
        <button
          id="btn-admin-back-to-portal"
          onClick={onNavigateHome}
          className={`inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all ${
            theme === 'dark'
              ? 'border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
              : 'border-slate-300 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to IndiChat Public Portal</span>
        </button>

        <span className="text-[11px] font-mono-code text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
          TLS 1.3 Active
        </span>
      </div>

      {/* Main Login Card */}
      <div
        id="admin-login-card"
        className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 sm:p-8 relative z-10 ${
          theme === 'dark'
            ? 'bg-[#0c101d]/90 backdrop-blur-2xl border-white/10 shadow-indigo-950/50'
            : 'bg-white/95 backdrop-blur-2xl border-slate-200 shadow-slate-300/60'
        }`}
      >
        {/* Shield Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-[2px] mb-4 shadow-xl shadow-indigo-600/30">
            <div
              className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                theme === 'dark' ? 'bg-[#080b14]' : 'bg-white'
              }`}
            >
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Administrator Gateway
          </h1>
          <p className={`text-xs sm:text-sm mt-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Secure server-authorized access to IndiChat CMS & Controls
          </p>
        </div>

        {/* Invalid login error message banner */}
        {errorMessage && (
          <div
            id="admin-login-error-banner"
            className="mb-5 p-3.5 rounded-xl text-xs sm:text-sm bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 flex items-start gap-2.5 animate-in fade-in"
          >
            <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold block">Authentication Failed</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Success feedback banner */}
        {successMessage && (
          <div
            id="admin-login-success-banner"
            className="mb-5 p-3.5 rounded-xl text-xs sm:text-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5 animate-in fade-in"
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Username Input */}
          <div>
            <label
              htmlFor="input-admin-identifier"
              className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Admin Email or Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserCheck className="w-4 h-4" />
              </div>
              <input
                id="input-admin-identifier"
                type="text"
                autoComplete="username"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="admin@indichat.com or admin"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="input-admin-password"
              className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="input-admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter authorized administrator password"
                className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
                required
              />
              <button
                type="button"
                id="btn-toggle-admin-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Credentials Helper hint for administrator */}
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-400 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Authorized Administrator Credentials</span>
            </div>
            <p className="text-slate-400">
              Username: <span className="font-mono-code text-indigo-300">admin@indichat.com</span>
              <br />
              Password: <span className="font-mono-code text-indigo-300">Admin@IndiChat2026!</span>
            </p>
          </div>

          {/* Secure Login Button */}
          <button
            id="btn-submit-admin-login"
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-60 flex items-center justify-center gap-2 min-h-[46px] group"
          >
            <span>{isLoading ? 'Verifying Cryptographic Credentials...' : 'Secure Administrator Login'}</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Security Disclaimers */}
        <div className="mt-6 pt-4 border-t border-white/5 dark:border-white/5 text-center space-y-1 text-[11px] text-slate-500">
          <p>Protected by PBKDF2 cryptographic salting & signed server sessions.</p>
          <p>All administrative access attempts are permanently audited in server logs.</p>
        </div>
      </div>
    </div>
  );
};
