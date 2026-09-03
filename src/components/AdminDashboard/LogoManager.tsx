import React, { useState, useRef, useEffect } from 'react';
import { ThemeMode, WebsiteLogoConfig, LogoDisplayType, LogoShape, LogoIconDesign, LogoIconGradient } from '../../types';
import { uploadAdminLogoApi, updateAdminLogoApi, resetAdminLogoApi, getAdminLogoApi } from '../../services/api';
import { usePortal } from '../../context/PortalContext';
import { BrandLogo } from '../BrandLogo';
import {
  Image as ImageIcon,
  Upload,
  Link2,
  Palette,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Sliders,
  Shield,
  Layers,
  Type,
  Sun,
  Moon,
  ExternalLink,
} from 'lucide-react';

interface LogoManagerProps {
  theme: ThemeMode;
}

export const LogoManager: React.FC<LogoManagerProps> = ({ theme }) => {
  const { logoConfig, setLogoConfig, refreshPortalData } = usePortal();

  // Local editing state initialized with current config
  const [logoType, setLogoType] = useState<LogoDisplayType>(logoConfig.logoType || 'icon');
  const [imageUrl, setImageUrl] = useState<string>(logoConfig.imageUrl || '');
  const [altText, setAltText] = useState<string>(logoConfig.altText || 'IndiChat Logo');
  const [brandText, setBrandText] = useState<string>(logoConfig.brandText || 'IndiChat');
  const [taglineText, setTaglineText] = useState<string>(logoConfig.taglineText || 'Private & Secure Super App');
  const [showBrandText, setShowBrandText] = useState<boolean>(logoConfig.showBrandText !== false);
  const [iconDesign, setIconDesign] = useState<LogoIconDesign>(logoConfig.iconDesign || 'shield_lock');
  const [iconGradient, setIconGradient] = useState<LogoIconGradient>(logoConfig.iconGradient || 'indigo_pink');
  const [shape, setShape] = useState<LogoShape>(logoConfig.shape || 'rounded');
  const [heightPx, setHeightPx] = useState<number>(logoConfig.heightPx || 42);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Loading & Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Preview background toggle
  const [previewTheme, setPreviewTheme] = useState<ThemeMode>(theme);

  // Sync with context if updated externally
  useEffect(() => {
    setLogoType(logoConfig.logoType || 'icon');
    setImageUrl(logoConfig.imageUrl || '');
    setAltText(logoConfig.altText || 'IndiChat Logo');
    setBrandText(logoConfig.brandText || 'IndiChat');
    setTaglineText(logoConfig.taglineText || 'Private & Secure Super App');
    setShowBrandText(logoConfig.showBrandText !== false);
    setIconDesign(logoConfig.iconDesign || 'shield_lock');
    setIconGradient(logoConfig.iconGradient || 'indigo_pink');
    setShape(logoConfig.shape || 'rounded');
    setHeightPx(logoConfig.heightPx || 42);
  }, [logoConfig]);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFeedback({ type: 'error', message: 'Logo file size exceeds 10 MB limit.' });
        return;
      }
      setSelectedFile(file);
      const objUrl = URL.createObjectURL(file);
      setFilePreviewUrl(objUrl);
      setLogoType('image');
      setFeedback(null);
    }
  };

  // Upload file action
  const handleUploadFile = async () => {
    if (!selectedFile) {
      setFeedback({ type: 'error', message: 'Please select an image file first.' });
      return;
    }

    setIsUploading(true);
    setFeedback(null);
    try {
      const formData = new FormData();
      formData.append('logoFile', selectedFile);
      formData.append('altText', altText);
      formData.append('brandText', brandText);
      formData.append('taglineText', taglineText);
      formData.append('showBrandText', String(showBrandText));
      formData.append('shape', shape);
      formData.append('heightPx', String(heightPx));

      const res = await uploadAdminLogoApi(formData);
      setLogoConfig(res.logo);
      setImageUrl(res.logo.imageUrl || '');
      setSelectedFile(null);
      setFilePreviewUrl(null);
      await refreshPortalData();
      setFeedback({
        type: 'success',
        message: `Logo image uploaded and updated across the website!`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload logo image';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsUploading(false);
    }
  };

  // Save current configuration
  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const updates: Partial<WebsiteLogoConfig> = {
        logoType,
        imageUrl: imageUrl.trim(),
        altText: altText.trim(),
        brandText: brandText.trim(),
        taglineText: taglineText.trim(),
        showBrandText,
        iconDesign,
        iconGradient,
        shape,
        heightPx: Number(heightPx),
      };

      const updated = await updateAdminLogoApi(updates);
      setLogoConfig(updated);
      await refreshPortalData();
      setFeedback({
        type: 'success',
        message: 'Website logo updated and activated across the website!',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save logo changes';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default preset
  const handleResetToDefault = async () => {
    if (!window.confirm('Are you sure you want to reset the website logo to the official default IndiChat preset?')) {
      return;
    }

    setIsResetting(true);
    setFeedback(null);
    try {
      const reset = await resetAdminLogoApi();
      setLogoConfig(reset);
      setSelectedFile(null);
      setFilePreviewUrl(null);
      await refreshPortalData();
      setFeedback({
        type: 'success',
        message: 'Website logo has been reset to official default preset.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reset logo';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsResetting(false);
    }
  };

  // Live preview override object
  const previewConfig: WebsiteLogoConfig = {
    ...logoConfig,
    logoType,
    imageUrl: filePreviewUrl || imageUrl,
    altText,
    brandText,
    taglineText,
    showBrandText,
    iconDesign,
    iconGradient,
    shape,
    heightPx,
  };

  return (
    <div id="admin-logo-manager" className="space-y-8 max-w-5xl">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Sparkles size={13} />
            <span>Brand Identity & Header Management</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Website Logo & Branding
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Change or customize the official website logo displayed on the top navigation bar, footer, and mobile screens.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            id="reset-logo-button"
            onClick={handleResetToDefault}
            disabled={isResetting || isSaving || isUploading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/60 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 transition-colors disabled:opacity-50"
          >
            <RotateCcw size={14} className={isResetting ? 'animate-spin' : ''} />
            <span>Reset to Default</span>
          </button>

          <button
            type="button"
            id="save-logo-button"
            onClick={() => handleSaveConfig()}
            disabled={isSaving || isUploading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
          >
            <CheckCircle2 size={14} />
            <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Logo'}</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {feedback && (
        <div
          id="logo-manager-feedback"
          className={`p-4 rounded-xl text-sm flex items-start gap-3 border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
          )}
          <div className="flex-1">
            <span className="font-semibold">{feedback.type === 'success' ? 'Success: ' : 'Error: '}</span>
            {feedback.message}
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* LIVE INTERACTIVE PREVIEW CARD */}
      <div
        id="logo-preview-card"
        className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-lg bg-white dark:bg-[#0c101c]"
      >
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Live Interactive Preview
            </span>
            <span className="text-[11px] text-slate-400">
              (How visitors see your logo in real time)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1">Preview Mode:</span>
            <button
              type="button"
              onClick={() => setPreviewTheme('dark')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                previewTheme === 'dark'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-white'
              }`}
            >
              <Moon size={12} /> Dark
            </button>
            <button
              type="button"
              onClick={() => setPreviewTheme('light')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                previewTheme === 'light'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-white'
              }`}
            >
              <Sun size={12} /> Light
            </button>
          </div>
        </div>

        {/* Mock Top Navbar Preview */}
        <div
          className={`p-6 sm:p-8 transition-colors duration-300 ${
            previewTheme === 'dark' ? 'bg-[#090d16] text-white' : 'bg-slate-50 text-slate-900'
          }`}
        >
          <div className="mb-2 text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Top Header Bar Simulation
          </div>
          <div
            className={`p-4 rounded-xl border flex items-center justify-between backdrop-blur-md ${
              previewTheme === 'dark'
                ? 'bg-white/[0.03] border-white/10'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <BrandLogo
              size="md"
              showText={showBrandText}
              showTagline={true}
              overrideLogo={previewConfig}
            />

            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
              <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Security</span>
              <span className="hover:text-white transition-colors cursor-pointer">Install APK</span>
              <div className="h-4 w-[1px] bg-slate-300 dark:bg-white/20" />
              <button className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-medium text-xs">
                Portal
              </button>
            </div>
          </div>

          {/* Large Hero & Footer Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div
              className={`p-4 rounded-xl border ${
                previewTheme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                Footer Branding Display
              </div>
              <BrandLogo
                size="lg"
                showText={showBrandText}
                showTagline={false}
                overrideLogo={previewConfig}
              />
            </div>

            <div
              className={`p-4 rounded-xl border ${
                previewTheme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                Compact Mobile App Bar
              </div>
              <BrandLogo
                size="sm"
                showText={showBrandText}
                showTagline={false}
                overrideLogo={previewConfig}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TABS FOR LOGO SOURCE TYPE */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
          Choose Logo Mode / Format
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* OPTION 1: Upload Image */}
          <button
            type="button"
            id="tab-logo-image"
            onClick={() => setLogoType('image')}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              logoType === 'image'
                ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 ring-1 ring-indigo-500'
                : 'bg-white dark:bg-[#0c101c] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-indigo-400/50'
            }`}
          >
            <div
              className={`p-2.5 rounded-lg ${
                logoType === 'image' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-white/5'
              }`}
            >
              <Upload size={18} />
            </div>
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-white">Upload Custom Image</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                PNG, SVG, JPG, WebP from your computer
              </div>
            </div>
          </button>

          {/* OPTION 2: Vector Icon Studio */}
          <button
            type="button"
            id="tab-logo-icon"
            onClick={() => setLogoType('icon')}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              logoType === 'icon'
                ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 ring-1 ring-indigo-500'
                : 'bg-white dark:bg-[#0c101c] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-indigo-400/50'
            }`}
          >
            <div
              className={`p-2.5 rounded-lg ${
                logoType === 'icon' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-white/5'
              }`}
            >
              <Palette size={18} />
            </div>
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-white">Vector Icon Studio</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Modern cybersecurity glyphs & gradients
              </div>
            </div>
          </button>

          {/* OPTION 3: Modern Monogram */}
          <button
            type="button"
            id="tab-logo-text"
            onClick={() => setLogoType('text')}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              logoType === 'text'
                ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 ring-1 ring-indigo-500'
                : 'bg-white dark:bg-[#0c101c] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-indigo-400/50'
            }`}
          >
            <div
              className={`p-2.5 rounded-lg ${
                logoType === 'text' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-white/5'
              }`}
            >
              <Type size={18} />
            </div>
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-white">Minimal Monogram</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Bold typographic badge with initials
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* CONTROLS PER LOGO TYPE */}
      {logoType === 'image' && (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-[#0c101c] space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-white/10">
            <Upload className="text-indigo-400" size={18} />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Upload Image File or Link Direct URL
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Direct File Upload */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1. Upload from Computer
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50 dark:bg-white/[0.02]"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg,image/svg+xml,image/webp,image/x-icon"
                  className="hidden"
                  id="logo-file-input"
                />
                <div className="w-12 h-12 mx-auto rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                  <ImageIcon size={22} />
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {selectedFile ? selectedFile.name : 'Click to select logo image'}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Supports SVG, PNG, WebP, JPG, or ICO (Max 10 MB)
                </div>
                {selectedFile && (
                  <div className="mt-2 text-xs font-mono-code text-indigo-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB selected
                  </div>
                )}
              </div>

              {selectedFile && (
                <button
                  type="button"
                  id="upload-now-btn"
                  onClick={handleUploadFile}
                  disabled={isUploading}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Upload size={14} className={isUploading ? 'animate-spin' : ''} />
                  <span>{isUploading ? 'Uploading Image to Server...' : 'Upload & Set as Official Logo'}</span>
                </button>
              )}
            </div>

            {/* External URL alternative */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                2. Or Provide Image URL / Cloud CDN Link
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Link2 size={16} />
                </div>
                <input
                  type="url"
                  id="logo-url-input"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setFilePreviewUrl(null);
                  }}
                  placeholder="https://example.com/branding/indichat-logo.png"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-xs text-slate-400">
                You can paste an external URL from AWS S3, Cloudinary, Imgur, or your content CDN.
              </p>

              {imageUrl && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="truncate max-w-[240px] text-slate-600 dark:text-slate-300 font-mono-code">
                    {imageUrl}
                  </span>
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold flex-shrink-0"
                  >
                    <ExternalLink size={12} /> Test Link
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ICON STUDIO CONTROLS */}
      {logoType === 'icon' && (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-[#0c101c] space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-white/10">
            <Palette className="text-indigo-400" size={18} />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Vector Icon Studio Customization
            </h3>
          </div>

          {/* Icon Design Preset Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Icon Symbol Design
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { id: 'shield_lock', label: 'Shield & Lock', desc: 'Privacy Default' },
                { id: 'chat_bubble', label: 'Chat & Star', desc: 'Social & Messaging' },
                { id: 'lotus_sparkle', label: 'Sparkle Star', desc: 'Modern & Clean' },
                { id: 'radar_privacy', label: 'Radar Signal', desc: 'Broadcast & Shield' },
                { id: 'key_shield', label: 'Crypto Key', desc: 'E2E Encryption' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setIconDesign(item.id as LogoIconDesign)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    iconDesign === item.id
                      ? 'bg-indigo-600/15 border-indigo-500 text-white ring-1 ring-indigo-500'
                      : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 hover:border-indigo-400/50'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-800 dark:text-white">{item.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Gradient Palette Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Gradient Color Palette
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { id: 'indigo_pink', label: 'IndiChat Signature', bg: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500' },
                { id: 'purple_cyan', label: 'Neon Cyber', bg: 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-400' },
                { id: 'emerald_teal', label: 'Emerald Shield', bg: 'bg-gradient-to-r from-emerald-500 to-teal-600' },
                { id: 'sunset_amber', label: 'Sunset Amber', bg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500' },
                { id: 'electric_blue', label: 'Electric Royal', bg: 'bg-gradient-to-r from-blue-600 to-indigo-700' },
                { id: 'monochrome', label: 'High Contrast Mono', bg: 'bg-gradient-to-r from-slate-900 to-black dark:from-white dark:to-slate-300' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setIconGradient(item.id as LogoIconGradient)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    iconGradient === item.id
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                      : 'border-slate-200 dark:border-white/10 hover:border-indigo-400/50'
                  }`}
                >
                  <div className={`w-full h-5 rounded-md mb-2 ${item.bg}`} />
                  <div className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                    {item.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SHAPE & SIZING CONTROLS */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-[#0c101c] space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-white/10">
          <Sliders className="text-indigo-400" size={18} />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Geometry & Sizing Parameters
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shape selection */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Badge & Image Corner Shape
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'rounded', label: 'Rounded Squircle', radius: 'rounded-xl' },
                { id: 'circle', label: 'Full Circle', radius: 'rounded-full' },
                { id: 'square', label: 'Sharp Square', radius: 'rounded-none' },
                { id: 'glow', label: 'Neon Glow', radius: 'rounded-xl ring-2 ring-indigo-500' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setShape(item.id as LogoShape)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    shape === item.id
                      ? 'bg-indigo-600/15 border-indigo-500 text-white ring-1 ring-indigo-500'
                      : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 hover:border-indigo-400/50'
                  }`}
                >
                  <div className={`w-7 h-7 bg-indigo-500 ${item.radius}`} />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Height slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Logo Height
              </label>
              <span className="text-xs font-mono-code font-bold text-indigo-400">
                {heightPx} px
              </span>
            </div>
            <input
              type="range"
              min={28}
              max={64}
              step={2}
              value={heightPx}
              onChange={(e) => setHeightPx(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>28px (Compact)</span>
              <span>42px (Standard Default)</span>
              <span>64px (Large Prominent)</span>
            </div>
          </div>
        </div>
      </div>

      {/* BRAND TEXT & METADATA */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-[#0c101c] space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-white/10">
          <Type className="text-indigo-400" size={18} />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Brand Title & Header Text
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Brand Title
            </label>
            <input
              type="text"
              value={brandText}
              onChange={(e) => setBrandText(e.target.value)}
              placeholder="IndiChat"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Tagline Text (Under Brand)
            </label>
            <input
              type="text"
              value={taglineText}
              onChange={(e) => setTaglineText(e.target.value)}
              placeholder="Private & Secure Super App"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Image Alt Description (SEO & Accessibility)
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="IndiChat Official Logo"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showBrandText}
                onChange={(e) => setShowBrandText(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                Display Brand Name text next to logo symbol
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* FINAL SAVE / COMMIT BANNER */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-base">
            Ready to apply logo changes?
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Clicking Save will immediately update the navbar, mobile menu, and footer for all users without reloading.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSaveConfig()}
          disabled={isSaving || isUploading}
          className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 flex-shrink-0 disabled:opacity-50"
        >
          <CheckCircle2 size={16} />
          <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Logo'}</span>
        </button>
      </div>
    </div>
  );
};
