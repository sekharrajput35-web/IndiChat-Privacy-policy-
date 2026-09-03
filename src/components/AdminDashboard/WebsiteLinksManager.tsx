import React from 'react';
import { ThemeMode } from '../../types';
import { Globe, ExternalLink, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';

interface WebsiteLinksManagerProps {
  theme: ThemeMode;
  onNavigateHome: () => void;
}

export const WebsiteLinksManager: React.FC<WebsiteLinksManagerProps> = ({
  theme,
  onNavigateHome,
}) => {
  const publicLinks = [
    { title: 'Home / Hero Banner', path: '#hero', desc: 'IndiChat main trust headline, dynamic metrics, and primary CTA' },
    { title: 'Privacy at a Glance', path: '#privacy-overview', desc: '4 animated core pillars (Encryption, Control, Zero Advertising, Local Storage)' },
    { title: 'Information We Collect', path: '#information-collected', desc: 'Detailed breakdown of account data, content, and device telemetry' },
    { title: 'Security Architecture', path: '#security', desc: 'Visual 5-step data protection diagram and 6 cryptographic cards' },
    { title: 'Privacy Controls Demo', path: '#privacy-controls', desc: 'Interactive Public / Private / Custom mode toggle simulator' },
    { title: 'Privacy Center Dashboard', path: '#privacy-center', desc: 'Full interactive 5-module security & data dashboard' },
    { title: 'Transparency Timeline', path: '#transparency', desc: '5-step user lifecycle data journey and rights' },
    { title: 'Privacy Policy Document', path: '#privacy-policy', desc: '9 comprehensive formal legal and security policy sections' },
    { title: 'Frequently Asked Questions', path: '#faq', desc: '7 searchable questions on encryption, storage, and privacy rights' },
    { title: 'Connect With IndiChat', path: '#connect', desc: 'Admin-managed verified social media channels & official links' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Public Site Map & Navigation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Website Links</h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Inspect and test all public portal entry points and navigation anchors.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30 min-h-[40px]"
        >
          <span>Open Public Portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of site links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {publicLinks.map((link) => (
          <div
            key={link.title}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              theme === 'dark' ? 'bg-[#0f1424] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="font-bold text-base">{link.title}</h4>
                <span className="text-[11px] font-mono-code px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {link.path}
                </span>
              </div>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {link.desc}
              </p>
            </div>

            <div className="pt-4 mt-2 border-t border-white/5 dark:border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Responsive & Active</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  onNavigateHome();
                  setTimeout(() => {
                    const el = document.querySelector(link.path);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Jump to Section</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
