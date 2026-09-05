import React, { useState } from 'react';
import {
  UserPlus,
  Sliders,
  Sparkles,
  Shield,
  RefreshCw,
  ChevronDown,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import { ThemeMode } from '../types';
import { TIMELINE_STEPS } from '../data/portalData';

interface TransparencyTimelineProps {
  theme: ThemeMode;
}

export const TransparencyTimeline: React.FC<TransparencyTimelineProps> = ({ theme }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserPlus':
        return UserPlus;
      case 'Sliders':
        return Sliders;
      case 'Sparkles':
        return Sparkles;
      case 'Shield':
        return Shield;
      case 'RefreshCw':
        return RefreshCw;
      default:
        return Sparkles;
    }
  };

  const toggleStep = (stepNumber: number) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber);
  };

  return (
    <section id="transparency" className="py-20 sm:py-24 relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-emerald-500/15 dark:bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-indigo-500/15 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            <span className={theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}>Clear. Simple. </span>
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent">
              Transparent.
            </span>
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            How your information is protected at every step of using IndiChat.
          </p>
        </div>

        {/* Animated Interactive Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical connecting line */}
          <div className="absolute left-6 sm:left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-emerald-500 opacity-40 -z-0" />

          <div className="space-y-4 sm:space-y-6 relative z-10">
            {TIMELINE_STEPS.map((item) => {
              const Icon = getStepIcon(item.iconName);
              const isExpanded = expandedStep === item.step;

              return (
                <div
                  key={item.step}
                  id={`timeline-step-${item.step}`}
                  className={`rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isExpanded
                      ? theme === 'dark'
                        ? 'bg-[#0d1222]/95 border-indigo-500/50 shadow-xl shadow-indigo-950/40'
                        : 'bg-white border-indigo-300 shadow-xl shadow-indigo-100/50'
                      : theme === 'dark'
                      ? 'bg-[#0a0e19]/80 border-white/10 hover:border-white/20'
                      : 'bg-white/80 border-slate-200 hover:border-indigo-200 shadow-sm'
                  }`}
                >
                  {/* Clickable Step Header */}
                  <button
                    onClick={() => toggleStep(item.step)}
                    className="w-full p-4 sm:p-6 text-left flex items-start gap-3 sm:gap-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl active:scale-[0.99] transition-transform min-h-[48px]"
                    aria-expanded={isExpanded}
                  >
                    {/* Step Number Circle with Icon */}
                    <div
                      className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl shrink-0 flex items-center justify-center p-0.5 bg-gradient-to-tr ${
                        isExpanded
                          ? 'from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/30'
                          : theme === 'dark'
                          ? 'from-slate-700 to-slate-800'
                          : 'from-slate-200 to-slate-300'
                      }`}
                    >
                      <div
                        className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                          theme === 'dark' ? 'bg-[#080b14]' : 'bg-white'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            isExpanded ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Content Header Text */}
                    <div className="flex-1 min-w-0 pr-1 sm:pr-2">
                      <h3 className={`font-display text-base sm:text-xl font-bold ${
                        theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        {item.title}
                      </h3>
                      <p
                        className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {item.shortDesc}
                      </p>
                    </div>

                    {/* Expand/Collapse Chevron Indicator */}
                    <div
                      className={`p-1.5 sm:p-2 rounded-xl shrink-0 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 text-indigo-500 dark:text-indigo-400 bg-indigo-500/10' : 'text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>

                  {/* Expanded Detailed Information Drawer */}
                  {isExpanded && (
                    <div
                      className={`px-4 sm:px-6 pb-5 sm:pb-6 pt-2 border-t text-sm leading-relaxed animate-fadeIn ${
                        theme === 'dark'
                          ? 'border-white/10 text-slate-300 bg-black/20'
                          : 'border-slate-100 text-slate-700 bg-indigo-50/30'
                      }`}
                    >
                      <div className={`p-4 rounded-xl sm:rounded-2xl border ${
                        theme === 'dark'
                          ? 'border-indigo-500/20 bg-indigo-500/10 text-slate-300'
                          : 'border-indigo-200 bg-white shadow-sm text-slate-700'
                      }`}>
                        <p className="text-xs sm:text-sm leading-relaxed">
                          {item.detailedInfo}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
