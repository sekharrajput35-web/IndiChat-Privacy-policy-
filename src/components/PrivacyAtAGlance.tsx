import React, { useState } from 'react';
import { Shield, Sliders, Lock, FileText, ArrowUpRight, Sparkles } from 'lucide-react';
import { ThemeMode } from '../types';

interface PrivacyAtAGlanceProps {
  theme: ThemeMode;
}

export const PrivacyAtAGlance: React.FC<PrivacyAtAGlanceProps> = ({ theme }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = [
    {
      id: 1,
      title: 'Privacy First',
      description:
        'IndiChat is designed with a privacy-focused approach and aims to minimize unnecessary collection of personal information.',
      icon: Shield,
      gradient: 'from-purple-500 via-indigo-500 to-pink-500',
      borderGlow: 'hover:border-purple-500/60 hover:shadow-purple-500/25',
      badge: 'Architecture',
      badgeColorDark: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
      badgeColorLight: 'bg-purple-50 border-purple-200 text-purple-700',
      iconColor: 'text-purple-500 dark:text-purple-400',
      targetSection: 'privacy-policy',
      detailLabel: 'Read Privacy Architecture',
    },
    {
      id: 2,
      title: 'Your Control',
      description:
        'Users can control supported privacy settings and choose how their content is shared and accessed.',
      icon: Sliders,
      gradient: 'from-pink-500 via-rose-500 to-purple-500',
      borderGlow: 'hover:border-pink-500/60 hover:shadow-pink-500/25',
      badge: 'User Autonomy',
      badgeColorDark: 'bg-pink-500/10 border-pink-500/30 text-pink-300',
      badgeColorLight: 'bg-pink-50 border-pink-200 text-pink-700',
      iconColor: 'text-pink-500 dark:text-pink-400',
      targetSection: 'privacy-controls',
      detailLabel: 'Try Privacy Controls',
    },
    {
      id: 3,
      title: 'Secure Account Access',
      description:
        'Account information is protected using modern security and authentication practices.',
      icon: Lock,
      gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
      borderGlow: 'hover:border-cyan-500/60 hover:shadow-cyan-500/25',
      badge: 'Protection',
      badgeColorDark: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
      badgeColorLight: 'bg-cyan-50 border-cyan-200 text-cyan-700',
      iconColor: 'text-cyan-500 dark:text-cyan-400',
      targetSection: 'security',
      detailLabel: 'Inspect Security Flow',
    },
    {
      id: 4,
      title: 'Transparency',
      description:
        'We explain our privacy practices in clear language so users can better understand how their information is handled.',
      icon: FileText,
      gradient: 'from-emerald-500 via-teal-500 to-indigo-500',
      borderGlow: 'hover:border-emerald-500/60 hover:shadow-emerald-500/25',
      badge: 'Open Practices',
      badgeColorDark: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      badgeColorLight: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      targetSection: 'transparency',
      detailLabel: 'View Transparency Timeline',
    },
  ];

  const handleLearnMore = (targetSection: string) => {
    const el = document.getElementById(targetSection);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="privacy-overview" className="py-20 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-500/15 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-80 h-80 bg-pink-500/15 dark:bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            <span className={theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}>Privacy At A </span>
            <span className="bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Glance
            </span>
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            Simple principles designed to protect you across every feature.
          </p>
        </div>

        {/* Four Animated Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                id={`glance-card-${card.id}`}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleLearnMore(card.targetSection)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleLearnMore(card.targetSection);
                  }
                }}
                className={`group relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between border active:scale-[0.99] ${
                  theme === 'dark'
                    ? 'bg-[#0d121f]/90 backdrop-blur-xl border-white/10 hover:bg-[#121829] shadow-xl shadow-black/30'
                    : 'bg-white/95 backdrop-blur-xl border-slate-200/90 shadow-xl shadow-indigo-100/40 hover:border-indigo-300 hover:bg-white'
                } ${card.borderGlow} hover:-translate-y-1.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
              >
                {/* Subtle top gradient accent line */}
                <div
                  className={`absolute top-0 left-6 right-6 h-[3px] rounded-full bg-gradient-to-r ${card.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="space-y-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center p-0.5 bg-gradient-to-tr ${card.gradient} shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0`}
                  >
                    <div
                      className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                        theme === 'dark' ? 'bg-[#0b0f19]' : 'bg-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${card.iconColor}`} />
                    </div>
                  </div>

                  {/* Card Title */}
                  <h3 className={`font-display text-lg sm:text-xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {card.description}
                  </p>
                </div>

                {/* Learn More Interactive Link */}
                <div className={`pt-4 mt-4 border-t flex items-center justify-between ${
                  theme === 'dark' ? 'border-white/10' : 'border-slate-100'
                }`}>
                  <span className={`text-xs font-semibold ${card.iconColor} group-hover:underline transition-all flex items-center gap-1.5`}>
                    <span>Learn More</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
