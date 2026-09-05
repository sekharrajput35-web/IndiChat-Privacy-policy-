import React from 'react';
import { ArrowRight, Sparkles, Shield, Heart, Radio, ShoppingBag, Video, MessageCircle, Smartphone, Download } from 'lucide-react';
import { ThemeMode } from '../types';
import { usePortal } from '../context/PortalContext';

interface FinalCTAProps {
  theme: ThemeMode;
  onExploreClick: () => void;
  onOpenInstallApk?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ theme, onExploreClick, onOpenInstallApk }) => {
  const { apkConfig } = usePortal();

  const isApkVisible = apkConfig.displayStatus
    ? apkConfig.displayStatus !== 'hidden'
    : apkConfig.directDownloadEnabled;

  return (
    <section id="cta" className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[350px] bg-gradient-to-r from-purple-600/25 via-indigo-600/30 to-pink-600/25 blur-3xl rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-14 border text-center overflow-hidden shadow-2xl transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-gradient-to-b from-[#0e1424] via-[#090e1b] to-[#070a12] border-indigo-500/30 shadow-indigo-950/50'
              : 'bg-gradient-to-b from-white via-indigo-50/40 to-pink-50/40 border-indigo-200 shadow-xl shadow-indigo-100/60'
          }`}
        >
          {/* Cyber ambient grid accent inside CTA card */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-500/20 dark:bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            {/* Heading */}
            <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
            }`}>
              A Super App Built Around You
            </h2>

            {/* Description */}
            <p
              className={`text-base sm:text-lg leading-relaxed ${
                theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
              }`}
            >
              Chat, share, and connect with total control over your personal privacy.
            </p>

            {/* Action Buttons: Install APK & Explore IndiChat */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              {isApkVisible && (
                <button
                  id="btn-cta-install-apk"
                  onClick={() => {
                    if (onOpenInstallApk) {
                      onOpenInstallApk();
                    } else {
                      window.location.href = '/api/apk/download';
                    }
                  }}
                  className="w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/25 transition-all duration-200 active:scale-[0.99] text-sm sm:text-base min-h-[44px]"
                >
                  <Smartphone className="w-4 h-4 mr-2 shrink-0" />
                  <span>Install APK ({apkConfig.versionName})</span>
                  <Download className="w-4 h-4 ml-2 shrink-0 opacity-80" />
                </button>
              )}

              <button
                id="btn-explore-indichat"
                onClick={onExploreClick}
                className={`w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-3.5 rounded-2xl font-semibold transition-all duration-200 active:scale-[0.99] text-sm sm:text-base min-h-[44px] ${
                  isApkVisible
                    ? theme === 'dark'
                      ? 'border border-white/20 bg-white/10 hover:bg-white/15 text-white'
                      : 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 shadow-sm'
                    : 'text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-indigo-600/25'
                }`}
              >
                <span>Explore IndiChat</span>
                <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
