import React from 'react';
import { ThemeMode } from '../../types';
import { ShieldCheck, FileText, CheckCircle2, Lock } from 'lucide-react';
import { POLICY_SECTIONS } from '../../data/portalData';

interface PrivacyPolicyManagerProps {
  theme: ThemeMode;
}

export const PrivacyPolicyManager: React.FC<PrivacyPolicyManagerProps> = ({ theme }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Compliance & Transparency</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Privacy Policy Management</h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Inspect all 9 legal sections currently rendered on the public website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>9 of 9 Sections Active</span>
          </span>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {POLICY_SECTIONS.map((section) => (
          <div
            key={section.id}
            className={`p-5 sm:p-6 rounded-2xl border transition-all ${
              theme === 'dark' ? 'bg-[#0f1424] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-xs font-mono-code">
                  0{section.number}
                </span>
                <h3 className="font-bold text-base sm:text-lg">{section.title}</h3>
              </div>
              <span className="text-[10px] uppercase font-mono-code px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                Audited
              </span>
            </div>

            <p className={`text-xs sm:text-sm pl-11 mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              {section.summary}
            </p>

            <div className="pl-11 flex items-center gap-4 text-xs font-mono-code text-slate-500">
              <span>{section.content.length} paragraphs</span>
              <span>•</span>
              <span>{section.subsections?.length || 0} sub-clauses</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
