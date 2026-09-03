import React, { useState } from 'react';
import { HelpCircle, Plus, Minus, MessageCircleQuestion, Sparkles } from 'lucide-react';
import { ThemeMode } from '../types';
import { FAQ_ITEMS } from '../data/portalData';

interface FAQSectionProps {
  theme: ThemeMode;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ theme }) => {
  // Single active accordion index/id to automatically close other items when one is clicked
  const [activeFaqId, setActiveFaqId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setActiveFaqId((current) => (current === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 sm:py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-pink-500/15 dark:bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-80 h-80 bg-purple-500/15 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-indigo-500/15 border border-pink-500/30 text-pink-600 dark:text-pink-400 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            <span className={theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}>Frequently Asked </span>
            <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            Quick, transparent answers to help you navigate privacy, credential protection, and account settings.
          </p>
        </div>

        {/* FAQ Accordion List (Closes others when one is opened) */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = activeFaqId === item.id;

            return (
              <div
                key={item.id}
                id={`faq-item-${item.id}`}
                className={`rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? theme === 'dark'
                      ? 'bg-[#0d1222]/95 border-pink-500/50 shadow-xl shadow-pink-950/20'
                      : 'bg-white border-pink-200 shadow-lg shadow-pink-100/40'
                    : theme === 'dark'
                    ? 'bg-[#0a0e1a]/80 border-white/10 hover:border-white/20'
                    : 'bg-white/80 border-slate-200 hover:border-pink-200 shadow-sm'
                }`}
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-3 sm:gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-2xl active:scale-[0.99] transition-transform min-h-[48px]"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-1">
                    <span className="font-mono-code text-xs font-bold text-pink-500 shrink-0 px-2 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20">
                      Q{index + 1}
                    </span>
                    <h3 className={`font-display text-sm sm:text-lg font-bold leading-snug break-words ${
                      theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      {item.question}
                    </h3>
                  </div>

                  {/* Rotatable Plus into Minus Icon */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'border-pink-500/50 bg-pink-500/20 text-pink-400 rotate-180'
                        : theme === 'dark'
                        ? 'border-white/10 bg-white/5 text-slate-400'
                        : 'border-slate-200 bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {/* FAQ Answer Body */}
                {isOpen && (
                  <div
                    className={`px-4 sm:px-6 pb-5 sm:pb-6 pt-2 border-t text-sm leading-relaxed animate-fadeIn ${
                      theme === 'dark'
                        ? 'border-white/10 text-slate-300 bg-black/20'
                        : 'border-slate-100 text-slate-700 bg-pink-50/20'
                    }`}
                  >
                    <p className={`leading-relaxed pl-4 sm:pl-6 border-l-2 text-xs sm:text-sm ${
                      theme === 'dark' ? 'border-pink-500/40 text-slate-300' : 'border-pink-400 text-slate-700'
                    }`}>
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
