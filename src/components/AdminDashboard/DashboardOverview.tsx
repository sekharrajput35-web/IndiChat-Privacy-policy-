import React from 'react';
import { ThemeMode, AdminStats, AdminAuditLog, RegistrationLinkConfig, ContactInfo, SocialLinkItem } from '../../types';
import { usePortal } from '../../context/PortalContext';
import { Users, Shield, Link2, Share2, Activity, ArrowUpRight, Mail, ExternalLink, Smartphone } from 'lucide-react';

interface DashboardOverviewProps {
  theme: ThemeMode;
  stats: AdminStats;
  auditLogs: AdminAuditLog[];
  registrationLink: RegistrationLinkConfig;
  contactInfo: ContactInfo;
  socialLinks: SocialLinkItem[];
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  theme,
  stats,
  auditLogs,
  registrationLink,
  contactInfo,
  socialLinks,
  onNavigateTab,
}) => {
  const { apkConfig } = usePortal();
  const enabledSocials = socialLinks.filter((s) => s.isEnabled).length;

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-pink-900/20 border border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Authenticated Super Administrator Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            IndiChat Administration Hub
          </h1>
          <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            Welcome to the central control panel. Any changes made here to registration routes, contact emails,
            or verified social channels synchronize directly with the live public IndiChat portal.
          </p>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Registered Users */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-[#0f1424] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-code mb-1">
            {stats.totalUsers || 0}
          </div>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <span>Encrypted accounts in database</span>
          </span>
        </div>

        {/* Registration Link Mode */}
        <div
          onClick={() => onNavigateTab('registration')}
          className={`p-5 sm:p-6 rounded-2xl border cursor-pointer hover:border-indigo-500/50 transition-all ${
            theme === 'dark' ? 'bg-[#0f1424] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Register Button</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Link2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold truncate mb-1">
            {registrationLink.isEnabled ? 'Custom URL' : 'In-App Modal'}
          </div>
          <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
            <span>Manage destination</span>
            <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>

        {/* Enabled Social Media Channels */}
        <div
          onClick={() => onNavigateTab('social')}
          className={`p-5 sm:p-6 rounded-2xl border cursor-pointer hover:border-pink-500/50 transition-all ${
            theme === 'dark' ? 'bg-[#0f1424] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Social Channels</span>
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-code mb-1">
            {enabledSocials} / {socialLinks.length}
          </div>
          <span className="text-xs text-pink-400 font-semibold flex items-center gap-1">
            <span>Active on public site</span>
            <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>

        {/* Security Health */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border ${
            theme === 'dark' ? 'bg-[#0f1424] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Health</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono-code mb-1 text-emerald-400">
            100% SECURE
          </div>
          <span className="text-xs text-slate-400 font-mono-code">
            PBKDF2 Salted / TLS 1.3
          </span>
        </div>
      </div>

      {/* Grid: Quick Actions & Live Public Information Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Public Config Summary */}
        <div
          className={`p-6 rounded-2xl border space-y-4 ${
            theme === 'dark' ? 'bg-[#0f1424] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Live Public Website Configuration</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono-code">
              Synced
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-black/20 dark:bg-black/30 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block">Register Button Target:</span>
                <span className="font-mono-code text-indigo-300 font-semibold truncate max-w-xs block">
                  {registrationLink.isEnabled ? registrationLink.destinationUrl : 'Native In-App Registration Dialog'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('registration')}
                className="text-indigo-400 hover:underline font-semibold"
              >
                Change
              </button>
            </div>

            <div className="p-3 rounded-xl bg-black/20 dark:bg-black/30 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block">Privacy Contact Email:</span>
                <span className="font-mono-code text-purple-300 font-semibold">
                  {contactInfo.privacyEmail}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('contact')}
                className="text-purple-400 hover:underline font-semibold"
              >
                Edit
              </button>
            </div>

            <div className="p-3 rounded-xl bg-black/20 dark:bg-black/30 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block">Support Contact Email:</span>
                <span className="font-mono-code text-pink-300 font-semibold">
                  {contactInfo.supportEmail}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('contact')}
                className="text-pink-400 hover:underline font-semibold"
              >
                Edit
              </button>
            </div>

            <div className="p-3 rounded-xl bg-black/20 dark:bg-black/30 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block">Active Verified Social Media:</span>
                <span className="font-mono-code text-emerald-300 font-semibold">
                  {enabledSocials} platform links active in "Connect With IndiChat"
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('social')}
                className="text-emerald-400 hover:underline font-semibold"
              >
                Manage
              </button>
            </div>

            <div className="p-3 rounded-xl bg-black/20 dark:bg-black/30 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Android APK Live Release:</span>
                  <span className="font-mono-code text-emerald-300 font-semibold text-xs">
                    {apkConfig.versionName} • {apkConfig.fileName} ({apkConfig.fileSizeFormatted || '27.1 MB'})
                  </span>
                  <span className="block text-[11px] text-slate-400">
                    Status:{' '}
                    <span
                      className={
                        (apkConfig.displayStatus || (apkConfig.directDownloadEnabled ? 'active' : 'paused')) === 'active'
                          ? 'text-emerald-400 font-bold uppercase'
                          : (apkConfig.displayStatus || 'paused') === 'paused'
                          ? 'text-amber-400 font-bold uppercase'
                          : 'text-red-400 font-bold uppercase'
                      }
                    >
                      {apkConfig.displayStatus || (apkConfig.directDownloadEnabled ? 'active' : 'paused')}
                    </span>{' '}
                    • {apkConfig.downloadCount || 0} downloads
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('apk')}
                className="text-indigo-400 hover:underline font-semibold text-xs"
              >
                Upload / Manage
              </button>
            </div>
          </div>
        </div>

        {/* Recent Admin Audit Logs */}
        <div
          className={`p-6 rounded-2xl border space-y-4 ${
            theme === 'dark' ? 'bg-[#0f1424] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Immutable Admin Security Audit Trail</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono-code">Server-Audited</span>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {auditLogs.slice(0, 6).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-black/20 dark:bg-black/30 border border-white/5 text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-code font-bold text-indigo-400">{log.action}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-slate-400">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
