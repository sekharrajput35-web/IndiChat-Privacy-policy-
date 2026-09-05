import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Minus,
  Search,
  Mail,
  Copy,
  Check,
  ShieldCheck,
  Layers,
  ChevronRight,
  Smartphone,
  Server,
  Bot,
  ShieldAlert,
  Sliders,
  ArrowRight,
} from 'lucide-react';
import { ThemeMode } from '../types';
import { PRIVACY_POLICY_SECTIONS, PRIVACY_POLICY_META } from '../data/portalData';
import { usePortal } from '../context/PortalContext';

interface PrivacyPolicyAccordionProps {
  theme: ThemeMode;
}

export const PrivacyPolicyAccordion: React.FC<PrivacyPolicyAccordionProps> = ({ theme }) => {
  const { contactInfo } = usePortal();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'privacy-commitment': true,
    'normal-sms': true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const officialEmail = contactInfo.privacyEmail || 'IndiChatindilife@gmail.com';

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    PRIVACY_POLICY_SECTIONS.forEach((s) => (allOpen[s.id] = true));
    setOpenSections(allOpen);
  };

  const collapseAll = () => {
    setOpenSections({});
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(officialEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const filteredSections = PRIVACY_POLICY_SECTIONS.filter((sec) => {
    const matchTitle = sec.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSummary = sec.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchContent = sec.content.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchSubsections = sec.subsections?.some(
      (sub) =>
        sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchTitle || matchSummary || matchContent || matchSubsections;
  });

  return (
    <section id="privacy-policy" className="py-20 sm:py-24 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-500/15 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-purple-500/15 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 shadow-sm">
            <FileText className="w-3.5 h-3.5" />
            <span>Official Policy Document</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            <span className={theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}>IndiChat Privacy </span>
            <span className={`bg-gradient-to-r ${
              theme === 'dark' ? 'from-indigo-500 via-purple-400 to-pink-500' : 'from-indigo-700 via-purple-700 to-pink-600'
            } bg-clip-text text-transparent`}>
              Policy
            </span>
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
            IndiChat is a communication and digital services platform designed with privacy, security and user control as core principles.
          </p>
          <div className={`inline-flex flex-wrap items-center justify-center gap-2 text-xs font-mono-code px-4 py-1.5 rounded-full border ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10 text-slate-300'
              : 'bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
          }`}>
            <span>Effective Date: {PRIVACY_POLICY_META.effectiveDate}</span>
            <span>·</span>
            <span>Last Updated: {PRIVACY_POLICY_META.lastUpdated}</span>
            <span>·</span>
            <span className="text-indigo-500 dark:text-indigo-400 font-bold">29 Dedicated Sections</span>
          </div>
        </div>

        {/* Policy Preamble Card */}
        <div
          className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border mb-8 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#0c1020] to-[#12182d] border-indigo-500/30 shadow-lg shadow-indigo-950/20'
              : 'bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 border-indigo-200 shadow-sm'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
              <h3 className={`font-display font-bold text-sm sm:text-base ${
                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Preamble & Legal Acknowledgment
              </h3>
              <p className={theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}>
                IndiChat is a communication and digital services platform designed with privacy, security and user control as core principles.
              </p>
              <p className={theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}>
                This Privacy Policy explains what information IndiChat processes, why it is processed, how it is protected, and what controls are available to you.
              </p>
              <p className={`font-semibold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
                By creating or using an IndiChat account, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Bulk Expand Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-policy-search"
              type="text"
              placeholder="Search 29 policy sections, keywords (e.g. SMS, AI, encryption, deletion)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px] ${
                theme === 'dark'
                  ? 'bg-[#0a0e19] border-white/10 text-white placeholder-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
              }`}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className={`flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-colors min-h-[44px] text-center ${
                theme === 'dark'
                  ? 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300'
                  : 'border-slate-200 bg-white hover:bg-indigo-50 text-slate-700 shadow-sm'
              }`}
            >
              Expand All (29)
            </button>
            <button
              onClick={collapseAll}
              className={`flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-colors min-h-[44px] text-center ${
                theme === 'dark'
                  ? 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300'
                  : 'border-slate-200 bg-white hover:bg-indigo-50 text-slate-700 shadow-sm'
              }`}
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Accordion Sections List */}
        <div className="space-y-4">
          {filteredSections.map((sec) => {
            const isOpen = !!openSections[sec.id];
            const isContactSection = sec.id === 'contact-us' || sec.number === 28;
            const isPrivacyByDesignSection = sec.id === 'privacy-by-design' || sec.number === 29;

            return (
              <div
                key={sec.id}
                id={`policy-section-${sec.id}`}
                className={`rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? theme === 'dark'
                      ? 'bg-[#0d1222]/90 border-indigo-500/40 shadow-xl shadow-indigo-950/20'
                      : 'bg-white border-indigo-200 shadow-lg shadow-indigo-100/40'
                    : theme === 'dark'
                    ? 'bg-[#0a0e1a]/80 border-white/10 hover:border-white/20'
                    : 'bg-white/80 border-slate-200 hover:border-indigo-200 shadow-sm'
                }`}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleSection(sec.id)}
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-3 sm:gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl active:scale-[0.99] transition-transform min-h-[48px]"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-1">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0 flex items-center justify-center font-mono-code text-xs font-bold ${
                        isOpen
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30'
                          : theme === 'dark'
                          ? 'bg-white/5 text-slate-400 border border-white/10'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}
                    >
                      {String(sec.number).padStart(2, '0')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-display text-base sm:text-lg font-bold leading-snug break-words ${
                        theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        {sec.number}. {sec.title}
                      </h3>
                      <p className={`text-xs mt-0.5 line-clamp-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        {sec.summary}
                      </p>
                    </div>
                  </div>

                  {/* Animated Plus / Minus Icon */}
                  <div
                    className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border transition-all duration-300 ${
                      isOpen
                        ? 'border-indigo-400/50 bg-indigo-500/20 text-indigo-400 rotate-180'
                        : theme === 'dark'
                        ? 'border-white/10 bg-white/5 text-slate-400'
                        : 'border-slate-200 bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {/* Accordion Content Body */}
                {isOpen && (
                  <div
                    className={`px-4 sm:px-6 pb-5 sm:pb-6 pt-2 border-t text-sm leading-relaxed space-y-4 animate-fadeIn ${
                      theme === 'dark'
                        ? 'border-white/10 text-slate-200 bg-black/20'
                        : 'border-slate-100 text-slate-800 bg-indigo-50/20'
                    }`}
                  >
                    {sec.content.map((paragraph, idx) => (
                      <p
                        key={idx}
                        className={`leading-relaxed text-xs sm:text-sm ${
                          paragraph.startsWith('•')
                            ? theme === 'dark' ? 'pl-3 font-medium text-slate-100' : 'pl-3 font-medium text-slate-900'
                            : ''
                        }`}
                      >
                        {paragraph}
                      </p>
                    ))}

                    {/* Subsections if present */}
                    {sec.subsections && sec.subsections.length > 0 && (
                      <div className={`grid grid-cols-1 ${sec.subsections.length > 2 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'} gap-3 sm:gap-4 mt-4 pt-4 border-t ${
                        theme === 'dark' ? 'border-white/10' : 'border-slate-200'
                      }`}>
                        {sec.subsections.map((sub, sIdx) => (
                          <div
                            key={sIdx}
                            className={`p-3.5 rounded-xl border space-y-1.5 ${
                              theme === 'dark'
                                ? 'border-white/10 bg-white/[0.02]'
                                : 'border-indigo-100 bg-white shadow-sm'
                            }`}
                          >
                            <h4 className={`font-display font-semibold text-xs flex items-center gap-1.5 ${
                              theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'
                            }`}>
                              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                              <span>{sub.title}</span>
                            </h4>
                            <p className={`text-xs leading-relaxed ${
                              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                            }`}>
                              {sub.body}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Section 29 Visual Flow Chart Diagram */}
                    {isPrivacyByDesignSection && (
                      <div className={`mt-5 p-4 sm:p-6 rounded-2xl border space-y-4 ${
                        theme === 'dark'
                          ? 'bg-black/40 border-indigo-500/30'
                          : 'bg-indigo-50/70 border-indigo-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-indigo-400" />
                          <h4 className={`font-display font-bold text-xs uppercase tracking-wider ${
                            theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'
                          }`}>
                            Technical Privacy Architecture Flow
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className={`p-3 rounded-xl border ${
                            theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                          }`}>
                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>Normal SMS ➔ Local Device ➔ Local DB</span>
                            </div>
                            <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                              Stored exclusively in local Android database under user control. Never uploaded by default.
                            </p>
                          </div>
                          <div className={`p-3 rounded-xl border ${
                            theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                          }`}>
                            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">
                              <Server className="w-3.5 h-3.5" />
                              <span>Normal SMS ➔ IndiChat Server</span>
                            </div>
                            <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                              Zero default server upload. SMS traffic bypasses cloud synchronization servers entirely.
                            </p>
                          </div>
                          <div className={`p-3 rounded-xl border ${
                            theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                          }`}>
                            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1">
                              <Bot className="w-3.5 h-3.5" />
                              <span>Normal SMS ➔ Online AI</span>
                            </div>
                            <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                              Not shared with online AI services by default. Clear disclosures required for any online analysis.
                            </p>
                          </div>
                          <div className={`p-3 rounded-xl border ${
                            theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                          }`}>
                            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Private Data ➔ Security & Access</span>
                            </div>
                            <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                              Strict cryptographic protection in transit (TLS 1.3) and salted derivation at rest.
                            </p>
                          </div>
                          <div className={`p-3 rounded-xl border ${
                            theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                          }`}>
                            <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-400 mb-1">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>Administrator Boundary</span>
                            </div>
                            <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                              No unrestricted access. Normal administrative interfaces cannot view local SMS or E2EE content.
                            </p>
                          </div>
                          <div className={`p-3 rounded-xl border ${
                            theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                          }`}>
                            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                              <Sliders className="w-3.5 h-3.5" />
                              <span>User Autonomy</span>
                            </div>
                            <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                              Direct control over app lock, permissions, profile visibility, biometrics, and data deletion.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dedicated Contact Card in Section 28 */}
                    {isContactSection && (
                      <div className={`mt-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 ${
                        theme === 'dark'
                          ? 'bg-indigo-950/40 border-indigo-500/30'
                          : 'bg-indigo-50/80 border-indigo-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <span className={`text-xs font-mono-code block ${
                              theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'
                            }`}>
                              Privacy & Support Email:
                            </span>
                            <a
                              href={`mailto:${officialEmail}`}
                              className={`font-bold text-xs sm:text-sm font-mono-code break-all hover:underline ${
                                theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                              }`}
                            >
                              {officialEmail}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            id="btn-copy-privacy-email"
                            onClick={copyEmail}
                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-500/20 min-h-[44px]"
                          >
                            {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
                          </button>
                          <a
                            href={`mailto:${officialEmail}?subject=IndiChat%20Privacy%20Inquiry`}
                            className={`px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center min-h-[44px] transition-colors ${
                              theme === 'dark'
                                ? 'border-white/10 hover:bg-white/10 text-slate-200'
                                : 'border-slate-300 hover:bg-white text-slate-700'
                            }`}
                          >
                            Send Email
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredSections.length === 0 && (
            <div className={`p-8 text-center rounded-2xl border ${
              theme === 'dark' ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'
            }`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                No policy sections matched “{searchQuery}”.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs font-semibold text-indigo-400 hover:underline min-h-[44px] px-3 py-1"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
