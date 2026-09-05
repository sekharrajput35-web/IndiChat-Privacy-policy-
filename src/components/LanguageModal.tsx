import React, { useState, useMemo, useEffect } from 'react';
import {
  Globe,
  Search,
  X,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Languages,
  Smartphone,
} from 'lucide-react';
import { ThemeMode } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  INDIAN_LANGUAGES,
  FOREIGN_LANGUAGES,
  ALL_LANGUAGES,
  Language,
} from '../data/languages';

interface LanguageModalProps {
  theme: ThemeMode;
}

type CategoryTab = 'all' | 'indian' | 'foreign';

export const LanguageModal: React.FC<LanguageModalProps> = ({ theme }) => {
  const {
    currentLanguage,
    deviceLanguage,
    isAutoDetect,
    changeLanguage,
    enableAutoDetect,
    isLanguageModalOpen,
    closeLanguageModal,
  } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLanguageModalOpen) {
        closeLanguageModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLanguageModalOpen, closeLanguageModal]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (isLanguageModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLanguageModalOpen]);

  // Filtered languages
  const filteredLanguages = useMemo(() => {
    let list: Language[] = [];
    if (activeTab === 'indian') {
      list = INDIAN_LANGUAGES;
    } else if (activeTab === 'foreign') {
      list = FOREIGN_LANGUAGES;
    } else {
      list = ALL_LANGUAGES;
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q) ||
        lang.region.toLowerCase().includes(q)
    );
  }, [activeTab, searchQuery]);

  if (!isLanguageModalOpen) return null;

  const handleSelectLanguage = (code: string) => {
    changeLanguage(code);
    closeLanguageModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={closeLanguageModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
    >
      <div
        className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all animate-scaleUp ${
          theme === 'dark'
            ? 'bg-[#0b0f19] border-white/15 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-indigo-500/10'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${
            theme === 'dark' ? 'border-white/10 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
              }`}
            >
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="language-modal-title"
                className="text-base sm:text-lg font-bold font-display leading-tight"
              >
                Select Language / भाषा चुनें
              </h3>
              <p
                className={`text-xs mt-0.5 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Supporting all 22 Official Indian Languages & 30+ Foreign Languages
              </p>
            </div>
          </div>

          <button
            id="btn-close-language-modal"
            type="button"
            onClick={closeLanguageModal}
            className={`p-2 rounded-xl border transition-colors ${
              theme === 'dark'
                ? 'border-white/10 hover:bg-white/10 text-slate-300 hover:text-white'
                : 'border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
            aria-label="Close language selector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar & Quick Categories */}
        <div
          className={`p-4 sm:p-5 border-b space-y-3 ${
            theme === 'dark' ? 'border-white/10 bg-white/[0.01]' : 'border-slate-100'
          }`}
        >
          {/* Search Input */}
          <div className="relative">
            <Search
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by language name or native script (e.g., Hindi, हिन्दी, Tamil, தமிழ், French, Español)..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                theme === 'dark'
                  ? 'bg-black/40 border-white/15 text-slate-100 placeholder-slate-400 focus:border-indigo-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-indigo-500'
              }`}
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-60 hover:opacity-100"
              >
                Clear
              </button>
            )}
          </div>

          {/* Auto-detected Device Language Banner */}
          <div
            className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isAutoDetect
                ? theme === 'dark'
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-emerald-50/80 border-emerald-200'
                : theme === 'dark'
                ? 'bg-indigo-950/20 border-indigo-500/20'
                : 'bg-indigo-50/60 border-indigo-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isAutoDetect
                    ? 'bg-emerald-500/20 text-emerald-500'
                    : 'bg-indigo-500/20 text-indigo-500'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">
                    Device Language: {deviceLanguage.nativeName} ({deviceLanguage.name})
                  </span>
                  {isAutoDetect ? (
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full font-semibold">
                      Auto-Synced Active
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-500/20 text-slate-500 dark:text-slate-400 rounded-full font-medium">
                      Device Detected
                    </span>
                  )}
                </div>
                <p className={`text-[11px] mt-0.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Auto-detects from your phone/browser language setting and translates the app.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                enableAutoDetect();
                closeLanguageModal();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto ${
                isAutoDetect
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
              }`}
            >
              {isAutoDetect ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Using Device Language</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Use Device Auto</span>
                </>
              )}
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div
              className={`inline-flex p-1 rounded-xl border ${
                theme === 'dark' ? 'bg-black/30 border-white/10' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : theme === 'dark'
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                All ({ALL_LANGUAGES.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('indian')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'indian'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : theme === 'dark'
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>Indian ({INDIAN_LANGUAGES.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('foreign')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'foreign'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : theme === 'dark'
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Foreign ({FOREIGN_LANGUAGES.length})
              </button>
            </div>

            {/* Quick Primary Shortcuts: English & Hindi */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              <span className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Quick:
              </span>
              <button
                type="button"
                onClick={() => handleSelectLanguage('en')}
                className={`px-2 py-1 rounded-md text-xs font-medium border ${
                  currentLanguage.code === 'en'
                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                    : theme === 'dark'
                    ? 'border-white/10 hover:bg-white/5 text-slate-300'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleSelectLanguage('hi')}
                className={`px-2 py-1 rounded-md text-xs font-medium border ${
                  currentLanguage.code === 'hi'
                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                    : theme === 'dark'
                    ? 'border-white/10 hover:bg-white/5 text-slate-300'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>
        </div>

        {/* Language Grid (Scrollable) */}
        <div className="p-4 sm:p-5 overflow-y-auto max-h-[50vh] space-y-2">
          {filteredLanguages.length === 0 ? (
            <div className="py-12 text-center">
              <Globe className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-50" />
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                No matching languages found
              </p>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Try searching by script or English name
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
              {filteredLanguages.map((lang) => {
                const isSelected = currentLanguage.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2 group ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/15 shadow-sm ring-1 ring-indigo-500'
                        : theme === 'dark'
                        ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.07] hover:border-white/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-200'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-semibold text-sm sm:text-base leading-snug truncate ${
                            isSelected
                              ? 'text-indigo-400 font-bold'
                              : theme === 'dark'
                              ? 'text-slate-100 group-hover:text-white'
                              : 'text-slate-900'
                          }`}
                        >
                          {lang.nativeName}
                        </span>
                        {lang.category === 'indian' && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 font-mono-code font-bold">
                            IN
                          </span>
                        )}
                        {lang.code === deviceLanguage.code && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-0.5" title="Detected as your device's language">
                            <Smartphone className="w-2.5 h-2.5" />
                            Device
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs ${
                            isSelected
                              ? 'text-indigo-300'
                              : theme === 'dark'
                              ? 'text-slate-400'
                              : 'text-slate-600'
                          }`}
                        >
                          {lang.name}
                        </span>
                        <span
                          className={`text-[10px] font-mono-code ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          ({lang.code})
                        </span>
                      </div>
                      <p
                        className={`text-[10px] line-clamp-1 ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {lang.region}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`p-3.5 sm:p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
            theme === 'dark' ? 'border-white/10 bg-white/[0.02] text-slate-300' : 'border-slate-100 bg-slate-50 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span>
              Real-time multilingual accessibility — translates content across all pages and dialogs.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentLanguage.code !== 'en' && (
              <button
                type="button"
                onClick={() => handleSelectLanguage('en')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                  theme === 'dark'
                    ? 'border-white/15 hover:bg-white/10 text-slate-200'
                    : 'border-slate-300 hover:bg-white text-slate-700'
                }`}
              >
                Reset to English
              </button>
            )}
            <button
              type="button"
              onClick={closeLanguageModal}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
