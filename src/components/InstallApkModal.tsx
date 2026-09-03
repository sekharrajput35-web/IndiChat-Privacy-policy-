import React, { useEffect, useState, useCallback } from 'react';
import { usePortal } from '../context/PortalContext';
import { ApkConfig } from '../types';
import { fetchPublicApkApi } from '../services/api';
import {
  Smartphone,
  Download,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  ExternalLink,
  EyeOff,
} from 'lucide-react';

interface InstallApkModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoStartDownload?: boolean;
}

export const InstallApkModal: React.FC<InstallApkModalProps> = ({
  isOpen,
  onClose,
  autoStartDownload = true,
}) => {
  const { apkConfig: portalApkConfig, setApkConfig } = usePortal();

  // Local state for the dynamic APK config fetched directly from backend
  const [liveApk, setLiveApk] = useState<ApkConfig>(portalApkConfig);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [copiedSha, setCopiedSha] = useState<boolean>(false);
  const [downloadTriggered, setDownloadTriggered] = useState<boolean>(false);

  // Compute the live download URL dynamically
  const resolvedDownloadUrl =
    liveApk.sourceType === 'external_url' && liveApk.externalUrl
      ? liveApk.externalUrl
      : liveApk.downloadUrl || '/api/apk/download';

  // Trigger download action using the dynamic URL
  const triggerDownload = useCallback((apkToUse?: ApkConfig) => {
    const targetApk = apkToUse || liveApk;
    const url =
      targetApk.sourceType === 'external_url' && targetApk.externalUrl
        ? targetApk.externalUrl
        : targetApk.downloadUrl || '/api/apk/download';

    setDownloadTriggered(true);

    // Create an invisible anchor tag to trigger the browser APK download
    const link = document.createElement('a');
    link.href = url;
    link.download = targetApk.fileName || 'IndiChat.apk';
    if (targetApk.sourceType === 'external_url') {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [liveApk]);

  // Dynamic fetch function to get latest APK configuration from the backend
  const loadDynamicApkConfig = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await fetchPublicApkApi();
      setLiveApk(data);
      // Synchronize back into global portal context
      setApkConfig(data);

      const isLiveActive =
        data.displayStatus === 'active' ||
        (data.displayStatus === undefined && data.directDownloadEnabled);

      if (autoStartDownload && isLiveActive) {
        triggerDownload(data);
      }
    } catch (err: unknown) {
      console.error('Failed to dynamically fetch APK configuration:', err);
      setFetchError('Could not verify latest release from server. Using cached configuration.');
      // Still allow download from cached portal config if active
      if (autoStartDownload && portalApkConfig.directDownloadEnabled) {
        triggerDownload(portalApkConfig);
      }
    } finally {
      setIsLoading(false);
    }
  }, [autoStartDownload, setApkConfig, triggerDownload, portalApkConfig]);

  // Fetch dynamically on modal open
  useEffect(() => {
    if (isOpen) {
      setDownloadTriggered(false);
      loadDynamicApkConfig();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyChecksum = () => {
    if (liveApk.sha256) {
      navigator.clipboard.writeText(liveApk.sha256);
      setCopiedSha(true);
      setTimeout(() => setCopiedSha(false), 2000);
    }
  };

  const isDownloadAllowed =
    liveApk.displayStatus === 'active' ||
    (liveApk.displayStatus === undefined && liveApk.directDownloadEnabled);

  const isMaintenancePaused = liveApk.displayStatus === 'paused';
  const isHidden = liveApk.displayStatus === 'hidden';

  return (
    <div
      id="install-apk-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="install-apk-modal-card"
        className="relative w-full max-w-lg bg-white dark:bg-[#0c101c] rounded-3xl shadow-2xl border border-gray-200 dark:border-emerald-500/30 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient banner */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 p-6 text-white">
          <button
            id="close-apk-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white/90 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 p-2.5 flex items-center justify-center shadow-lg">
              <Smartphone className="w-7 h-7 text-emerald-200" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold text-emerald-100 backdrop-blur-sm mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Official Android APK Package</span>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight">
                Install IndiChat App
              </h3>
              <p className="text-xs text-emerald-100/90 font-medium">
                Version {liveApk.versionName} • {liveApk.fileSizeFormatted || '27.1 MB'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 p-2.5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Fetching latest package information from server...</span>
            </div>
          )}

          {/* Fetch error warning banner if any */}
          {fetchError && !isLoading && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
              <span>{fetchError}</span>
              <button
                type="button"
                onClick={loadDynamicApkConfig}
                className="underline font-semibold ml-2 hover:text-amber-900"
              >
                Retry
              </button>
            </div>
          )}

          {/* Dynamic Download Status Alert */}
          {isDownloadAllowed ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-emerald-900 dark:text-emerald-200">
                  {downloadTriggered
                    ? 'APK Download in Progress...'
                    : 'Ready to Install Official Android Package'}
                </p>
                <p className="text-emerald-700 dark:text-emerald-300/90 leading-relaxed">
                  Package file <span className="font-mono font-semibold">{liveApk.fileName}</span>{' '}
                  is downloading to your device.
                </p>
                <button
                  type="button"
                  onClick={() => triggerDownload()}
                  className="mt-1 font-semibold text-emerald-700 dark:text-emerald-300 underline hover:text-emerald-900 dark:hover:text-emerald-100 inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Click here if download didn't start automatically</span>
                </button>
              </div>
            </div>
          ) : isMaintenancePaused ? (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-amber-900 dark:text-amber-200">
                  Direct Installation Paused
                </p>
                <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
                  The administrator has temporarily paused direct APK distribution for scheduled maintenance. Please check back shortly.
                </p>
              </div>
            </div>
          ) : isHidden ? (
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 flex items-start gap-3">
              <EyeOff className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-gray-900 dark:text-white">
                  Package Currently Unpublished
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  This APK release is currently hidden from public distribution by the administrator.
                </p>
              </div>
            </div>
          ) : null}

          {/* 3 Step Installation Guide */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              How to Install APK on Android (3 Steps)
            </h4>

            <div className="grid grid-cols-1 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    Tap the Downloaded File
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                    Pull down your phone's notification shade or open <em>Files &gt; Downloads</em> and tap{' '}
                    <strong className="text-gray-700 dark:text-gray-300 font-mono text-[11px]">{liveApk.fileName}</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    Allow "Install Unknown Apps"
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                    If Android prompts with a security notice, tap <strong>Settings</strong> and enable{' '}
                    <strong>"Allow from this source"</strong> for your browser.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    Tap "Install" & Open IndiChat
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                    Tap <strong>Install</strong>. Once complete, tap <strong>Open</strong> to start your encrypted chats and private reels!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Release Notes / What's New */}
          {liveApk.releaseNotes && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1.5">
              <p className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>What's New in {liveApk.versionName}</span>
              </p>
              <p className="text-indigo-800/80 dark:text-indigo-300/80 whitespace-pre-line leading-relaxed text-[11px]">
                {liveApk.releaseNotes}
              </p>
            </div>
          )}

          {/* Integrity Checksum */}
          {liveApk.sha256 && (
            <div className="flex items-center justify-between text-[11px] p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5 truncate max-w-[280px]">
                <span className="font-bold text-gray-700 dark:text-gray-300">SHA-256:</span>
                <span className="font-mono text-[10px] truncate">{liveApk.sha256}</span>
              </div>
              <button
                type="button"
                onClick={copyChecksum}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0 ml-2"
              >
                {copiedSha ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Hash</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Bottom actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              id="modal-direct-install-btn"
              onClick={() => triggerDownload()}
              disabled={!isDownloadAllowed}
              className="flex-1 py-3 px-5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
            >
              <Download className="w-4 h-4" />
              <span>Install APK ({liveApk.versionName})</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
