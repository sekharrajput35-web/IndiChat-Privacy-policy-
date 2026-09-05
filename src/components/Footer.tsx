import React from 'react';
import { Shield, Lock, Heart, Mail, ExternalLink, ArrowUp, ShieldCheck, Phone, Smartphone, Download } from 'lucide-react';
import { ThemeMode } from '../types';
import { usePortal } from '../context/PortalContext';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  theme: ThemeMode;
  onOpenTerms: () => void;
  onOpenContact: () => void;
  onOpenAdminLogin?: () => void;
  onOpenInstallApk?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ theme, onOpenTerms, onOpenContact, onOpenAdminLogin, onOpenInstallApk }) => {
  const { contactInfo, apkConfig } = usePortal();

  const isApkVisible = apkConfig.displayStatus
    ? apkConfig.displayStatus !== 'hidden'
    : apkConfig.directDownloadEnabled;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="indichat-footer"
      className={`relative pt-16 pb-12 border-t transition-colors duration-300 overflow-hidden ${
        theme === 'dark'
          ? 'bg-[#05070c] border-white/10 text-slate-400'
          : 'bg-gradient-to-b from-slate-50 to-indigo-50/30 border-slate-200 text-slate-600'
      }`}
    >
      {/* Ambient subtle glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 pb-12 border-b ${
          theme === 'dark' ? 'border-white/10' : 'border-slate-200'
        }`}>
          {/* Brand & Description */}
          <div className="md:col-span-6 space-y-4 text-left">
            <BrandLogo size="lg" showTagline={false} />

            <p className={`text-sm leading-relaxed max-w-md ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              IndiChat — A next-generation super app for communication, content, entertainment and commerce.
            </p>

            <div className="text-xs font-mono-code font-semibold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
              Everything You Love. One App You Trust.
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h4 className={`text-xs font-mono-code uppercase font-bold tracking-wider ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
            }`}>
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => scrollTo('hero')}
                  className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded py-1"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('privacy-policy')}
                  className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded py-1"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('security')}
                  className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded py-1"
                >
                  Security
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('privacy-center')}
                  className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded py-1"
                >
                  Privacy Center
                </button>
              </li>
              {isApkVisible && (
                <li>
                  <button
                    id="footer-install-apk-btn"
                    onClick={() => {
                      if (onOpenInstallApk) {
                        onOpenInstallApk();
                      } else {
                        window.location.href = '/api/apk/download';
                      }
                    }}
                    className="hover:text-emerald-500 dark:hover:text-emerald-400 text-emerald-600 dark:text-emerald-400 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded py-1 flex items-center gap-1.5"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Install APK ({apkConfig.versionName})</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Legal & Help Column */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h4 className={`text-xs font-mono-code uppercase font-bold tracking-wider ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
            }`}>
              Governance & Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => scrollTo('faq')}
                  className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded py-1"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded py-1"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded py-1 flex items-center gap-1.5"
                >
                  <span>Contact Privacy Team</span>
                  <Mail className="w-3.5 h-3.5 text-pink-500" />
                </button>
              </li>
              {contactInfo.privacyEmail && (
                <li className="text-xs font-mono-code text-slate-400">
                  <span className="block text-[10px] uppercase text-slate-500">Official Privacy DPO:</span>
                  <a href={`mailto:${contactInfo.privacyEmail}`} className="hover:text-indigo-400 transition-colors">
                    {contactInfo.privacyEmail}
                  </a>
                </li>
              )}
              {onOpenAdminLogin && (
                <li className="pt-1">
                  <button
                    id="footer-admin-login-link"
                    onClick={onOpenAdminLogin}
                    className="text-xs text-slate-500 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Administrator Gateway</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="text-center sm:text-left">
            © 2026 IndiChat. All rights reserved.
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="font-mono-code text-[11px] text-center">
              Privacy-First Super App Architecture
            </span>
            <button
              onClick={scrollToTop}
              className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center ${
                theme === 'dark'
                  ? 'border-white/10 hover:bg-white/10 text-slate-300'
                  : 'border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 bg-white shadow-sm'
              }`}
              title="Back to Top"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
