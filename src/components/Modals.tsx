import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  LockKeyhole,
  Smartphone,
  ShieldAlert,
  Activity,
  KeyRound,
  ArrowRight,
  Sparkles,
  Mail,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Video,
  Radio,
  ShoppingBag,
  Heart,
  FileText,
  Phone,
} from 'lucide-react';
import { SecurityCardItem, ThemeMode } from '../types';
import { usePortal } from '../context/PortalContext';

interface ModalsProps {
  theme: ThemeMode;
  securityModalItem: SecurityCardItem | null;
  onCloseSecurityModal: () => void;
  showExploreModal: boolean;
  onCloseExploreModal: () => void;
  showTermsModal: boolean;
  onCloseTermsModal: () => void;
  showContactModal: boolean;
  onCloseContactModal: () => void;
  onNavigateToPolicy: () => void;
}

export const Modals: React.FC<ModalsProps> = ({
  theme,
  securityModalItem,
  onCloseSecurityModal,
  showExploreModal,
  onCloseExploreModal,
  showTermsModal,
  onCloseTermsModal,
  showContactModal,
  onCloseContactModal,
  onNavigateToPolicy,
}) => {
  const { contactInfo } = usePortal();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  const getSecurityIcon = (iconName?: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return ShieldCheck;
      case 'LockKeyhole':
        return LockKeyhole;
      case 'Smartphone':
      case 'SmartphoneCheck':
        return Smartphone;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'Activity':
        return Activity;
      case 'KeyRound':
        return KeyRound;
      default:
        return ShieldCheck;
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(contactInfo.privacyEmail || 'privacy@indichat.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail.trim()) {
      setWaitlistSuccess(true);
      setTimeout(() => {
        setWaitlistEmail('');
        setWaitlistSuccess(false);
        onCloseExploreModal();
      }, 2500);
    }
  };

  return (
    <>
      {/* 1. SECURITY DETAIL MODAL */}
      {securityModalItem && (
        <div
          id="modal-security-detail"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`relative w-full max-w-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 border shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto ${
              theme === 'dark'
                ? 'bg-[#0a0e1a] border-white/15 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Ambient corner glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className={`flex items-start justify-between pb-4 border-b mb-6 ${
              theme === 'dark' ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
                  {React.createElement(getSecurityIcon(securityModalItem.iconName), {
                    className: 'w-5 h-5 sm:w-6 sm:h-6',
                  })}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-mono-code uppercase font-semibold text-indigo-400 block truncate">
                    Security Specification
                  </span>
                  <h3 className={`font-display text-lg sm:text-2xl font-bold break-words ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {securityModalItem.title}
                  </h3>
                </div>
              </div>
              <button
                id="btn-close-security-modal"
                onClick={onCloseSecurityModal}
                className={`shrink-0 p-2 sm:p-2.5 rounded-xl border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ml-2 ${
                  theme === 'dark' ? 'border-white/10 hover:bg-white/10 text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Explanation Body */}
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <p
                className={`p-3.5 sm:p-4 rounded-xl border ${
                  theme === 'dark'
                    ? 'bg-indigo-950/20 border-indigo-500/20 text-slate-200'
                    : 'bg-indigo-50 border-indigo-200 text-slate-800'
                }`}
              >
                {securityModalItem.detailedExplanation}
              </p>

              <div>
                <h4 className={`font-mono-code text-xs font-semibold uppercase mb-2 ${
                  theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'
                }`}>
                  Key Safeguards:
                </h4>
                <div className="space-y-2">
                  {securityModalItem.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
                      <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>
                        {h}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer with button to Privacy Policy section */}
            <div className={`mt-6 sm:mt-8 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
              theme === 'dark' ? 'border-white/10' : 'border-slate-200'
            }`}>
              <button
                id="btn-modal-to-policy"
                onClick={() => {
                  onCloseSecurityModal();
                  onNavigateToPolicy();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 flex items-center justify-center gap-2 shadow-md min-h-[44px]"
              >
                <span>Read in Privacy Policy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onCloseSecurityModal}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors min-h-[44px] ${
                  theme === 'dark' ? 'border-white/10 hover:bg-white/10 text-slate-200' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                }`}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. EXPLORE INDICHAT MODAL */}
      {showExploreModal && (
        <div
          id="modal-explore-indichat"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`relative w-full max-w-lg rounded-2xl sm:rounded-3xl p-4 sm:p-8 border shadow-2xl text-center overflow-hidden max-h-[90vh] overflow-y-auto ${
              theme === 'dark'
                ? 'bg-[#0a0e1a] border-white/15 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Close Button */}
            <button
              id="btn-close-explore-modal"
              onClick={onCloseExploreModal}
              className={`absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                theme === 'dark' ? 'border-white/10 hover:bg-white/10 text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Brand Glyph */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-[2px] shadow-xl shadow-indigo-500/30 mb-3 sm:mb-4 mt-2 sm:mt-0">
              <div
                className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                  theme === 'dark' ? 'bg-[#080c16]' : 'bg-white'
                }`}
              >
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-pink-400 animate-pulse" />
              </div>
            </div>

            {/* Required Brand & Tagline Display */}
            <h3 className={`font-display text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-white via-indigo-200 to-pink-300'
                : 'bg-gradient-to-r from-slate-900 via-indigo-700 to-pink-600'
            }`}>
              IndiChat
            </h3>
            <p className="font-mono-code text-xs sm:text-sm font-semibold text-pink-500 mt-1 mb-4 sm:mb-6">
              Everything You Love. One App You Trust.
            </p>

            <p className={`text-xs sm:text-sm max-w-md mx-auto mb-5 sm:mb-6 leading-relaxed ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
            }`}>
              IndiChat is currently in final private preview engineering. Get notified the moment the next-generation
              super app launches on Android, iOS, and Web.
            </p>

            {/* Super App Modules Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5 sm:mb-6 text-xs">
              {[
                { icon: MessageCircle, label: 'Instant Chat', color: 'text-indigo-500' },
                { icon: Video, label: 'Reels & Video', color: 'text-pink-500' },
                { icon: Radio, label: 'Live Streams', color: 'text-purple-500' },
                { icon: ShoppingBag, label: 'Shop & Sell', color: 'text-emerald-500' },
                { icon: Heart, label: 'Social Feeds', color: 'text-rose-500' },
                { icon: Sparkles, label: 'Creator Studio', color: 'text-cyan-500' },
              ].map((mod, i) => {
                const ModIcon = mod.icon;
                return (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-medium ${
                      theme === 'dark'
                        ? 'border-white/10 bg-white/5 text-slate-200'
                        : 'border-slate-200 bg-slate-50 text-slate-700 shadow-sm'
                    }`}
                  >
                    <ModIcon className={`w-3.5 h-3.5 ${mod.color}`} />
                    <span className="truncate">{mod.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Early Access Notification Form */}
            {!waitlistSuccess ? (
              <form onSubmit={handleWaitlistSubmit} className="space-y-3 mb-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email..."
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-[44px] ${
                      theme === 'dark'
                        ? 'bg-white/10 border-white/15 text-white placeholder-slate-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                    }`}
                  />
                  {/* Required Coming Soon Button */}
                  <button
                    id="btn-modal-coming-soon"
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-indigo-600/30 whitespace-nowrap min-h-[44px]"
                  >
                    Coming Soon
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold mb-4">
                Thank you! You are on the priority early access list.
              </div>
            )}

            <button
              onClick={onCloseExploreModal}
              className={`text-xs underline font-mono-code ${
                theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Back to Privacy & Security Portal
            </button>
          </div>
        </div>
      )}

      {/* 3. TERMS OF SERVICE MODAL */}
      {showTermsModal && (
        <div
          id="modal-terms-of-service"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`relative w-full max-w-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 border shadow-2xl max-h-[90vh] overflow-y-auto ${
              theme === 'dark'
                ? 'bg-[#0a0e1a] border-white/15 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className={`flex items-center justify-between pb-4 border-b mb-6 ${
              theme === 'dark' ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 shrink-0" />
                <h3 className={`font-display text-lg sm:text-xl font-bold truncate ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  Terms of Service Summary
                </h3>
              </div>
              <button
                onClick={onCloseTermsModal}
                className={`shrink-0 p-2 rounded-xl border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ml-2 ${
                  theme === 'dark' ? 'border-white/10 hover:bg-white/10 text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`space-y-4 text-xs sm:text-sm leading-relaxed ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
            }`}>
              <p>
                By using IndiChat ("the Platform"), users agree to maintain authentic community interactions, respect
                intellectual property rights, and abide by applicable laws.
              </p>
              <div className={`p-3.5 rounded-xl border space-y-2 ${
                theme === 'dark' ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'
              }`}>
                <h4 className={`font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                  1. Account Responsibility
                </h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Users are responsible for safeguarding their login credentials and the activities that occur under their
                  account.
                </p>
              </div>
              <div className={`p-3.5 rounded-xl border space-y-2 ${
                theme === 'dark' ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'
              }`}>
                <h4 className={`font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                  2. Prohibited Content & Conduct
                </h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Harassment, non-consensual content sharing, automated abuse, fraudulent marketplace listings, and
                  unauthorized data extraction are strictly prohibited.
                </p>
              </div>
              <div className={`p-3.5 rounded-xl border space-y-2 ${
                theme === 'dark' ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'
              }`}>
                <h4 className={`font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                  3. Privacy Enforcement
                </h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Private content visibility rules are strictly respected. Users may not attempt to circumvent or reverse
                  engineer audience access controls.
                </p>
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t flex justify-end ${
              theme === 'dark' ? 'border-white/10' : 'border-slate-200'
            }`}>
              <button
                onClick={onCloseTermsModal}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 min-h-[44px]"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. CONTACT MODAL */}
      {showContactModal && (
        <div
          id="modal-contact-privacy"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`relative w-full max-w-lg rounded-2xl sm:rounded-3xl p-4 sm:p-8 border shadow-2xl max-h-[90vh] overflow-y-auto ${
              theme === 'dark'
                ? 'bg-[#0a0e1a] border-white/15 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className={`flex items-center justify-between pb-4 border-b mb-6 ${
              theme === 'dark' ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 shrink-0" />
                <h3 className={`font-display text-lg sm:text-xl font-bold truncate ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  Contact Privacy Team
                </h3>
              </div>
              <button
                onClick={onCloseContactModal}
                className={`shrink-0 p-2 rounded-xl border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ml-2 ${
                  theme === 'dark' ? 'border-white/10 hover:bg-white/10 text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`space-y-4 text-xs sm:text-sm leading-relaxed ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
            }`}>
              <p>
                Our dedicated Data Protection and Security Team reviews all verified inquiries regarding account data,
                privacy preferences, and security telemetry.
              </p>

              <div className="space-y-3">
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  theme === 'dark'
                    ? 'border-indigo-500/30 bg-indigo-950/30'
                    : 'border-indigo-200 bg-indigo-50'
                }`}>
                  <div className="min-w-0">
                    <span className={`text-xs font-mono-code block ${
                      theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'
                    }`}>
                      Official Privacy DPO Address:
                    </span>
                    <span className={`text-sm sm:text-base font-bold font-mono-code break-all ${
                      theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      {contactInfo.privacyEmail || 'privacy@indichat.com'}
                    </span>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="w-full sm:w-auto px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 flex items-center justify-center gap-1 min-h-[44px] shrink-0"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {contactInfo.supportEmail && (
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                    theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div>
                      <span className={`block text-[11px] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        User Support Helpdesk:
                      </span>
                      <span className="font-mono-code font-bold text-indigo-600 dark:text-indigo-400">{contactInfo.supportEmail}</span>
                    </div>
                    <a
                      href={`mailto:${contactInfo.supportEmail}`}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                    >
                      Send Mail
                    </a>
                  </div>
                )}

                {contactInfo.phoneNumber && (
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                    theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div>
                      <span className={`block text-[11px] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        Direct Telephone Assistance:
                      </span>
                      <span className="font-mono-code font-bold text-emerald-700 dark:text-emerald-400">{contactInfo.phoneNumber}</span>
                    </div>
                    <a
                      href={`tel:${contactInfo.phoneNumber}`}
                      className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
                    >
                      Call
                    </a>
                  </div>
                )}
              </div>

              <div className={`text-xs leading-relaxed ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>
                <p>Standard response turnaround: Within 24-48 business hours.</p>
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t flex justify-end ${
              theme === 'dark' ? 'border-white/10' : 'border-slate-200'
            }`}>
              <button
                onClick={onCloseContactModal}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-colors min-h-[44px] ${
                  theme === 'dark'
                    ? 'text-white bg-slate-800 hover:bg-slate-700'
                    : 'text-slate-800 bg-slate-200 hover:bg-slate-300'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
