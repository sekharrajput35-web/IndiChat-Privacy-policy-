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
      title: 'User Request',
      label: 'User',
      icon: User,
      desc: 'Originating device initiates action via TLS 1.3 protocol',
      status: 'Verified Device',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'flow-auth',
      title: 'Authentication',
      label: 'Authentication',
      icon: Key,
      desc: 'Time-bounded cryptographic token & biometric verification',
      status: 'Salted Credential Check',
      color: 'from-indigo-600 to-purple-600',
    },
    {
      id: 'flow-protected',
      title: 'Protected Systems',
      label: 'Protected Systems',
      icon: Database,
      desc: 'Encrypted microservices shielded by adaptive rate-limits',
      status: 'Least-Privilege Isolation',
      color: 'from-purple-600 to-pink-600',
    },
    {
      id: 'flow-access',
      title: 'Secure Access',
      label: 'Secure Access',
      icon: CheckCircle,
      desc: 'Authenticated response delivered seamlessly to user',
      status: 'Granted Session Active',
      color: 'from-pink-500 to-emerald-500',
    },
  ];

  return (
    <section id="security" className="py-24 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-indigo-600/15 via-purple-600/15 to-pink-600/15 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/25 text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enterprise-Grade Architecture</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
            <span className={theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}>Security Built Into </span>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Every Connection
            </span>
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            IndiChat uses appropriate technical and organizational measures designed to protect user information
            across social feeds, messaging, reels, and transactions.
          </p>
        </div>

        {/* Futuristic Animated Security Flow Diagram */}
        <div
          className={`mb-20 p-4 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border shadow-2xl relative overflow-hidden ${
            theme === 'dark'
              ? 'bg-[#090d18]/80 backdrop-blur-2xl border-white/10'
              : 'bg-white/90 backdrop-blur-2xl border-slate-200/90 shadow-slate-200/50'
          }`}
        >
          {/* Header of Flow Diagram */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b gap-4 mb-8 ${
            theme === 'dark' ? 'border-white/10' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)] animate-pulse flex-shrink-0" />
              <div>
                <h3 className={`font-display text-base sm:text-lg font-bold ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  Live Security Verification Architecture
                </h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Click any stage to simulate packet inspection & telemetry
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono-code ${
              theme === 'dark'
                ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-300'
                : 'bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold'
            }`}>
              Protocol: TLS 1.3 Strict · Zero Plaintext
            </div>
          </div>

          {/* Connected Flow Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Horizontal flow line for desktop */}
            <div className="hidden md:block absolute top-12 left-16 right-16 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 -z-0 opacity-40" />

            {flowNodes.map((node, index) => {
              const NodeIcon = node.icon;
              const isSelected = activeFlowNode === index;

              return (
                <div
                  key={node.id}
                  id={node.id}
                  onClick={() => setActiveFlowNode(index)}
                  className={`relative z-10 p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col items-center text-center active:scale-[0.98] ${
                    isSelected
                      ? 'bg-gradient-to-b from-indigo-900/40 to-purple-900/40 border-indigo-400 shadow-xl shadow-indigo-500/20 scale-105'
                      : theme === 'dark'
                      ? 'bg-[#0f1422]/90 border-white/10 hover:border-white/25'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-300 shadow-sm'
                  }`}
                >
                  {/* Step pill */}
                  <div className={`absolute -top-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase border ${
                    theme === 'dark' ? 'bg-[#07090e] border-white/20 text-indigo-300' : 'bg-white border-slate-300 text-indigo-700'
                  }`}>
                    Step 0{index + 1}
                  </div>

                  {/* Icon Node */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center p-0.5 bg-gradient-to-tr ${node.color} shadow-lg mb-4`}
                  >
                    <div
                      className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                        theme === 'dark' ? 'bg-[#070a12]' : 'bg-white'
                      }`}
                    >
                      <NodeIcon className="w-6 h-6 text-indigo-400" />
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

                  <div className={`mt-auto px-2 py-1 rounded-md border text-[10px] font-mono-code ${
                    theme === 'dark' ? 'bg-white/5 border-white/10 text-indigo-300' : 'bg-slate-100 border-slate-200 text-indigo-700 font-semibold'
                  }`}>
                    {node.status}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Node Detail Drawer inside Diagram */}
          <div className={`mt-8 pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl ${
            theme === 'dark' ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className={`text-xs font-mono-code ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
                ACTIVE FOCUS: <span className="text-pink-500 dark:text-pink-400 font-bold">{flowNodes[activeFlowNode].title}</span>
              </span>
              <span className={`text-xs hidden sm:inline ${theme === 'dark' ? 'text-slate-400' : 'text-slate-300'}`}>|</span>
              <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {flowNodes[activeFlowNode].desc}
              </span>
            </div>
            <div className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 flex items-center gap-1 flex-shrink-0">
              <span>Automatic Verification Active</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* 6 Interactive Security Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECURITY_CARDS.map((card) => {
            const Icon = getIcon(card.iconName);
            const cardTheme = CARD_THEMES[card.id] || {
              gradient: 'from-indigo-500 via-purple-500 to-pink-500',
              iconColor: 'text-indigo-500 dark:text-indigo-400',
              badgeDark: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
              badgeLight: 'bg-indigo-50 border-indigo-200 text-indigo-700',
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
                } ${cardTheme.borderGlow} hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
              >
                {/* Top accent line */}
                <div
                  className={`absolute top-0 left-6 right-6 h-[2.5px] rounded-full bg-gradient-to-r ${cardTheme.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center p-0.5 bg-gradient-to-br ${cardTheme.gradient} shadow-md group-hover:scale-110 transition-transform`}>
                      <div
                        className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                          theme === 'dark' ? 'bg-[#090d16]' : 'bg-white'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${cardTheme.iconColor} transition-transform group-hover:scale-110`} />
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono-code font-semibold px-2.5 py-0.5 rounded-full border shadow-sm ${
                      theme === 'dark' ? cardTheme.badgeDark : cardTheme.badgeLight
                    }`}>
                      Tap for Details
                    </span>
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
                    <span>View Specifications</span>
                    <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
