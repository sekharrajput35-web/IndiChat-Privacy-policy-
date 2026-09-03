import React, { useState } from 'react';
import { ThemeMode, RegistrationLinkConfig } from '../../types';
import { updateRegistrationLinkApi } from '../../services/api';
import { usePortal } from '../../context/PortalContext';
import { Link2, Save, ExternalLink, CheckCircle2, AlertCircle, RefreshCw, Power, Globe } from 'lucide-react';

interface RegistrationLinkManagerProps {
  theme: ThemeMode;
  initialConfig: RegistrationLinkConfig;
  onUpdated: (config: RegistrationLinkConfig) => void;
}

export const RegistrationLinkManager: React.FC<RegistrationLinkManagerProps> = ({
  theme,
  initialConfig,
  onUpdated,
}) => {
  const { refreshPortalData } = usePortal();

  const [title, setTitle] = useState(initialConfig.title || '');
  const [destinationUrl, setDestinationUrl] = useState(initialConfig.destinationUrl || '');
  const [description, setDescription] = useState(initialConfig.description || '');
  const [isEnabled, setIsEnabled] = useState(Boolean(initialConfig.isEnabled));
  const [openInNewTab, setOpenInNewTab] = useState(initialConfig.openInNewTab !== false);

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!destinationUrl.trim()) {
      setFeedback({ type: 'error', message: 'Destination URL cannot be blank.' });
      return;
    }

    // Validate URL
    try {
      new URL(destinationUrl.trim());
    } catch {
      setFeedback({
        type: 'error',
        message: 'Please enter a valid URL including https:// or http:// (e.g. https://indichat.com/join)',
      });
      return;
    }

    setIsLoading(true);
    try {
      const updated = await updateRegistrationLinkApi({
        title: title.trim(),
        destinationUrl: destinationUrl.trim(),
        description: description.trim(),
        isEnabled,
        openInNewTab,
      });

      onUpdated(updated);
      await refreshPortalData();
      setFeedback({
        type: 'success',
        message: 'Registration link configuration saved successfully! Public website register button is now synchronized.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save configuration';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefault = async () => {
    const defaultUrl = 'https://indichat.com/join';
    setTitle('IndiChat Super App Early Access & Portal');
    setDestinationUrl(defaultUrl);
    setDescription('Official registration portal for new IndiChat super app community accounts');
    setIsEnabled(false);
    setOpenInNewTab(true);

    setIsLoading(true);
    try {
      const updated = await updateRegistrationLinkApi({
        title: 'IndiChat Super App Early Access & Portal',
        destinationUrl: defaultUrl,
        description: 'Official registration portal for new IndiChat super app community accounts',
        isEnabled: false,
        openInNewTab: true,
      });
      onUpdated(updated);
      await refreshPortalData();
      setFeedback({
        type: 'success',
        message: 'Reset to internal modal registration mode.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reset';
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
            <Link2 className="w-3.5 h-3.5" />
            <span>Registration Routing Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Registration Link Management
          </h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Configure where visitors are directed when clicking the "Register" button on the public website.
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border ${
              isEnabled
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isEnabled ? 'Custom URL Active' : 'Native In-App Modal Active'}</span>
          </span>
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
            <span className="font-semibold block">
              {feedback.type === 'success' ? 'Success' : 'Configuration Error'}
            </span>
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Toggle Box */}
        <div
          className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-colors ${
            theme === 'dark' ? 'bg-[#0f1424] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-base">
                <Power className="w-4 h-4 text-indigo-400" />
                <span>Enable Custom Destination URL</span>
              </div>
              <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                When <strong>Enabled</strong>, clicking "Register" on the public website takes the user to the destination URL below.
                When <strong>Disabled</strong>, clicking "Register" opens the built-in modern registration modal.
              </p>
            </div>

            <button
              type="button"
              id="btn-toggle-custom-reg-link"
              onClick={() => setIsEnabled(!isEnabled)}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isEnabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
              role="switch"
              aria-checked={isEnabled}
              aria-label="Toggle custom registration URL"
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* URL Inputs */}
        <div
          className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border space-y-5 ${
            theme === 'dark' ? 'bg-[#0f1424] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          {/* Destination URL */}
          <div>
            <label
              htmlFor="input-admin-reg-destination"
              className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Destination Registration URL *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-4 h-4" />
              </div>
              <input
                id="input-admin-reg-destination"
                type="url"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                placeholder="https://indichat.com/join or https://play.google.com/..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-mono-code focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-600'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Enter the full target web address, app store link, or custom invite landing page.
            </p>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="input-admin-reg-title"
              className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Registration Portal Title
            </label>
            <input
              id="input-admin-reg-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. IndiChat Super App Early Access & Portal"
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                theme === 'dark'
                  ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-600'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="input-admin-reg-desc"
              className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Description / Instructions
            </label>
            <textarea
              id="input-admin-reg-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description displayed to users if an intermediate preview is shown"
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                theme === 'dark'
                  ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-600'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div>

          {/* Open in new tab checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              id="checkbox-reg-newtab"
              type="checkbox"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label
              htmlFor="checkbox-reg-newtab"
              className={`text-xs sm:text-sm font-medium cursor-pointer ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Open destination URL in a new browser tab (target="_blank")
            </label>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            {destinationUrl && (
              <a
                id="btn-test-destination-url"
                href={destinationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                  theme === 'dark'
                    ? 'border-white/10 bg-white/5 hover:bg-white/10 text-indigo-300'
                    : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-indigo-700'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test Destination Link</span>
              </a>
            )}

            <button
              type="button"
              id="btn-reset-reg-defaults"
              onClick={handleResetToDefault}
              disabled={isLoading}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                theme === 'dark'
                  ? 'border-white/10 hover:bg-white/5 text-slate-400 hover:text-slate-200'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Native Modal</span>
            </button>
          </div>

          <button
            type="submit"
            id="btn-save-reg-link-config"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-60 min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Saving Changes...' : 'Save Registration Link'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
