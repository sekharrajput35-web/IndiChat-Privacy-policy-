import React, { useState } from 'react';
import { ThemeMode } from '../types';
import { usePortal } from '../context/PortalContext';
import { loginUserApi, forgotPasswordApi } from '../services/api';
import { X, Lock, Eye, EyeOff, LogIn, ArrowRight, ShieldCheck, Mail, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
  theme: ThemeMode;
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({
  isOpen,
  onClose,
  onOpenRegister,
  theme,
}) => {
  const { setCurrentUser } = usePortal();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot password sub-view
  const [isForgotView, setIsForgotView] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotFeedback, setForgotFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or registered phone number.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUserApi(identifier.trim(), password);
      if (response.success && response.user) {
        setCurrentUser(response.user);
        setSuccessMessage(`Welcome back, ${response.user.fullName}!`);
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid login credentials';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      setErrorMessage('Please enter your email or phone number to reset password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await forgotPasswordApi(forgotIdentifier.trim());
      setForgotFeedback(res.message);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reset request failed';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="modal-user-login-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="modal-user-login-card"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md rounded-3xl border shadow-2xl p-6 sm:p-8 transition-all duration-300 my-auto ${
          theme === 'dark'
            ? 'bg-[#0a0d16] border-white/10 text-white shadow-indigo-950/40'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/60'
        }`}
      >
        {/* Close Button */}
        <button
          id="btn-close-login-modal"
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-full border transition-colors ${
            theme === 'dark'
              ? 'border-white/10 hover:bg-white/10 text-slate-400 hover:text-white'
              : 'border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Close login dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Visual */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <LogIn className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
              {isForgotView ? 'Reset Password' : 'User Login'}
            </h3>
            <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {isForgotView
                ? 'We will send a secure verification code'
                : 'Welcome back to your IndiChat account'}
            </p>
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-xl text-xs sm:text-sm bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3.5 rounded-xl text-xs sm:text-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {isForgotView ? (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            {forgotFeedback ? (
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs sm:text-sm space-y-3">
                <p>{forgotFeedback}</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotView(false);
                    setForgotFeedback(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    Email Address or Phone Number
                  </label>
                  <div className="relative">
                    <input
                      id="input-forgot-identifier"
                      type="text"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="e.g. rahul@example.com or +91 98765 43210"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                        theme === 'dark'
                          ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-60 flex items-center justify-center gap-2 min-h-[44px]"
                >
                  {isLoading ? 'Processing Request...' : 'Send Recovery Verification'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotView(false);
                      setErrorMessage(null);
                    }}
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </>
            )}
          </form>
        ) : (
          /* STANDARD LOGIN VIEW */
          <form onSubmit={handleSubmitLogin} className="space-y-4">
            {/* Identifier input */}
            <div>
              <label
                htmlFor="input-user-login-identifier"
                className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Email or Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="input-user-login-identifier"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or mobile number"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="input-user-login-password"
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotView(true);
                    setErrorMessage(null);
                  }}
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="input-user-login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                  required
                />
                <button
                  type="button"
                  id="btn-toggle-user-login-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="btn-submit-user-login"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-60 flex items-center justify-center gap-2 min-h-[46px] group"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to IndiChat'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Switch to Register link */}
            <div className="pt-3 text-center border-t border-white/5 dark:border-white/5">
              <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Don't have an account?{' '}
                <button
                  type="button"
                  id="btn-switch-to-register"
                  onClick={() => {
                    onClose();
                    onOpenRegister();
                  }}
                  className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                >
                  Register
                </button>
              </p>
            </div>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono-code text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.3 encrypted & salted credentials</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
