import React, { useState } from 'react';
import { Phone, Mail, KeyRound, ShieldAlert, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';
import { ThemeMode } from '../types';

interface InformationWeCollectProps {
  theme: ThemeMode;
}

export const InformationWeCollect: React.FC<InformationWeCollectProps> = ({ theme }) => {
  const [showPasswordHashDemo, setShowPasswordHashDemo] = useState(false);

  const cards = [
    {
      id: 'phone',
      title: 'PHONE NUMBER',
      purpose: 'Used for supported account and authentication purposes.',
      icon: Phone,
      gradient: 'from-purple-500 to-indigo-600',
      borderGlow: 'hover:border-purple-500/50 hover:shadow-purple-500/20',
      badge: 'Account Verification',
      badgeColorDark: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
      badgeColorLight: 'bg-purple-50 border-purple-200 text-purple-700',
      iconColor: 'text-purple-500 dark:text-purple-400',
      features: [
        'SMS one-time authentication codes',
        'Account recovery & phone change confirmation',
        'Optional contact discovery only with user permission',
      ],
      storageNote: 'Encrypted at rest, never sold to external telemarketers',
    },
    {
      id: 'email',
      title: 'EMAIL ADDRESS',
      purpose: 'Used for account communication, verification and recovery where applicable.',
      icon: Mail,
      gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
      borderGlow: 'hover:border-cyan-500/50 hover:shadow-cyan-500/20',
      badge: 'Essential Communications',
      badgeColorDark: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
      badgeColorLight: 'bg-cyan-50 border-cyan-200 text-cyan-700',
      iconColor: 'text-cyan-500 dark:text-cyan-400',
      features: [
        'Critical security alerts & login notices',
        'Multi-factor authentication fallback',
        'Account recovery links and service receipts',
      ],
      storageNote: 'Stored with cryptographic database tokens',
    },
    {
      id: 'password',
      title: 'PASSWORD CREDENTIALS',
      purpose:
        'Passwords must not be stored or displayed as readable plain text. Password credentials should be protected using appropriate cryptographic security practices.',
      icon: KeyRound,
      gradient: 'from-pink-500 to-rose-600',
      borderGlow: 'hover:border-pink-500/50 hover:shadow-pink-500/20',
      badge: 'Cryptographic Hashing',
      badgeColorDark: 'bg-pink-500/10 border-pink-500/30 text-pink-300',
      badgeColorLight: 'bg-pink-50 border-pink-200 text-pink-700',
      iconColor: 'text-pink-500 dark:text-pink-400',
      features: [
        'Salted one-way cryptographic key derivation',
        'Zero readable plain text stored or visible to staff',
        'Protected against automated brute force and timing attacks',
      ],
      storageNote: 'Zero plaintext stored. Irreversible cryptographic hash.',
    },
  ];

  return (
    <section id="information-collected" className="py-20 relative overflow-hidden">
      {/* Colorful background ambient accents */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-purple-500/15 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-cyan-500/15 dark:bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-purple-500/15 via-indigo-500/15 to-pink-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-300 shadow-sm">
            <Lock className="w-3.5 h-3.5" />
            <span>Essential Account Data</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            <span className={theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}>Information We </span>
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
              Collect
            </span>
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            IndiChat focuses strictly on authenticating you securely and maintaining your account safety.
          </p>
        </div>

        {/* Prominent Mandatory Message Banner */}
        <div
          className={`max-w-4xl mx-auto mb-10 sm:mb-12 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border text-center relative overflow-hidden shadow-2xl transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-indigo-950/80 via-purple-950/70 to-pink-950/80 border-indigo-500/50 shadow-indigo-950/50'
              : 'bg-gradient-to-r from-indigo-100/80 via-purple-50 to-pink-100/80 border-indigo-200/90 shadow-indigo-200/50'
          }`}
        >
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mb-1">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <p className={`text-base sm:text-xl font-semibold leading-relaxed sm:leading-snug tracking-tight max-w-2xl px-1 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
            }`}>
              “We aim to collect only the information necessary to provide secure account access and essential platform functionality.”
            </p>
            <span className={`text-[11px] sm:text-xs font-mono-code tracking-wider uppercase px-3 py-1 rounded-full border ${
              theme === 'dark'
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-indigo-100/90 border-indigo-300 text-indigo-800 font-semibold'
            }`}>
              IndiChat Data Minimization Principle
            </span>
          </div>
        </div>

        {/* 3 Premium Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            const isPasswordCard = card.id === 'password';

            return (
              <div
                key={card.id}
                id={`collect-card-${card.id}`}
                className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col justify-between border transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-[#0c101c]/90 backdrop-blur-xl border-white/10 shadow-xl shadow-black/40 hover:bg-[#111728]'
                    : 'bg-white/95 backdrop-blur-xl border-slate-200/90 shadow-xl shadow-indigo-100/50 hover:border-indigo-300 hover:bg-white'
                } ${card.borderGlow} group hover:-translate-y-1`}
              >
                {/* Top gradient accent line */}
                <div
                  className={`absolute top-0 left-6 right-6 h-[3px] rounded-full bg-gradient-to-r ${card.gradient} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div>
                  {/* Top row */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div
                      className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center p-0.5 bg-gradient-to-br ${card.gradient} shadow-md group-hover:scale-105 transition-transform shrink-0`}
                    >
                      <div
                        className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                          theme === 'dark' ? 'bg-[#090d16]' : 'bg-white'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${card.iconColor} transition-transform group-hover:scale-110`} />
                      </div>
                    </div>
                    <span className={`text-[11px] font-mono-code font-semibold px-2.5 py-1 rounded-lg border shadow-sm shrink-0 ${
                      theme === 'dark' ? card.badgeColorDark : card.badgeColorLight
                    }`}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`font-display text-lg font-bold tracking-wider mb-2.5 ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {card.title}
                  </h3>

                  {/* Purpose Paragraph */}
                  <p
                    className={`text-xs sm:text-sm leading-relaxed mb-5 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {card.purpose}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="space-y-2 mb-6">
                    {card.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Password Demo Toggle (Special visual assurance for Password Credentials) */}
                {isPasswordCard && (
                  <div className={`mb-4 p-3 rounded-xl border text-xs ${
                    theme === 'dark' ? 'bg-pink-950/30 border-pink-500/30' : 'bg-pink-50/90 border-pink-200 shadow-sm'
                  }`}>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`font-mono-code text-[11px] font-semibold truncate ${
                        theme === 'dark' ? 'text-pink-300' : 'text-pink-800'
                      }`}>
                        Storage Demonstration:
                      </span>
                      <button
                        onClick={() => setShowPasswordHashDemo(!showPasswordHashDemo)}
                        className="text-[10px] text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 flex items-center gap-1 font-semibold underline focus:outline-none shrink-0"
                      >
                        {showPasswordHashDemo ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {showPasswordHashDemo ? 'Show Masked' : 'Simulate Hash'}
                      </button>
                    </div>
                    {showPasswordHashDemo ? (
                      <code className={`font-mono-code text-[10px] text-emerald-600 dark:text-emerald-400 break-all p-1.5 rounded block ${
                        theme === 'dark' ? 'bg-black/50' : 'bg-white border border-slate-200'
                      }`}>
                        $argon2id$v=19$m=65536,t=3,p=4$qW...e4a9e$7bf8...
                      </code>
                    ) : (
                      <div className="font-mono-code text-slate-500 dark:text-slate-400 text-[11px] tracking-widest">
                        ••••••••••••••• (Zero Plaintext)
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Storage Standard Note */}
                <div className={`pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono-code ${
                  theme === 'dark' ? 'border-white/10' : 'border-slate-100'
                }`}>
                  <span className={`text-[11px] shrink-0 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Storage Standard:
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] text-left sm:text-right break-words">
                    {card.storageNote}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Extra Transparency Pillars */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${
            theme === 'dark'
              ? 'border-emerald-500/20 bg-emerald-950/10 hover:border-emerald-500/40'
              : 'border-emerald-200 bg-emerald-50/60 shadow-sm hover:border-emerald-300'
          }`}>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              No sale or brokering of phone numbers or emails
            </span>
          </div>
          <div className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${
            theme === 'dark'
              ? 'border-indigo-500/20 bg-indigo-950/10 hover:border-indigo-500/40'
              : 'border-indigo-200 bg-indigo-50/60 shadow-sm hover:border-indigo-300'
          }`}>
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)] shrink-0" />
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Automatic multi-factor login challenges
            </span>
          </div>
          <div className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${
            theme === 'dark'
              ? 'border-pink-500/20 bg-pink-950/10 hover:border-pink-500/40'
              : 'border-pink-200 bg-pink-50/60 shadow-sm hover:border-pink-300'
          }`}>
            <div className="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)] shrink-0" />
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Data collected strictly to fulfill requested services
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
