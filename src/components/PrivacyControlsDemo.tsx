import React, { useState } from 'react';
import {
  Globe,
  Lock,
  Settings,
  Shield,
  Eye,
  MessageSquare,
  Share2,
  Heart,
  Sliders,
  Sparkles,
  Check,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import { CustomPrivacySettings, PrivacyModeType, ThemeMode } from '../types';

interface PrivacyControlsDemoProps {
  theme: ThemeMode;
}

export const PrivacyControlsDemo: React.FC<PrivacyControlsDemoProps> = ({ theme }) => {
  const [selectedMode, setSelectedMode] = useState<PrivacyModeType>('private');

  // Custom privacy settings state
  const [customSettings, setCustomSettings] = useState<CustomPrivacySettings>({
    whoCanView: 'circle',
    whoCanInteract: 'reactions_only',
    whoCanMessage: 'verified_contacts',
    whoCanShare: 'disable_forwarding',
  });

  return (
    <section id="privacy-controls" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            <span className={theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}>You Decide Who Sees </span>
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              Your Content
            </span>
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            Simple privacy controls for your posts, reels, and profile. You choose your audience every time.
          </p>
        </div>

        {/* 3 Option Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 max-w-4xl mx-auto">
          {/* Option 1: PUBLIC */}
          <button
            id="privacy-option-public"
            onClick={() => setSelectedMode('public')}
            className={`relative p-5 sm:p-6 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.99] ${
              selectedMode === 'public'
                ? theme === 'dark'
                  ? 'bg-gradient-to-b from-indigo-950/60 to-blue-950/60 border-indigo-400 shadow-xl shadow-indigo-500/20 scale-[1.02]'
                  : 'bg-gradient-to-b from-indigo-50 to-blue-50/80 border-indigo-400 shadow-xl shadow-indigo-100 scale-[1.02]'
                : theme === 'dark'
                ? 'bg-[#0c101c]/80 border-white/10 hover:border-indigo-500/30'
                : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-500/10 border border-indigo-500/30 text-indigo-500 dark:text-indigo-400">
                  <Globe className="w-6 h-6" />
                </div>
                {selectedMode === 'public' && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                    <Check className="w-3 h-3" /> Selected
                  </span>
                )}
              </div>
              <h3 className={`font-display text-xl font-bold mb-1.5 ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Public
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Visible to anyone on IndiChat. Recommended for public creators and open discussions.
              </p>
            </div>
          </button>

          {/* Option 2: PRIVATE */}
          <button
            id="privacy-option-private"
            onClick={() => setSelectedMode('private')}
            className={`relative p-5 sm:p-6 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 active:scale-[0.99] ${
              selectedMode === 'private'
                ? theme === 'dark'
                  ? 'bg-gradient-to-b from-pink-950/60 to-purple-950/60 border-pink-400 shadow-xl shadow-pink-500/20 scale-[1.02]'
                  : 'bg-gradient-to-b from-pink-50 to-rose-50/80 border-pink-400 shadow-xl shadow-pink-100 scale-[1.02]'
                : theme === 'dark'
                ? 'bg-[#0c101c]/80 border-white/10 hover:border-pink-500/30'
                : 'bg-white border-slate-200 hover:border-pink-300 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-pink-500/10 border border-pink-500/30 text-pink-500 dark:text-pink-400">
                  <Lock className="w-6 h-6" />
                </div>
                {selectedMode === 'private' && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-pink-600 dark:text-pink-300 bg-pink-500/20 px-2.5 py-0.5 rounded-full border border-pink-500/30">
                    <Check className="w-3 h-3" /> Selected
                  </span>
                )}
              </div>
              <h3 className={`font-display text-xl font-bold mb-1.5 ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Private
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Only visible to you and people you approve. Hidden from search and public feeds.
              </p>
            </div>
          </button>

          {/* Option 3: CUSTOM */}
          <button
            id="privacy-option-custom"
            onClick={() => setSelectedMode('custom')}
            className={`relative p-5 sm:p-6 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 active:scale-[0.99] ${
              selectedMode === 'custom'
                ? theme === 'dark'
                  ? 'bg-gradient-to-b from-purple-950/60 to-indigo-950/60 border-purple-400 shadow-xl shadow-purple-500/20 scale-[1.02]'
                  : 'bg-gradient-to-b from-purple-50 to-indigo-50/80 border-purple-400 shadow-xl shadow-purple-100 scale-[1.02]'
                : theme === 'dark'
                ? 'bg-[#0c101c]/80 border-white/10 hover:border-purple-500/30'
                : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-500/10 border border-purple-500/30 text-purple-500 dark:text-purple-400">
                  <Settings className="w-6 h-6" />
                </div>
                {selectedMode === 'custom' && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                    <Check className="w-3 h-3" /> Selected
                  </span>
                )}
              </div>
              <h3 className={`font-display text-xl font-bold mb-1.5 ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Custom
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Fine-tune who can view, comment, share, or direct-message your content.
              </p>
            </div>
          </button>
        </div>

        {/* Dynamic Interactive Demo Container */}
        <div
          className={`max-w-4xl mx-auto rounded-2xl sm:rounded-3xl border shadow-2xl p-4 sm:p-8 lg:p-10 transition-all duration-300 relative overflow-hidden ${
            theme === 'dark'
              ? 'bg-[#090d18]/90 backdrop-blur-xl border-white/10'
              : 'bg-white/95 backdrop-blur-xl border-slate-200 shadow-xl shadow-slate-200/50'
          }`}
        >
          {/* Top Demo Bar */}
          <div className={`flex items-center justify-between pb-5 border-b mb-6 ${
            theme === 'dark' ? 'border-white/10' : 'border-slate-200'
          }`}>
            <span className={`text-xs font-semibold ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Live Preview
            </span>
            <span className="text-xs font-semibold text-indigo-500 capitalize">
              Mode: {selectedMode}
            </span>
          </div>

          {/* DEMO 1: PUBLIC VIEW */}
          {selectedMode === 'public' && (
            <div className="space-y-6 animate-fadeIn">
              <div className={`p-4 sm:p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                theme === 'dark' ? 'bg-indigo-950/30 border-indigo-500/30' : 'bg-indigo-50/70 border-indigo-200'
              }`}>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold font-display flex-shrink-0">
                    IC
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className={`font-bold text-sm sm:text-base ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                        IndiChat Explorer
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30">
                        Public Feed Post
                      </span>
                    </div>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      Shared publicly to global discover feed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono-code text-indigo-400 flex-shrink-0">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span>Visible to all registered users</span>
                </div>
              </div>

              {/* Simulated Public Post Card */}
              <div
                className={`p-4 sm:p-6 rounded-2xl border ${
                  theme === 'dark' ? 'bg-[#0d121f] border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div className={`flex items-center gap-2 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span>Global Content Distribution Enabled</span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-mono-code text-indigo-400 font-semibold">Follows Platform Public Rules</span>
                </div>
                <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                  “Launching my new creative showcase and marketplace store on IndiChat! Discover handcrafted items,
                  watch live demos, and connect directly in one super app.”
                </p>

                {/* Social Metrics Bar */}
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t text-xs ${
                  theme === 'dark' ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}>
                  <div className="flex items-center flex-wrap gap-3 sm:gap-4">
                    <span className="flex items-center gap-1 text-pink-500 dark:text-pink-400 font-medium">
                      <Heart className="w-4 h-4" /> 1.2k Likes
                    </span>
                    <span className="flex items-center gap-1 text-indigo-500 dark:text-indigo-400 font-medium">
                      <MessageSquare className="w-4 h-4" /> 84 Comments
                    </span>
                    <span className="flex items-center gap-1 text-purple-500 dark:text-purple-400 font-medium">
                      <Share2 className="w-4 h-4" /> 142 Reshares
                    </span>
                  </div>
                  <span className="font-mono-code text-[11px] text-emerald-500 dark:text-emerald-400 font-semibold">
                    Indexed for Search
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* DEMO 2: PRIVATE VIEW */}
          {selectedMode === 'private' && (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-6 animate-fadeIn">
              {/* Glowing animated cyber lock container */}
              <div className="relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 p-1 shadow-[0_0_50px_rgba(244,114,182,0.4)] animate-pulse">
                <div
                  className={`w-full h-full rounded-[22px] flex items-center justify-center ${
                    theme === 'dark' ? 'bg-[#080b14]' : 'bg-white'
                  }`}
                >
                  <Lock className="w-12 h-12 sm:w-14 sm:h-14 text-pink-400 animate-bounce [animation-duration:2.5s]" />
                </div>
              </div>

              {/* Required Exact Display Headings */}
              <div className="space-y-2">
                <h3 className={`font-display text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  Private Content
                </h3>
                <p className="font-mono-code text-sm sm:text-base font-semibold text-pink-500 dark:text-pink-400 tracking-wider uppercase">
                  Access Restricted
                </p>
              </div>

              {/* Exact compliant explanation banner */}
              <div className={`max-w-xl p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                theme === 'dark'
                  ? 'bg-pink-950/20 border-pink-500/30 text-slate-300'
                  : 'bg-pink-50 border-pink-200 text-slate-700'
              }`}>
                When a user selects Private mode for supported content or features, that content is not publicly visible
                and access is restricted according to the user's selected privacy settings and authorized service
                operations.
              </div>

              <div className={`flex items-center justify-center gap-2 text-[11px] sm:text-xs font-mono-code text-center px-2 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <Shield className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span>Zero Public Indexing · Hidden from Search & Feeds</span>
              </div>
            </div>
          )}

          {/* DEMO 3: CUSTOM VIEW */}
          {selectedMode === 'custom' && (
            <div className="space-y-6 animate-fadeIn">
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                theme === 'dark' ? 'bg-purple-950/20 border-purple-500/30' : 'bg-purple-50 border-purple-200'
              }`}>
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className={`font-display font-bold text-sm ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    Granular Audience Configuration
                  </span>
                </div>
                <span className={`text-[11px] font-mono-code font-semibold ${
                  theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                }`}>
                  Custom Rules Active
                </span>
              </div>

              {/* Interactive Settings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* 1. Who can view? */}
                <div
                  className={`p-4 rounded-xl border ${
                    theme === 'dark' ? 'bg-[#0e1322] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <label className="block text-xs font-mono-code font-bold uppercase text-indigo-300 mb-2 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Who can view?
                  </label>
                  <select
                    id="select-who-can-view"
                    value={customSettings.whoCanView}
                    onChange={(e) =>
                      setCustomSettings({
                        ...customSettings,
                        whoCanView: e.target.value as CustomPrivacySettings['whoCanView'],
                      })
                    }
                    className={`w-full p-2.5 rounded-lg text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      theme === 'dark'
                        ? 'bg-[#151c30] border-white/10 text-white'
                        : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  >
                    <option value="everyone">Everyone</option>
                    <option value="followers">Mutual Followers Only</option>
                    <option value="circle">Selected Private Circle</option>
                    <option value="only_me">Only Me (Vault)</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Filters visibility across reels, posts, and live feeds.
                  </p>
                </div>

                {/* 2. Who can interact? */}
                <div
                  className={`p-4 rounded-xl border ${
                    theme === 'dark' ? 'bg-[#0e1322] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <label className="block text-xs font-mono-code font-bold uppercase text-purple-300 mb-2 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" /> Who can interact?
                  </label>
                  <select
                    id="select-who-can-interact"
                    value={customSettings.whoCanInteract}
                    onChange={(e) =>
                      setCustomSettings({
                        ...customSettings,
                        whoCanInteract: e.target.value as CustomPrivacySettings['whoCanInteract'],
                      })
                    }
                    className={`w-full p-2.5 rounded-lg text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      theme === 'dark'
                        ? 'bg-[#151c30] border-white/10 text-white'
                        : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  >
                    <option value="allow_all">Allow All Comments & Reactions</option>
                    <option value="reactions_only">Reactions Only (No Comments)</option>
                    <option value="disabled">Disabled Completely</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Controls comment threads and community engagement.
                  </p>
                </div>

                {/* 3. Who can message? */}
                <div
                  className={`p-4 rounded-xl border ${
                    theme === 'dark' ? 'bg-[#0e1322] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <label className="block text-xs font-mono-code font-bold uppercase text-pink-300 mb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Who can message?
                  </label>
                  <select
                    id="select-who-can-message"
                    value={customSettings.whoCanMessage}
                    onChange={(e) =>
                      setCustomSettings({
                        ...customSettings,
                        whoCanMessage: e.target.value as CustomPrivacySettings['whoCanMessage'],
                      })
                    }
                    className={`w-full p-2.5 rounded-lg text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      theme === 'dark'
                        ? 'bg-[#151c30] border-white/10 text-white'
                        : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  >
                    <option value="anyone">Anyone with an Account</option>
                    <option value="verified_contacts">Verified Phone Contacts Only</option>
                    <option value="none">No Direct Messages</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Prevents spam requests and unsolicited chats.
                  </p>
                </div>

                {/* 4. Who can share? */}
                <div
                  className={`p-4 rounded-xl border ${
                    theme === 'dark' ? 'bg-[#0e1322] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <label className="block text-xs font-mono-code font-bold uppercase text-emerald-300 mb-2 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" /> Who can share?
                  </label>
                  <select
                    id="select-who-can-share"
                    value={customSettings.whoCanShare}
                    onChange={(e) =>
                      setCustomSettings({
                        ...customSettings,
                        whoCanShare: e.target.value as CustomPrivacySettings['whoCanShare'],
                      })
                    }
                    className={`w-full p-2.5 rounded-lg text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      theme === 'dark'
                        ? 'bg-[#151c30] border-white/10 text-white'
                        : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  >
                    <option value="allow">Allow Resharing to Feeds</option>
                    <option value="disable_forwarding">Disable Forwarding & Saving</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Restricts downloading or redistributing your media.
                  </p>
                </div>
              </div>

              {/* Status footer for custom demo */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                <span>Visual Demonstration of IndiChat Privacy Preference Engine</span>
                <span className="text-emerald-400 font-mono-code">Preferences Instantly Reactive</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
