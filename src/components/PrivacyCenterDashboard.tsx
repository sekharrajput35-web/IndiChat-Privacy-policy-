import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  FileSearch,
  FolderLock,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Download,
  Trash2,
  Smartphone,
  CheckCircle,
  X,
  ToggleLeft,
  ToggleRight,
  HardDrive,
  ShieldAlert,
} from 'lucide-react';
import { ThemeMode } from '../types';

interface PrivacyCenterDashboardProps {
  theme: ThemeMode;
}

export const PrivacyCenterDashboard: React.FC<PrivacyCenterDashboardProps> = ({ theme }) => {
  // Modal / panel states for interactive cards
  const [activeModal, setActiveModal] = useState<'settings' | 'manage' | null>(null);

  // Demo toggle states inside settings panel
  const [demoToggles, setDemoToggles] = useState({
    adPersonalization: false,
    activityStatus: true,
    searchIndexing: false,
    readReceipts: true,
    contactSync: false,
  });

  const [downloadRequested, setDownloadRequested] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // State for simulated modal feedback instead of window.alert
  const [sessionTerminationStatus, setSessionTerminationStatus] = useState<string | null>(null);
  const [deletionStatus, setDeletionStatus] = useState<string | null>(null);

  const handleToggle = (key: keyof typeof demoToggles) => {
    setDemoToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <section id="privacy-center" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/25 text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Command Center</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
            <span className={theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}>Your Privacy </span>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Center
            </span>
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            A centralized dashboard to configure settings, inspect account defenses, review data flows, and exercise
            your privacy rights.
          </p>
        </div>

        {/* Dashboard Cards Grid (5 Interactive Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* 1. PRIVACY SETTINGS */}
          <div
            id="privacy-center-card-settings"
            onClick={() => setActiveModal('settings')}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setActiveModal('settings');
            }}
            className={`group p-5 sm:p-7 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between active:scale-[0.99] ${
              theme === 'dark'
                ? 'bg-[#0d1220]/90 border-white/10 hover:border-purple-500/50 hover:bg-[#12182b]'
                : 'bg-white border-slate-200 shadow-md shadow-slate-200/50 hover:border-purple-400 hover:shadow-xl'
            } hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center p-0.5 bg-gradient-to-tr from-purple-500 to-indigo-500 shadow-md mb-5">
                <div
                  className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                    theme === 'dark' ? 'bg-[#0a0e1a]' : 'bg-white'
                  }`}
                >
                  <Sliders className="w-6 h-6 text-purple-400 group-hover:text-pink-400 transition-colors" />
                </div>
              </div>
              <h3 className={`font-display text-xl font-bold group-hover:text-purple-400 transition-colors mb-2 ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>
                PRIVACY SETTINGS
              </h3>
              <p className={`text-sm leading-relaxed mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Click to open an interactive simulation of IndiChat privacy toggles, advertising personalization
                filters, and activity visibility controls.
              </p>
            </div>
            <div className={`pt-4 border-t flex items-center justify-between text-xs font-semibold text-purple-400 ${
              theme === 'dark' ? 'border-white/10' : 'border-slate-100'
            }`}>
              <span>Open Preference Demo</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. ACCOUNT SECURITY */}
          <div
            id="privacy-center-card-security"
            onClick={() => scrollTo('security')}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') scrollTo('security');
            }}
            className={`group p-5 sm:p-7 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between active:scale-[0.99] ${
              theme === 'dark'
                ? 'bg-[#0d1220]/90 border-white/10 hover:border-indigo-500/50 hover:bg-[#12182b]'
                : 'bg-white border-slate-200 shadow-md shadow-slate-200/50 hover:border-indigo-400 hover:shadow-xl'
            } hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center p-0.5 bg-gradient-to-tr from-indigo-500 to-blue-500 shadow-md mb-5">
                <div
                  className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                    theme === 'dark' ? 'bg-[#0a0e1a]' : 'bg-white'
                  }`}
                >
                  <ShieldCheck className="w-6 h-6 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>
              <h3 className={`font-display text-xl font-bold group-hover:text-indigo-400 transition-colors mb-2 ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>
                ACCOUNT SECURITY
              </h3>
              <p className={`text-sm leading-relaxed mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Explore cryptographic protection, live session monitoring, multi-factor login checks, and defense against
                unauthorized access.
              </p>
            </div>
            <div className={`pt-4 border-t flex items-center justify-between text-xs font-semibold text-indigo-400 ${
              theme === 'dark' ? 'border-white/10' : 'border-slate-100'
            }`}>
              <span>Scroll to Security Architecture</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. DATA TRANSPARENCY */}
          <div
            id="privacy-center-card-transparency"
            onClick={() => scrollTo('transparency')}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') scrollTo('transparency');
            }}
            className={`group p-5 sm:p-7 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between active:scale-[0.99] ${
              theme === 'dark'
                ? 'bg-[#0d1220]/90 border-white/10 hover:border-pink-500/50 hover:bg-[#12182b]'
                : 'bg-white border-slate-200 shadow-md shadow-slate-200/50 hover:border-pink-400 hover:shadow-xl'
            } hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center p-0.5 bg-gradient-to-tr from-pink-500 to-rose-500 shadow-md mb-5">
                <div
                  className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                    theme === 'dark' ? 'bg-[#0a0e1a]' : 'bg-white'
                  }`}
                >
                  <FileSearch className="w-6 h-6 text-pink-400 group-hover:text-rose-400 transition-colors" />
                </div>
              </div>
              <h3 className={`font-display text-xl font-bold group-hover:text-pink-400 transition-colors mb-2 ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>
                DATA TRANSPARENCY
              </h3>
              <p className={`text-sm leading-relaxed mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                See the interactive lifecycle of your information: how account data is generated, used, isolated, and
                controlled step by step.
              </p>
            </div>
            <div className={`pt-4 border-t flex items-center justify-between text-xs font-semibold text-pink-400 ${
              theme === 'dark' ? 'border-white/10' : 'border-slate-100'
            }`}>
              <span>Scroll to Transparency Flow</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. MANAGE YOUR INFORMATION */}
          <div
            id="privacy-center-card-manage"
            onClick={() => setActiveModal('manage')}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setActiveModal('manage');
            }}
            className={`group p-5 sm:p-7 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between active:scale-[0.99] ${
              theme === 'dark'
                ? 'bg-[#0d1220]/90 border-white/10 hover:border-emerald-500/50 hover:bg-[#12182b]'
                : 'bg-white border-slate-200 shadow-md shadow-slate-200/50 hover:border-emerald-400 hover:shadow-xl'
            } hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center p-0.5 bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-md mb-5">
                <div
                  className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                    theme === 'dark' ? 'bg-[#0a0e1a]' : 'bg-white'
                  }`}
                >
                  <FolderLock className="w-6 h-6 text-emerald-400 group-hover:text-teal-300 transition-colors" />
                </div>
              </div>
              <h3 className={`font-display text-xl font-bold group-hover:text-emerald-400 transition-colors mb-2 ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>
                MANAGE YOUR INFORMATION
              </h3>
              <p className={`text-sm leading-relaxed mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Launch our interactive management interface: download personal data archive, view active devices, and
                test account deletion flows.
              </p>
            </div>
            <div className={`pt-4 border-t flex items-center justify-between text-xs font-semibold text-emerald-400 ${
              theme === 'dark' ? 'border-white/10' : 'border-slate-100'
            }`}>
              <span>Open Data Management</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. PRIVACY FAQ */}
          <div
            id="privacy-center-card-faq"
            onClick={() => scrollTo('faq')}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') scrollTo('faq');
            }}
            className={`group p-5 sm:p-7 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between md:col-span-2 lg:col-span-2 active:scale-[0.99] ${
              theme === 'dark'
                ? 'bg-[#0d1220]/90 border-white/10 hover:border-cyan-500/50 hover:bg-[#12182b]'
                : 'bg-white border-slate-200 shadow-md shadow-slate-200/50 hover:border-cyan-400 hover:shadow-xl'
            } hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center p-0.5 bg-gradient-to-tr from-cyan-500 to-indigo-500 shadow-md mb-5">
                <div
                  className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                    theme === 'dark' ? 'bg-[#0a0e1a]' : 'bg-white'
                  }`}
                >
                  <HelpCircle className="w-6 h-6 text-cyan-400 group-hover:text-indigo-300 transition-colors" />
                </div>
              </div>
              <h3 className={`font-display text-xl font-bold group-hover:text-cyan-400 transition-colors mb-2 ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>
                PRIVACY FAQ
              </h3>
              <p className={`text-sm leading-relaxed mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Direct answers to common questions about password encryption, multi-device usage, Private mode
                enforcement, and managing your privacy settings.
              </p>
            </div>
            <div className={`pt-4 border-t flex items-center justify-between text-xs font-semibold text-cyan-400 ${
              theme === 'dark' ? 'border-white/10' : 'border-slate-100'
            }`}>
              <span>Scroll to Interactive FAQ</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: PRIVACY SETTINGS DEMO PANEL */}
      {activeModal === 'settings' && (
        <div
          id="modal-privacy-settings"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            className={`relative w-full max-w-lg rounded-2xl sm:rounded-3xl p-4 sm:p-8 border shadow-2xl max-h-[90vh] overflow-y-auto ${
              theme === 'dark' ? 'bg-[#0a0e1a] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className={`flex items-center justify-between pb-4 border-b mb-6 ${
              theme === 'dark' ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-display text-lg font-bold ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>Privacy Settings Simulation</h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Test IndiChat privacy preference toggles
                  </p>
                </div>
              </div>
              <button
                id="btn-close-settings-modal"
                onClick={() => setActiveModal(null)}
                className={`p-2 rounded-xl border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  theme === 'dark' ? 'border-white/10 hover:bg-white/10 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Toggle 1 */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                theme === 'dark' ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'
              }`}>
                <div>
                  <p className={`font-semibold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                    Ad Personalization
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Prevent interest profiling based on activity
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('adPersonalization')}
                  className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center text-2xl text-purple-400"
                  aria-label="Toggle Ad Personalization"
                >
                  {demoToggles.adPersonalization ? (
                    <ToggleRight className="w-8 h-8 text-purple-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Toggle 2 */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                theme === 'dark' ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'
              }`}>
                <div>
                  <p className={`font-semibold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                    Activity Status Presence
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Show when you are currently online in chats
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('activityStatus')}
                  className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center text-2xl text-purple-400"
                  aria-label="Toggle Activity Status"
                >
                  {demoToggles.activityStatus ? (
                    <ToggleRight className="w-8 h-8 text-purple-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Toggle 3 */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                theme === 'dark' ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'
              }`}>
                <div>
                  <p className={`font-semibold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                    Search Engine Indexing
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Allow public profile link indexing
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('searchIndexing')}
                  className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center text-2xl text-purple-400"
                  aria-label="Toggle Search Indexing"
                >
                  {demoToggles.searchIndexing ? (
                    <ToggleRight className="w-8 h-8 text-purple-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Toggle 4 */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                theme === 'dark' ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'
              }`}>
                <div>
                  <p className={`font-semibold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                    Read Receipts
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Send delivery and read checks in direct chats
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('readReceipts')}
                  className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center text-2xl text-purple-400"
                  aria-label="Toggle Read Receipts"
                >
                  {demoToggles.readReceipts ? (
                    <ToggleRight className="w-8 h-8 text-purple-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t flex items-center justify-between ${
              theme === 'dark' ? 'border-white/10' : 'border-slate-200'
            }`}>
              <span className="text-xs font-mono-code text-emerald-500 dark:text-emerald-400 font-semibold">
                All changes sync automatically
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-md shadow-purple-600/30"
              >
                Close Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: MANAGE YOUR INFORMATION DEMO INTERFACE */}
      {activeModal === 'manage' && (
        <div
          id="modal-manage-information"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            className={`relative w-full max-w-lg rounded-2xl sm:rounded-3xl p-4 sm:p-8 border shadow-2xl max-h-[90vh] overflow-y-auto ${
              theme === 'dark' ? 'bg-[#0a0e1a] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className={`flex items-center justify-between pb-4 border-b mb-6 ${
              theme === 'dark' ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <FolderLock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-display text-lg font-bold ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>Information Management</h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Data portability, devices & account deletion
                  </p>
                </div>
              </div>
              <button
                id="btn-close-manage-modal"
                onClick={() => setActiveModal(null)}
                className={`p-2 rounded-xl border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  theme === 'dark' ? 'border-white/10 hover:bg-white/10 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Option 1: Download Archive */}
              <div className={`p-4 rounded-xl border ${
                theme === 'dark' ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                      Download Account Archive
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono-code font-semibold px-2 py-0.5 rounded border ${
                    theme === 'dark' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  }`}>
                    ZIP Archive
                  </span>
                </div>
                <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Receive a machine-readable JSON/HTML package of your posts, reels history, and profile data.
                </p>
                <button
                  onClick={() => setDownloadRequested(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
                >
                  {downloadRequested ? <CheckCircle className="w-4 h-4" /> : <HardDrive className="w-4 h-4" />}
                  <span>{downloadRequested ? 'Archive Request Queued (Ready in ~1h)' : 'Simulate Data Export'}</span>
                </button>
              </div>

              {/* Option 2: Active Connected Sessions */}
              <div className={`p-4 rounded-xl border ${
                theme === 'dark' ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                    <span className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                      Active Authorized Sessions
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-code text-emerald-500 dark:text-emerald-400 font-semibold">
                    2 Devices
                  </span>
                </div>
                <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  • iPhone 15 Pro · Mumbai, IN (Current Session)
                </p>
                <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  • MacBook Pro Chrome · Bengaluru, IN (Signed in 2d ago)
                </p>

                {sessionTerminationStatus && (
                  <div className="mb-3 p-2.5 rounded-lg text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{sessionTerminationStatus}</span>
                  </div>
                )}

                <button
                  onClick={() => setSessionTerminationStatus('All remote sessions terminated. Only this device remains signed in.')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-semibold bg-indigo-600/20 text-indigo-500 dark:text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors min-h-[44px]"
                >
                  Terminate Other Sessions
                </button>
              </div>

              {/* Option 3: Account Deletion */}
              <div className={`p-4 rounded-xl border ${
                theme === 'dark' ? 'border-rose-500/20 bg-rose-950/10' : 'border-rose-200 bg-rose-50'
              }`}>
                <div className="flex items-center gap-2 mb-2 text-rose-500 dark:text-rose-400">
                  <Trash2 className="w-4 h-4" />
                  <span className="font-bold text-sm">Account Erasure Request</span>
                </div>
                <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Permanently erase your IndiChat credentials and associated profile content across all active databases.
                </p>

                {deletionStatus && (
                  <div className="mb-3 p-2.5 rounded-lg text-xs bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{deletionStatus}</span>
                  </div>
                )}

                <button
                  onClick={() =>
                    setDeletionStatus('14-day security grace period initiated. You may cancel deletion any time before then by signing in.')
                  }
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-semibold bg-rose-600/20 text-rose-500 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-600/30 transition-colors min-h-[44px]"
                >
                  Initiate Deletion Flow
                </button>
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t flex justify-end ${
              theme === 'dark' ? 'border-white/10' : 'border-slate-200'
            }`}>
              <button
                onClick={() => setActiveModal(null)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors min-h-[44px] ${
                  theme === 'dark' ? 'text-white bg-slate-800 hover:bg-slate-700' : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
