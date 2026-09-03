import React, { useState, useRef, useEffect } from 'react';
import { usePortal } from '../../context/PortalContext';
import { ApkConfig, ApkDisplayStatus } from '../../types';
import { uploadAdminApkApi, updateAdminApkConfigApi } from '../../services/api';
import {
  Smartphone,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Info,
  Link2,
  Eye,
  EyeOff,
  PauseCircle,
  FileBox,
  Hash,
  AlertTriangle,
  Globe,
} from 'lucide-react';

export const ApkReleaseManager: React.FC = () => {
  const { apkConfig, setApkConfig } = usePortal();

  // Active source mode tab: 'upload' | 'link'
  const [activeSourceTab, setActiveSourceTab] = useState<'upload' | 'link'>(
    apkConfig.sourceType === 'external_url' ? 'link' : 'upload'
  );

  // Display status state
  const [displayStatus, setDisplayStatus] = useState<ApkDisplayStatus>(
    apkConfig.displayStatus || (apkConfig.directDownloadEnabled ? 'active' : 'paused')
  );

  // Form Fields
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [versionName, setVersionName] = useState(apkConfig.versionName || 'v2.4.2');
  const [versionCode, setVersionCode] = useState(String(apkConfig.versionCode || 25));
  const [releaseNotes, setReleaseNotes] = useState(apkConfig.releaseNotes || '');
  const [minAndroidVersion, setMinAndroidVersion] = useState(
    apkConfig.minAndroidVersion || 'Android 8.0 (Oreo) or later'
  );
  const [packageName, setPackageName] = useState(apkConfig.packageName || 'com.indichat.app');
  const [appName, setAppName] = useState(apkConfig.appName || 'IndiChat: Private & Secure Super App');

  // External / Linked APK fields
  const [externalUrl, setExternalUrl] = useState(apkConfig.externalUrl || '');
  const [linkFileName, setLinkFileName] = useState(apkConfig.fileName || 'IndiChat-v2.4.2.apk');
  const [linkFileSizeFormatted, setLinkFileSizeFormatted] = useState(
    apkConfig.fileSizeFormatted || '28.4 MB'
  );

  // Operation states
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedSha, setCopiedSha] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep local state in sync when apkConfig changes from server
  useEffect(() => {
    if (apkConfig) {
      setDisplayStatus(apkConfig.displayStatus || (apkConfig.directDownloadEnabled ? 'active' : 'paused'));
      setVersionName(apkConfig.versionName || 'v2.4.2');
      setVersionCode(String(apkConfig.versionCode || 25));
      setReleaseNotes(apkConfig.releaseNotes || '');
      setMinAndroidVersion(apkConfig.minAndroidVersion || 'Android 8.0 (Oreo) or later');
      setPackageName(apkConfig.packageName || 'com.indichat.app');
      setAppName(apkConfig.appName || 'IndiChat: Private & Secure Super App');
      setExternalUrl(apkConfig.externalUrl || '');
      setLinkFileName(apkConfig.fileName || 'IndiChat-v2.4.2.apk');
      setLinkFileSizeFormatted(apkConfig.fileSizeFormatted || '28.4 MB');
    }
  }, [apkConfig]);

  // Handle Display Status Update immediately
  const handleUpdateDisplayStatus = async (newStatus: ApkDisplayStatus) => {
    setDisplayStatus(newStatus);
    setIsUpdatingStatus(true);
    setFeedback(null);

    try {
      const updated = await updateAdminApkConfigApi({
        displayStatus: newStatus,
        directDownloadEnabled: newStatus === 'active',
      });

      setApkConfig(updated);
      setFeedback({
        type: 'success',
        message:
          newStatus === 'active'
            ? 'APK display status set to ACTIVE: Install buttons are now live across the public site.'
            : newStatus === 'paused'
            ? 'APK display status set to PAUSED: Site will display maintenance notice for APK installation.'
            : 'APK display status set to HIDDEN: Install APK buttons are now completely hidden from the public website.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update display status.';
      setFeedback({ type: 'error', message: msg });
      // Revert local state
      setDisplayStatus(apkConfig.displayStatus || 'active');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Drag & drop file handlers
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.apk') || file.type.includes('android')) {
        setSelectedFile(file);
        setFeedback(null);
      } else {
        setFeedback({
          type: 'error',
          message: 'Please drop a valid Android package (.apk) file.',
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFeedback(null);
    }
  };

  // Upload APK File Submit
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setFeedback({ type: 'error', message: 'Please select an APK file to upload.' });
      return;
    }

    setIsUploading(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append('apkFile', selectedFile);
      formData.append('versionName', versionName);
      formData.append('versionCode', versionCode);
      formData.append('releaseNotes', releaseNotes);
      formData.append('minAndroidVersion', minAndroidVersion);
      formData.append('packageName', packageName);
      formData.append('appName', appName);
      formData.append('displayStatus', displayStatus);
      formData.append('directDownloadEnabled', String(displayStatus === 'active'));

      const res = await uploadAdminApkApi(formData);
      setApkConfig(res.apk);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setFeedback({
        type: 'success',
        message: res.message || `APK ${res.apk.versionName} uploaded and released successfully!`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setFeedback({ type: 'error', message });
    } finally {
      setIsUploading(false);
    }
  };

  // Save Linked APK URL Submit
  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = externalUrl.trim();

    if (!cleanUrl) {
      setFeedback({ type: 'error', message: 'Please enter a valid external/hosted APK download URL.' });
      return;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      setFeedback({ type: 'error', message: 'APK download URL must start with https:// or http://' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const updated = await updateAdminApkConfigApi({
        sourceType: 'external_url',
        externalUrl: cleanUrl,
        downloadUrl: cleanUrl,
        fileName: linkFileName.trim() || 'IndiChat-v2.4.2.apk',
        fileSizeFormatted: linkFileSizeFormatted.trim() || '28.4 MB',
        versionName: versionName.trim() || 'v2.4.2',
        versionCode: parseInt(versionCode, 10) || 25,
        releaseNotes: releaseNotes.trim(),
        minAndroidVersion: minAndroidVersion.trim(),
        packageName: packageName.trim(),
        appName: appName.trim(),
        displayStatus,
        directDownloadEnabled: displayStatus === 'active',
      });

      setApkConfig(updated);
      setFeedback({
        type: 'success',
        message: `External APK URL linked successfully! Version ${updated.versionName} is now configured.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to link external APK URL.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  // Save General Metadata
  const handleSaveMetadata = async () => {
    setIsSaving(true);
    setFeedback(null);

    try {
      const updated = await updateAdminApkConfigApi({
        versionName: versionName.trim(),
        versionCode: parseInt(versionCode, 10) || 1,
        releaseNotes: releaseNotes.trim(),
        minAndroidVersion: minAndroidVersion.trim(),
        packageName: packageName.trim(),
        appName: appName.trim(),
      });

      setApkConfig(updated);
      setFeedback({
        type: 'success',
        message: 'APK release metadata saved successfully.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save metadata.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const copyChecksum = () => {
    if (apkConfig.sha256) {
      navigator.clipboard.writeText(apkConfig.sha256);
      setCopiedSha(true);
      setTimeout(() => setCopiedSha(false), 2000);
    }
  };

  const copyDownloadUrl = () => {
    const activeUrl =
      apkConfig.sourceType === 'external_url' && apkConfig.externalUrl
        ? apkConfig.externalUrl
        : `${window.location.origin}/api/apk/download`;
    navigator.clipboard.writeText(activeUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div id="admin-apk-manager" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Smartphone className="w-6 h-6" />
            </span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              APK Management
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload or link an Android APK package, manage release versions, and configure display status for the public website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={copyDownloadUrl}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/80 border border-gray-300 dark:border-gray-700 rounded-xl transition-all shadow-sm"
            title="Copy download URL"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUrl ? 'URL Copied' : 'Copy Download Link'}</span>
          </button>

          <a
            id="admin-apk-test-download-btn"
            href={
              apkConfig.sourceType === 'external_url' && apkConfig.externalUrl
                ? apkConfig.externalUrl
                : '/api/apk/download'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-all shadow-sm"
            title="Download active APK file to test"
          >
            <Download className="w-4 h-4" />
            <span>Test Download APK</span>
          </a>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          id="apk-manager-feedback-banner"
          className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800 dark:text-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium">{feedback.message}</p>
        </div>
      )}

      {/* SECTION 1: CONFIGURE DISPLAY STATUS */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Configure Display Status</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Control the visibility of the "Install APK" buttons on the public website (Navbar, Hero, CTA, and Footer).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Current Status:</span>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                displayStatus === 'active'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                  : displayStatus === 'paused'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {displayStatus === 'active' && <CheckCircle2 className="w-3.5 h-3.5" />}
              {displayStatus === 'paused' && <PauseCircle className="w-3.5 h-3.5" />}
              {displayStatus === 'hidden' && <EyeOff className="w-3.5 h-3.5" />}
              <span>{displayStatus}</span>
            </span>
          </div>
        </div>

        {/* 3 Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Card 1: Active */}
          <div
            onClick={() => handleUpdateDisplayStatus('active')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              displayStatus === 'active'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20 shadow-sm'
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Active (Live)</span>
              </div>
              <input
                type="radio"
                name="displayStatusRadio"
                checked={displayStatus === 'active'}
                onChange={() => handleUpdateDisplayStatus('active')}
                className="text-emerald-600 focus:ring-emerald-500"
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Displayed prominently on the public website. Users can click and install directly.
            </p>
          </div>

          {/* Card 2: Paused */}
          <div
            onClick={() => handleUpdateDisplayStatus('paused')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              displayStatus === 'paused'
                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20 shadow-sm'
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                <PauseCircle className="w-4 h-4" />
                <span>Paused (Maintenance)</span>
              </div>
              <input
                type="radio"
                name="displayStatusRadio"
                checked={displayStatus === 'paused'}
                onChange={() => handleUpdateDisplayStatus('paused')}
                className="text-amber-600 focus:ring-amber-500"
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Direct downloads are paused. The modal will notify users that installation is temporarily under maintenance.
            </p>
          </div>

          {/* Card 3: Hidden */}
          <div
            onClick={() => handleUpdateDisplayStatus('hidden')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              displayStatus === 'hidden'
                ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30 ring-2 ring-red-500/20 shadow-sm'
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
                <EyeOff className="w-4 h-4" />
                <span>Hidden (Unpublished)</span>
              </div>
              <input
                type="radio"
                name="displayStatusRadio"
                checked={displayStatus === 'hidden'}
                onChange={() => handleUpdateDisplayStatus('hidden')}
                className="text-red-600 focus:ring-red-500"
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Completely hides the "Install APK" buttons from all navigation and CTA banners across the website.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: ACTIVE LIVE RELEASE SUMMARY */}
      <div className="bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 dark:from-emerald-950/20 dark:via-gray-900 dark:to-teal-950/10 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-500 text-white shadow-sm flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Current Live Package
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {apkConfig.versionName || 'v2.4.1'}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-mono">
                Version Code: {apkConfig.versionCode || 24}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium">
                Source: {apkConfig.sourceType === 'external_url' ? 'Linked External URL' : 'Uploaded File'}
              </span>
            </div>

            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Total User Installs: {(apkConfig.downloadCount || 0).toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
            <div>
              <p className="text-gray-400 dark:text-gray-500">File Name</p>
              <p className="font-mono font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[200px]">
                {apkConfig.fileName}
              </p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500">File Size</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {apkConfig.fileSizeFormatted || '27.1 MB'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500">Package Identifier</p>
              <p className="font-mono font-semibold text-gray-800 dark:text-gray-200 truncate">
                {apkConfig.packageName || 'com.indichat.app'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500">Min Android OS</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {apkConfig.minAndroidVersion || 'Android 8.0+'}
              </p>
            </div>
          </div>

          {apkConfig.sourceType === 'external_url' && apkConfig.externalUrl && (
            <div className="flex items-center gap-2 text-xs pt-1">
              <span className="font-semibold text-gray-500 dark:text-gray-400">Linked URL:</span>
              <a
                href={apkConfig.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-indigo-600 dark:text-indigo-400 hover:underline truncate max-w-lg flex items-center gap-1"
              >
                <span>{apkConfig.externalUrl}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          )}

          {apkConfig.sha256 && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-1">
              <span className="font-semibold">SHA-256:</span>
              <span className="font-mono bg-gray-100 dark:bg-gray-800/80 px-2 py-0.5 rounded text-[11px] truncate max-w-md">
                {apkConfig.sha256}
              </span>
              <button
                type="button"
                onClick={copyChecksum}
                className="p-1 text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                title="Copy SHA-256 Checksum"
              >
                {copiedSha ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: UPLOAD OR LINK APK (DUAL MODE TAB) */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileBox className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Upload or Link APK File</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Choose whether to upload a physical APK file directly to this server, or link an externally hosted APK URL (e.g. AWS S3, Cloudflare R2, Google Drive, or CDN).
          </p>
        </div>

        {/* Tab switcher: Upload APK vs Link APK URL */}
        <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800/60 p-1 border border-gray-200 dark:border-gray-700 max-w-md">
          <button
            type="button"
            onClick={() => setActiveSourceTab('upload')}
            className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeSourceTab === 'upload'
                ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload APK File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSourceTab('link')}
            className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeSourceTab === 'link'
                ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Link APK (External URL)</span>
          </button>
        </div>

        {/* MODE A: UPLOAD APK FILE */}
        {activeSourceTab === 'upload' && (
          <form onSubmit={handleUploadSubmit} className="space-y-6">
            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : selectedFile
                  ? 'border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10'
                  : 'border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-gray-50/50 dark:bg-gray-800/30'
              }`}
            >
              <input
                ref={fileInputRef}
                id="admin-apk-file-input"
                type="file"
                accept=".apk,application/vnd.android.package-archive"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Upload className="w-8 h-8" />
                </div>

                {selectedFile ? (
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-base">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload & compute checksum
                    </p>
                    <span className="inline-block mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 underline">
                      Click to choose a different file
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      Click to browse or drag and drop your Android .apk file
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Supports standard Android .apk builds up to 250 MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Version & Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Version Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  placeholder="e.g. v2.4.2"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Version Code (Integer) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={versionCode}
                  onChange={(e) => setVersionCode(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Package Name
                </label>
                <input
                  type="text"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="com.indichat.app"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Minimum Android Version
                </label>
                <input
                  type="text"
                  value={minAndroidVersion}
                  onChange={(e) => setMinAndroidVersion(e.target.value)}
                  placeholder="Android 8.0 (Oreo) or later"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Release Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Release Notes & What's New
              </label>
              <textarea
                rows={3}
                value={releaseNotes}
                onChange={(e) => setReleaseNotes(e.target.value)}
                placeholder="• List security updates, features, and optimizations..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans"
              />
            </div>

            <button
              type="submit"
              id="admin-apk-upload-submit-btn"
              disabled={!selectedFile || isUploading}
              className="w-full py-3 px-5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Uploading APK & Generating Checksum...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload & Deploy APK ({versionName})</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* MODE B: LINK APK FILE (URL) */}
        {activeSourceTab === 'link' && (
          <form onSubmit={handleLinkSubmit} className="space-y-6">
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 space-y-1">
              <p className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                <span>External or Cloud-Hosted APK Package</span>
              </p>
              <p className="text-xs text-indigo-800/80 dark:text-indigo-300/80 leading-relaxed">
                Provide a direct download URL from your CDN, Amazon S3 bucket, Cloudflare R2, Google Drive direct link, or GitHub Releases. When users click "Install APK", they will download directly from this URL.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                APK Direct Download URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://cdn.indichat.com/releases/indichat-latest.apk"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Must be an accessible URL returning the Android package file.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Display File Name
                </label>
                <input
                  type="text"
                  value={linkFileName}
                  onChange={(e) => setLinkFileName(e.target.value)}
                  placeholder="IndiChat-v2.4.2.apk"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Display File Size
                </label>
                <input
                  type="text"
                  value={linkFileSizeFormatted}
                  onChange={(e) => setLinkFileSizeFormatted(e.target.value)}
                  placeholder="e.g. 28.4 MB"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Version Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  placeholder="e.g. v2.4.2"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Version Code (Integer)
                </label>
                <input
                  type="number"
                  value={versionCode}
                  onChange={(e) => setVersionCode(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Release Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Release Notes & What's New
              </label>
              <textarea
                rows={3}
                value={releaseNotes}
                onChange={(e) => setReleaseNotes(e.target.value)}
                placeholder="• List features and changes in this version..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 px-5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving & Linking APK URL...</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  <span>Save & Link APK URL</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
