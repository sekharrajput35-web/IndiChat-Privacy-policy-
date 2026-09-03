import React from 'react';
import { Shield, Lock, ArrowRight, CheckCircle2, ChevronDown, Sparkles, Smartphone, Download } from 'lucide-react';
import { ThemeMode } from '../types';
import { HeroVisual } from './HeroVisual';
import { usePortal } from '../context/PortalContext';

interface HeroSectionProps {
  theme: ThemeMode;
  onOpenInstallApk?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ theme, onOpenInstallApk }) => {
  const { apkConfig } = usePortal();

  const isApkVisible = apkConfig.displayStatus
    ? apkConfig.displayStatus !== 'hidden'
    : apkConfig.directDownloadEnabled;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 flex flex-col justify-center overflow-hidden"
    >
      {/* Background ambient lighting grids */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-3xl opacity-30 ${
            theme === 'dark'
              ? 'bg-gradient-to-b from-indigo-600/40 via-purple-600/25 to-transparent'
              : 'bg-gradient-to-b from-indigo-300/40 via-purple-200/30 to-transparent'
          }`}
        />
        {/* Subtle cyber grid lines */}
        <div
          className={`absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]`}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col text-left space-y-6">
            {/* Top Super App Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md max-w-full shadow-sm">
              <span className="flex h-2 w-2 relative flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wide bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent uppercase font-mono-code truncate">
                IndiChat Super App · Security Standard
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              <span className={`block transition-colors ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                Your Privacy.
              </span>
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                Your Data.
              </span>
              <span className={`block transition-colors ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                Your Control.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              IndiChat is built with a privacy-first approach, giving users greater control over
              their account, content and supported privacy preferences.
            </p>

            {/* Value Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                theme === 'dark'
                  ? 'bg-indigo-950/25 border-indigo-500/20 hover:border-indigo-500/40'
                  : 'bg-indigo-50/70 border-indigo-100 hover:border-indigo-200 shadow-sm'
              }`}>
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                </div>
                <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                  Appropriate technical & organizational security
                </span>
              </div>
              <div className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                theme === 'dark'
                  ? 'bg-purple-950/25 border-purple-500/20 hover:border-purple-500/40'
                  : 'bg-purple-50/70 border-purple-100 hover:border-purple-200 shadow-sm'
              }`}>
                <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                </div>
                <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                  Public, Private & Custom visibility controls
                </span>
              </div>
              <div className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                theme === 'dark'
                  ? 'bg-pink-950/25 border-pink-500/20 hover:border-pink-500/40'
                  : 'bg-pink-50/70 border-pink-100 hover:border-pink-200 shadow-sm'
              }`}>
                <div className="w-6 h-6 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                </div>
                <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                  Zero plaintext password storage
                </span>
              </div>
              <div className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                theme === 'dark'
                  ? 'bg-cyan-950/25 border-cyan-500/20 hover:border-cyan-500/40'
                  : 'bg-cyan-50/70 border-cyan-100 hover:border-cyan-200 shadow-sm'
              }`}>
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                </div>
                <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                  Chat, Reels, Live, Commerce protected
                </span>
              </div>
            </div>

            {/* CTA Buttons with min 44px touch targets */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 w-full sm:w-auto">
              {/* Button 0: Install APK (Direct Android app installation) */}
              {isApkVisible && (
                <button
                  id="btn-hero-install-apk"
                  onClick={() => {
                    if (onOpenInstallApk) {
                      onOpenInstallApk();
                    } else {
                      window.location.href = '/api/apk/download';
                    }
                  }}
                  className="w-full sm:w-auto relative inline-flex items-center justify-center px-6 py-3.5 min-h-[48px] rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 shadow-xl shadow-emerald-600/30 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  <Smartphone className="w-4 h-4 mr-2 text-white shrink-0" />
                  <span>Install APK</span>
                  <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-black/20 text-emerald-100 font-mono shrink-0">
                    {apkConfig.versionName}
                  </span>
                  <Download className="w-3.5 h-3.5 ml-2 text-emerald-100 opacity-80 shrink-0" />
                </button>
              )}

              {/* Button 1: Explore Privacy */}
              <button
                id="btn-hero-explore-privacy"
                onClick={() => scrollToSection('privacy-overview')}
                className="w-full sm:w-auto relative inline-flex items-center justify-center px-7 py-3.5 min-h-[48px] rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-xl shadow-indigo-600/30 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                <span>Explore Privacy</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              {/* Button 2: Explore Security */}
              <button
                id="btn-hero-explore-security"
                onClick={() => scrollToSection('security')}
                className={`w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 min-h-[48px] rounded-xl font-semibold border transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
                  theme === 'dark'
                    ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white shadow-lg shadow-black/40'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-md'
                }`}
              >
                <Shield className="w-4 h-4 mr-2 text-indigo-400" />
                <span>Explore Security</span>
              </button>
            </div>

            {/* Super App Ecosystem Badges */}
            <div className={`pt-6 border-t flex items-center flex-wrap gap-2 text-xs ${
              theme === 'dark' ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
              <span className={`font-semibold uppercase tracking-wider text-[11px] mr-1 ${
                theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'
              }`}>
                One Super App:
              </span>
              {[
                { name: 'Chat', color: 'indigo' },
                { name: 'Reels & Videos', color: 'pink' },
                { name: 'Live Stream', color: 'purple' },
                { name: 'Shop & Sell', color: 'emerald' },
                { name: 'News Feed', color: 'amber' },
                { name: 'Creator Studio', color: 'cyan' },
              ].map((item) => {
                const colorStyles = {
                  indigo: theme === 'dark'
                    ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300 hover:border-indigo-400'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:border-indigo-300',
                  pink: theme === 'dark'
                    ? 'bg-pink-950/40 border-pink-500/30 text-pink-300 hover:border-pink-400'
                    : 'bg-pink-50 border-pink-200 text-pink-700 hover:border-pink-300',
                  purple: theme === 'dark'
                    ? 'bg-purple-950/40 border-purple-500/30 text-purple-300 hover:border-purple-400'
                    : 'bg-purple-50 border-purple-200 text-purple-700 hover:border-purple-300',
                  emerald: theme === 'dark'
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:border-emerald-400'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-300',
                  amber: theme === 'dark'
                    ? 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:border-amber-400'
                    : 'bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-300',
                  cyan: theme === 'dark'
                    ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300 hover:border-cyan-400'
                    : 'bg-cyan-50 border-cyan-200 text-cyan-700 hover:border-cyan-300',
                }[item.color];

                return (
                  <span
                    key={item.name}
                    className={`px-3 py-1 rounded-full border text-[11px] font-semibold transition-all shadow-sm flex items-center gap-1.5 ${colorStyles}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                    {item.name}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Futuristic Canvas Visual */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <HeroVisual theme={theme} />
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="flex justify-center pt-8">
        <button
          id="btn-hero-scroll-indicator"
          onClick={() => scrollToSection('privacy-overview')}
          className={`flex flex-col items-center gap-1.5 text-xs transition-colors hover:text-indigo-400 focus:outline-none ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}
          aria-label="Scroll to Privacy Overview"
        >
          <span className="font-mono-code text-[11px] tracking-widest uppercase">Explore Ecosystem</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-indigo-400" />
        </button>
      </div>
    </section>
  );
};
