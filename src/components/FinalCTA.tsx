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

          <div className="relative z-10 max-w-3xl mx-auto space-y-5 sm:space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 backdrop-blur-md max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-pink-500 dark:text-pink-400 shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase font-mono-code text-pink-600 dark:text-pink-300 truncate">
                Everything You Love. One App You Trust.
              </span>
            </div>

            {/* Exact Required Heading */}
            <h2 className={`font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
            }`}>
              A Super App Built Around You
            </h2>

            {/* Exact Required Description */}
            <p
              className={`text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Chat, create, share, discover, shop, sell, watch and connect—all while maintaining control over
              your supported privacy preferences.
            </p>

            {/* Super App Feature Matrix Pills */}
            <div className="flex flex-wrap justify-center gap-2 pt-2 pb-2">
              {[
                { label: 'Chat & Audio', icon: MessageCircle, color: 'text-indigo-500' },
                { label: 'Reels & Shorts', icon: Video, color: 'text-pink-500' },
                { label: 'Live Broadcasts', icon: Radio, color: 'text-rose-500' },
                { label: 'Shop & Marketplace', icon: ShoppingBag, color: 'text-amber-500' },
                { label: 'Social Discovery', icon: Heart, color: 'text-purple-500' },
                { label: 'Privacy Vault', icon: Shield, color: 'text-emerald-500' },
              ].map((pill, i) => {
                const PillIcon = pill.icon;
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      theme === 'dark'
                        ? 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                        : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:border-indigo-200'
                    }`}
                  >
                    <PillIcon className={`w-3.5 h-3.5 ${pill.color} shrink-0`} />
                    <span>{pill.label}</span>
                  </span>
                );
              })}
            </div>

            {/* Action Buttons: Install APK & Explore IndiChat */}
            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
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
                  className="w-full sm:w-auto relative inline-flex items-center justify-center px-8 sm:px-9 py-3.5 sm:py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 shadow-xl shadow-emerald-600/30 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm sm:text-base min-h-[48px]"
                >
                  <Smartphone className="w-5 h-5 mr-2 shrink-0" />
                  <span>Install APK ({apkConfig.versionName})</span>
                  <Download className="w-4 h-4 ml-2.5 shrink-0 opacity-80" />
                </button>
              )}

              <button
                id="btn-explore-indichat"
                onClick={onExploreClick}
                className={`w-full sm:w-auto relative inline-flex items-center justify-center px-8 sm:px-9 py-3.5 sm:py-4 rounded-2xl font-bold transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 text-sm sm:text-base min-h-[48px] ${
                  isApkVisible
                    ? 'border border-white/20 bg-white/10 hover:bg-white/15 text-white shadow-lg'
                    : 'text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-xl shadow-indigo-600/30'
                }`}
              >
                <span>Explore IndiChat</span>
                <ArrowRight className="w-5 h-5 ml-2.5 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
