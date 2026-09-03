import React from 'react';
import { ThemeMode } from '../../types';
import { ShieldCheck, Lock, Key, Cpu, HardDrive, RefreshCw } from 'lucide-react';
import { SECURITY_PILLARS, DATA_FLOW_STEPS } from '../../data/portalData';

interface SecurityContentManagerProps {
  theme: ThemeMode;
}

export const SecurityContentManager: React.FC<SecurityContentManagerProps> = ({ theme }) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cryptographic Standards & Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Security Content Management</h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Audit the cryptographic architecture and pipeline published on the public security section.
          </p>
        </div>
      </div>

      {/* 6 Security Pillars */}
      <div>
        <h3 className="text-base font-bold mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-400" />
          <span>Core Security Pillars (Public Website)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECURITY_PILLARS.map((p) => (
            <div
              key={p.id}
              className={`p-5 rounded-2xl border transition-all ${
                theme === 'dark' ? 'bg-[#0f1424] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono-code text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                  {p.algorithm}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Active</span>
              </div>
              <h4 className="font-bold text-base mb-1">{p.title}</h4>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Step Pipeline Audit */}
      <div>
        <h3 className="text-base font-bold mb-4 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-purple-400" />
          <span>Data Lifecycle Protection Flow</span>
        </h3>
        <div className="space-y-3">
          {DATA_FLOW_STEPS.map((step) => (
            <div
              key={step.step}
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                theme === 'dark' ? 'bg-[#0f1424] border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs font-mono-code">
                  0{step.step}
                </span>
                <div>
                  <h5 className="font-bold text-sm">{step.title}</h5>
                  <p className="text-xs text-slate-400">{step.description}</p>
                </div>
              </div>
              <span className="text-xs font-mono-code text-emerald-400 font-semibold flex-shrink-0">
                {step.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
