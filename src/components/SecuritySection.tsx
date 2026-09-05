import React, { useState } from 'react';
import {
  ShieldCheck,
  LockKeyhole,
  Smartphone,
  ShieldAlert,
  Activity,
  KeyRound,
  User,
  Key,
  Database,
  CheckCircle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { SecurityCardItem, ThemeMode } from '../types';
import { SECURITY_CARDS } from '../data/portalData';

interface SecuritySectionProps {
  theme: ThemeMode;
  onOpenSecurityModal: (item: SecurityCardItem) => void;
}

const CARD_THEMES: Record<string, { gradient: string; iconColor: string; badgeDark: string; badgeLight: string; borderGlow: string }> = {
  'sec-auth': {
    gradient: 'from-blue-500 via-indigo-500 to-cyan-400',
    iconColor: 'text-blue-500 dark:text-blue-400',
    badgeDark: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    badgeLight: 'bg-blue-50 border-blue-200 text-blue-700',
    borderGlow: 'hover:border-blue-500/60 hover:shadow-blue-500/25',
  },
  'sec-crypto': {
    gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
    iconColor: 'text-purple-500 dark:text-purple-400',
    badgeDark: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    badgeLight: 'bg-purple-50 border-purple-200 text-purple-700',
    borderGlow: 'hover:border-purple-500/60 hover:shadow-purple-500/25',
  },
  'sec-account': {
    gradient: 'from-teal-500 via-emerald-500 to-cyan-500',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    badgeDark: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    badgeLight: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    borderGlow: 'hover:border-emerald-500/60 hover:shadow-emerald-500/25',
  },
  'sec-unauth': {
    gradient: 'from-rose-500 via-pink-500 to-amber-500',
    iconColor: 'text-rose-500 dark:text-rose-400',
    badgeDark: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
    badgeLight: 'bg-rose-50 border-rose-200 text-rose-700',
    borderGlow: 'hover:border-rose-500/60 hover:shadow-rose-500/25',
  },
  'sec-monitoring': {
    gradient: 'from-sky-500 via-blue-500 to-indigo-500',
    iconColor: 'text-sky-500 dark:text-sky-400',
    badgeDark: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
    badgeLight: 'bg-sky-50 border-sky-200 text-sky-700',
    borderGlow: 'hover:border-sky-500/60 hover:shadow-sky-500/25',
  },
  'sec-access': {
    gradient: 'from-amber-500 via-orange-500 to-purple-600',
    iconColor: 'text-amber-500 dark:text-amber-400',
    badgeDark: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    badgeLight: 'bg-amber-50 border-amber-200 text-amber-700',
    borderGlow: 'hover:border-amber-500/60 hover:shadow-amber-500/25',
  },
};

export const SecuritySection: React.FC<SecuritySectionProps> = ({ theme, onOpenSecurityModal }) => {
  const [activeFlowNode, setActiveFlowNode] = useState<number>(0);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return ShieldCheck;
      case 'LockKeyhole':
        return LockKeyhole;
      case 'Smartphone':
      case 'SmartphoneCheck':
        return Smartphone;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'Activity':
        return Activity;
      case 'KeyRound':
        return KeyRound;
      default:
        return ShieldCheck;
    }
  };

  const flowNodes = [
    {
      id: 'flow-user',
      title: 'Your Device',
      label: 'Your Device',
      icon: User,
      desc: 'Actions are encrypted directly on your phone or computer.',
      status: 'Encrypted',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'flow-auth',
      title: 'Authentication',
      label: 'Authentication',
      icon: Key,
      desc: 'Time-limited tokens confirm your identity securely.',
      status: 'Verified',
      color: 'from-indigo-600 to-purple-600',
    },
    {
      id: 'flow-protected',
      title: 'Protected Systems',
      label: 'Protected Systems',
      icon: Database,
      desc: 'All stored data is kept in isolated, encrypted clusters.',
      status: 'Protected',
      color: 'from-purple-600 to-pink-600',
    },
    {
      id: 'flow-access',
      title: 'Safe Delivery',
      label: 'Safe Delivery',
      icon: CheckCircle,
      desc: 'Responses are securely transmitted back to you.',
      status: 'Delivered',
      color: 'from-pink-500 to-emerald-500',
    },
  ];

  return (
    <section id="security" className="py-20 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            <span className={theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}>Security in Every </span>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Connection
            </span>
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            Robust technical safeguards designed to keep your personal messages, media, and account data safe.
          </p>
        </div>

        {/* Security Flow Diagram */}
        <div
          className={`mb-16 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border shadow-xl relative overflow-hidden ${
            theme === 'dark'
              ? 'bg-[#090d18]/80 backdrop-blur-2xl border-white/10'
              : 'bg-white/90 backdrop-blur-2xl border-slate-200/90 shadow-slate-200/50'
          }`}
        >
          {/* Header of Flow Diagram */}
          <div className="text-center max-w-lg mx-auto mb-8">
            <h3 className={`font-display text-lg sm:text-xl font-bold mb-1 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
            }`}>
              How Your Data Stays Protected
            </h3>
            <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              From your device to our secure systems, every step is encrypted.
            </p>
          </div>

          {/* Connected Flow Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 relative">
            {/* Horizontal flow line for desktop */}
            <div className="hidden md:block absolute top-12 left-16 right-16 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 -z-0 opacity-30" />

            {flowNodes.map((node, index) => {
              const NodeIcon = node.icon;
              const isSelected = activeFlowNode === index;

              return (
                <div
                  key={node.id}
                  id={node.id}
                  onClick={() => setActiveFlowNode(index)}
                  className={`relative z-10 p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col items-center text-center ${
                    isSelected
                      ? 'bg-gradient-to-b from-indigo-900/30 to-purple-900/30 border-indigo-400 shadow-lg scale-[1.02]'
                      : theme === 'dark'
                      ? 'bg-[#0f1422]/90 border-white/10 hover:border-white/25'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-300 shadow-sm'
                  }`}
                >
                  {/* Icon Node */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center p-0.5 bg-gradient-to-tr ${node.color} shadow-md mb-3`}
                  >
                    <div
                      className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                        theme === 'dark' ? 'bg-[#070a12]' : 'bg-white'
                      }`}
                    >
                      <NodeIcon className="w-5 h-5 text-indigo-400" />
                    </div>
                  </div>

                  <h4 className={`font-display font-bold text-base mb-1 ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {node.label}
                  </h4>
                  <p className={`text-xs mb-3 leading-relaxed ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {node.desc}
                  </p>

                  <div className={`mt-auto px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${
                    theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  }`}>
                    {node.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6 Interactive Security Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECURITY_CARDS.map((card) => {
            const Icon = getIcon(card.iconName);
            const cardTheme = CARD_THEMES[card.id] || {
              gradient: 'from-indigo-500 via-purple-500 to-pink-500',
              iconColor: 'text-indigo-500 dark:text-indigo-400',
              borderGlow: 'hover:border-indigo-500/60 hover:shadow-indigo-500/25',
            };

            return (
              <div
                key={card.id}
                id={`sec-card-${card.id}`}
                onClick={() => onOpenSecurityModal(card)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onOpenSecurityModal(card);
                  }
                }}
                className={`group relative rounded-2xl p-5 sm:p-7 border cursor-pointer transition-all duration-300 flex flex-col justify-between active:scale-[0.99] ${
                  theme === 'dark'
                    ? 'bg-[#0d111d]/90 backdrop-blur-xl border-white/10 hover:bg-[#121827]'
                    : 'bg-white/95 backdrop-blur-xl border-slate-200 shadow-md shadow-slate-200/50 hover:bg-white hover:shadow-xl'
                } ${cardTheme.borderGlow} hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
              >
                {/* Top accent line */}
                <div
                  className={`absolute top-0 left-6 right-6 h-[2.5px] rounded-full bg-gradient-to-r ${cardTheme.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center p-0.5 bg-gradient-to-br ${cardTheme.gradient} shadow-md group-hover:scale-105 transition-transform`}>
                      <div
                        className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                          theme === 'dark' ? 'bg-[#090d16]' : 'bg-white'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${cardTheme.iconColor}`} />
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`font-display text-xl font-bold group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors mb-2 ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {card.title}
                  </h3>

                  {/* Short Description */}
                  <p
                    className={`text-sm leading-relaxed mb-4 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {card.shortDesc}
                  </p>
                </div>

                {/* Bottom Action Affordance */}
                <div className={`pt-4 border-t flex items-center justify-between ${
                  theme === 'dark' ? 'border-white/10' : 'border-slate-100'
                }`}>
                  <span className={`text-xs font-semibold ${cardTheme.iconColor} group-hover:underline transition-all flex items-center gap-1`}>
                    <span>Learn more</span>
                    <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
