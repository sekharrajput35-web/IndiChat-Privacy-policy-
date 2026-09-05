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
            {/* Main Heading */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
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

            {/* Subtitle - Clean, direct, no jargon */}
            <p
              className={`text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Built with end-to-end security, clear privacy controls, and full respect for your personal information.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 w-full sm:w-auto">
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
                  className="w-full sm:w-auto relative inline-flex items-center justify-center px-6 py-3.5 min-h-[48px] rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 shadow-xl shadow-emerald-600/25 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <Smartphone className="w-4 h-4 mr-2 text-white shrink-0" />
                  <span>Download App</span>
                  {apkConfig.versionName && (
                    <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-black/20 text-emerald-100 font-mono shrink-0">
                      {apkConfig.versionName}
                    </span>
                  )}
                  <Download className="w-3.5 h-3.5 ml-2 text-emerald-100 opacity-80 shrink-0" />
                </button>
              )}

              {/* Button 1: Explore Privacy */}
              <button
                id="btn-hero-explore-privacy"
                onClick={() => scrollToSection('privacy-overview')}
                className="w-full sm:w-auto relative inline-flex items-center justify-center px-7 py-3.5 min-h-[48px] rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-xl shadow-indigo-600/25 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span>Privacy Overview</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Futuristic Canvas Visual */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <HeroVisual theme={theme} />
          </div>
        </div>
      </div>
    </section>
  );
};
