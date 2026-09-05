import React from 'react';
import { Phone, Mail, KeyRound, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ThemeMode } from '../types';

interface InformationWeCollectProps {
  theme: ThemeMode;
}

export const InformationWeCollect: React.FC<InformationWeCollectProps> = ({ theme }) => {
  const cards = [
    {
      id: 'phone',
      title: 'Phone Number',
      purpose: 'Used for account verification and safe login.',
      icon: Phone,
      gradient: 'from-purple-500 to-indigo-600',
      iconColor: 'text-purple-500 dark:text-purple-400',
      features: [
        'SMS one-time login verification codes',
        'Account recovery and security confirmations',
        'Never sold or shared with telemarketers',
      ],
      storageNote: 'Encrypted at rest',
    },
    {
      id: 'email',
      title: 'Email Address',
      purpose: 'Used for essential account security and communication.',
      icon: Mail,
      gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
      iconColor: 'text-cyan-500 dark:text-cyan-400',
      features: [
        'Critical security notifications and alerts',
        'Account recovery and verification links',
        'Zero spam, promotional, or third-party sharing',
      ],
      storageNote: 'Protected & isolated',
    },
    {
      id: 'password',
      title: 'Password Credentials',
      purpose: 'Stored using irreversible one-way cryptographic encryption.',
      icon: KeyRound,
      gradient: 'from-pink-500 to-rose-600',
      iconColor: 'text-pink-500 dark:text-pink-400',
      features: [
        'Salted cryptographic hashing',
        'Never stored in plain text or visible to staff',
        'Protected against unauthorized login attempts',
      ],
      storageNote: 'Zero plain text',
    },
  ];

  return (
    <section id="information-collected" className="py-20 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            <span className={theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}>Information We </span>
            <span className={`bg-gradient-to-r ${
              theme === 'dark' ? 'from-purple-400 via-pink-400 to-indigo-400' : 'from-purple-700 via-pink-600 to-indigo-600'
            } bg-clip-text text-transparent`}>
              Collect
            </span>
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
            We only collect what is necessary to authenticate you and keep your account safe.
          </p>
        </div>

        {/* 3 Clear Essential Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                id={`collect-card-${card.id}`}
                className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col justify-between border transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-[#0c101c]/90 backdrop-blur-xl border-white/10 shadow-xl shadow-black/40 hover:bg-[#111728]'
                    : 'bg-white/95 backdrop-blur-xl border-slate-200/90 shadow-xl shadow-indigo-100/50 hover:border-indigo-300 hover:bg-white'
                } group hover:-translate-y-1`}
              >
                {/* Top gradient accent line */}
                <div
                  className={`absolute top-0 left-6 right-6 h-[3px] rounded-full bg-gradient-to-r ${card.gradient} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div>
                  {/* Icon */}
                  <div className="mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center p-0.5 bg-gradient-to-br ${card.gradient} shadow-md group-hover:scale-105 transition-transform shrink-0`}
                    >
                      <div
                        className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                          theme === 'dark' ? 'bg-[#090d16]' : 'bg-white'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${card.iconColor}`} />
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`font-display text-xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {card.title}
                  </h3>

                  {/* Purpose Paragraph */}
                  <p
                    className={`text-sm leading-relaxed mb-5 ${
                      theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    {card.purpose}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="space-y-2.5 mb-6">
                    {card.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Storage Standard Note */}
                <div className={`pt-4 border-t flex items-center justify-between text-xs ${
                  theme === 'dark' ? 'border-white/10' : 'border-slate-100'
                }`}>
                  <span className={`text-[11px] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    Security Standard:
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {card.storageNote}
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
