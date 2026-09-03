import React, { useState } from 'react';
import { ThemeMode } from '../types';
import { usePortal } from '../context/PortalContext';
import { registerUserApi } from '../services/api';
import { X, UserPlus, Lock, Eye, EyeOff, Mail, Phone, User, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';

interface UserRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  theme: ThemeMode;
}

export const UserRegisterModal: React.FC<UserRegisterModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
  theme,
}) => {
  const { setCurrentUser, registrationLink } = usePortal();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Form validations
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter a valid phone number.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerUserApi(
        fullName.trim(),
        email.trim(),
        phoneNumber.trim(),
        password,
        confirmPassword
      );

      if (response.success && response.user) {
        setCurrentUser(response.user);
        setSuccessMessage(`Account created successfully! Welcome, ${response.user.fullName}.`);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="modal-user-register-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="modal-user-register-card"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-8 transition-all duration-300 my-auto ${
          theme === 'dark'
            ? 'bg-[#0a0d16] border-white/10 text-white shadow-indigo-950/40'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/60'
        }`}
      >
        {/* Close Button */}
        <button
          id="btn-close-register-modal"
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-full border transition-colors ${
            theme === 'dark'
              ? 'border-white/10 hover:bg-white/10 text-slate-400 hover:text-white'
              : 'border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Close registration dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
              Create IndiChat Account
            </h3>
            <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Join the privacy-first super app community
            </p>
          </div>
        </div>

        {/* If custom registration URL is enabled by the administrator */}
        {registrationLink.isEnabled && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Configured Registration Portal</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live URL Active
              </span>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              {registrationLink.title || 'Official registration link configured by the administrator:'}
            </p>
            <a
              id="btn-external-register-link"
              href={registrationLink.destinationUrl}
              target={registrationLink.openInNewTab ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30"
            >
              <span>Continue via Official Registration Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="pt-1 text-center">
              <span className="text-[11px] text-slate-400">or complete quick direct registration below</span>
            </div>
          </div>
        )}

        {/* Error Feedback */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-xl text-xs sm:text-sm bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Feedback */}
        {successMessage && (
          <div className="mb-4 p-3.5 rounded-xl text-xs sm:text-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmitRegister} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="input-register-fullname"
              className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="input-register-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Vikram Sharma"
                className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
                required
              />
            </div>
          </div>

          {/* Grid: Phone Number & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Phone Number */}
            <div>
              <label
                htmlFor="input-register-phone"
                className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="input-register-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="input-register-email"
                className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="input-register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vikram@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Grid: Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Password */}
            <div>
              <label
                htmlFor="input-register-password"
                className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="input-register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className={`w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                  required
                />
                <button
                  type="button"
                  id="btn-toggle-register-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="input-register-confirm-password"
                className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="input-register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  className={`w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                  required
                />
                <button
                  type="button"
                  id="btn-toggle-register-confirm-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Create Account Button */}
          <button
            id="btn-submit-user-register"
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 mt-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-60 flex items-center justify-center gap-2 min-h-[46px] group"
          >
            <span>{isLoading ? 'Creating Secure Profile...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Switch to Login link */}
          <div className="pt-3 text-center border-t border-white/5 dark:border-white/5">
            <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Already have an account?{' '}
              <button
                type="button"
                id="btn-switch-to-login"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
              >
                Login
              </button>
            </p>
          </div>

          {/* Privacy pledge */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono-code text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero plain-text credential storage</span>
          </div>
        </form>
      </div>
    </div>
  );
};
