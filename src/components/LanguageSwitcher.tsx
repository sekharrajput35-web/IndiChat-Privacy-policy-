import React from 'react';
import { Globe, Check, ChevronRight, Sparkles, Loader2, Smartphone } from 'lucide-react';
import { ThemeMode } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSwitcherProps {
  theme: ThemeMode;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ theme }) => {
  const {
    currentLanguage,
    deviceLanguage,
    isAutoDetect,
    changeLanguage,
    enableAutoDetect,
    openLanguageModal,
    isTranslating,
  } = useLanguage();

  const isEnglish = currentLanguage.code === 'en';
  const isHindi = currentLanguage.code === 'hi';

  return (
    <div
      id="footer-language-switcher"
      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
        theme === 'dark'
          ? 'bg-white/[0.03] border-white/10 hover:border-white/20'
          : 'bg-white/80 border-slate-200 shadow-sm hover:border-indigo-200'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Section Title & Device Language Status */}
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              theme === 'dark'
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
            }`}
          >
            {isTranslating ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
            ) : (
              <Globe className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-mono-code uppercase font-bold tracking-wider ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                Language & Accessibility
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                55+ Languages
              </span>
              {isAutoDetect ? (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Smartphone className="w-3 h-3" />
                  Auto: Device Synced
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20">
                  Manual Selection
                </span>
              )}
            </div>
            <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Current: <strong className="font-semibold text-indigo-600 dark:text-indigo-400">{currentLanguage.nativeName} ({currentLanguage.name})</strong>
              {' '}• Detected Device: <span className="underline decoration-dotted" title="Automatically detected from your device / browser">{deviceLanguage.nativeName} ({deviceLanguage.name})</span>
            </p>
          </div>
        </div>

        {/* Right: Quick Toggle & All Languages Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Auto Device Language Button */}
          <button
            id="btn-lang-auto-device"
            type="button"
            onClick={enableAutoDetect}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isAutoDetect
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                : theme === 'dark'
                ? 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
            title={`Automatically follow your device language (${deviceLanguage.name})`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Auto ({deviceLanguage.nativeName})</span>
            {isAutoDetect && <Check className="w-3 h-3 text-emerald-500" />}
          </button>

          {/* Quick Toggle: English vs Hindi */}
          <div
            className={`inline-flex p-1 rounded-xl border ${
              theme === 'dark'
                ? 'bg-black/30 border-white/10'
                : 'bg-slate-100 border-slate-200'
            }`}
            role="group"
            aria-label="Quick Language Toggle"
          >
            {/* English Button */}
            <button
              id="btn-lang-en"
              type="button"
              onClick={() => changeLanguage('en', true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                !isAutoDetect && isEnglish
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : theme === 'dark'
                  ? 'text-slate-300 hover:text-white hover:bg-white/5'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
              title="Switch to English"
            >
              {!isAutoDetect && isEnglish && <Check className="w-3 h-3" />}
              <span>English</span>
            </button>

            {/* Hindi Button */}
            <button
              id="btn-lang-hi"
              type="button"
              onClick={() => changeLanguage('hi', true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                !isAutoDetect && isHindi
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : theme === 'dark'
                  ? 'text-slate-300 hover:text-white hover:bg-white/5'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
              title="हिन्दी में बदलें (Switch to Hindi)"
            >
              {!isAutoDetect && isHindi && <Check className="w-3 h-3" />}
              <span>हिन्दी (Hindi)</span>
            </button>
          </div>

          {/* All Languages (Indian & Foreign) Modal Trigger */}
          <button
            id="btn-open-language-modal"
            type="button"
            onClick={openLanguageModal}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
              !isAutoDetect && !isEnglish && !isHindi
                ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-400 font-bold'
                : theme === 'dark'
                ? 'border-white/15 bg-white/5 hover:bg-white/10 text-slate-200'
                : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-sm'
            }`}
            title="Browse all 22+ Indian and 30+ foreign languages"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>More Languages</span>
            <ChevronRight className="w-3 h-3 opacity-60" />
          </button>
        </div>
      </div>
    </div>
  );
};

