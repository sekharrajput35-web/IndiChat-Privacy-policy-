import React, { useState } from 'react';
import { ThemeMode, WebsiteSettings } from '../../types';
import { updateWebsiteSettingsApi } from '../../services/api';
import { usePortal } from '../../context/PortalContext';
import { Settings, Save, CheckCircle2, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface WebsiteSettingsManagerProps {
  theme: ThemeMode;
  initialSettings: WebsiteSettings;
  onUpdated: (settings: WebsiteSettings) => void;
}

export const WebsiteSettingsManager: React.FC<WebsiteSettingsManagerProps> = ({
  theme,
  initialSettings,
  onUpdated,
}) => {
  const { refreshPortalData } = usePortal();

  const [siteName, setSiteName] = useState(initialSettings.siteName || 'IndiChat');
  const [tagline, setTagline] = useState(
    initialSettings.tagline || "India's Privacy-First Communication & Super App"
  );
  const [allowRegistration, setAllowRegistration] = useState(
    initialSettings.allowRegistration !== false
  );
  const [maintenanceMode, setMaintenanceMode] = useState(
    Boolean(initialSettings.maintenanceMode)
  );
  const [announcementBanner, setAnnouncementBanner] = useState(
    initialSettings.announcementBanner || ''
  );

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsLoading(true);

    try {
      const updated = await updateWebsiteSettingsApi({
        siteName: siteName.trim(),
        tagline: tagline.trim(),
        allowRegistration,
        maintenanceMode,
        announcementBanner: announcementBanner.trim(),
      });

      onUpdated(updated);
      await refreshPortalData();
      setFeedback({
        type: 'success',
        message: 'Global website settings updated successfully!',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update settings';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Core Application Settings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Website Settings</h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Configure brand metadata, announcements, and global access flags.
          </p>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-start gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-semibold block">{feedback.type === 'success' ? 'Saved' : 'Error'}</span>
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div
          className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border space-y-6 ${
            theme === 'dark' ? 'bg-[#0f1424] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          {/* Site Name & Tagline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label
                htmlFor="input-settings-site-name"
                className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Website Brand Name
              </label>
              <input
                id="input-settings-site-name"
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="IndiChat"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === 'dark'
                    ? 'bg-[#07090e] border-white/10 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>

            <div>
              <label
                htmlFor="input-settings-tagline"
                className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Brand Tagline
              </label>
              <input
                id="input-settings-tagline"
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="India's Privacy-First Communication & Super App"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === 'dark'
                    ? 'bg-[#07090e] border-white/10 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Announcement Banner */}
          <div>
            <label
              htmlFor="input-settings-announcement"
              className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Public Announcement Banner (Optional)
            </label>
            <input
              id="input-settings-announcement"
              type="text"
              value={announcementBanner}
              onChange={(e) => setAnnouncementBanner(e.target.value)}
              placeholder="e.g. 🎉 IndiChat Super App Early Access beta is now live!"
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                theme === 'dark'
                  ? 'bg-[#07090e] border-white/10 text-white'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          {/* Toggles */}
          <div className="pt-2 space-y-4">
            {/* Allow Registration Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 dark:bg-black/30 border border-white/5">
              <div>
                <span className="text-sm font-semibold block">Allow Public User Registrations</span>
                <span className="text-xs text-slate-400">
                  When disabled, visitors will be notified that early access signups are temporarily paused.
                </span>
              </div>
              <input
                id="toggle-allow-registration"
                type="checkbox"
                checked={allowRegistration}
                onChange={(e) => setAllowRegistration(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div>
                <span className="text-sm font-semibold text-amber-400 block flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Maintenance Mode Flag</span>
                </span>
                <span className="text-xs text-slate-400">
                  Displays maintenance notice for scheduled infrastructure updates.
                </span>
              </div>
              <input
                id="toggle-maintenance-mode"
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            id="btn-save-website-settings"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-60 min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Saving...' : 'Save Website Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
