import React, { useState } from 'react';
import { ThemeMode, SocialLinkItem, SocialPlatform } from '../../types';
import {
  addSocialLinkApi,
  updateSocialLinkApi,
  deleteSocialLinkApi,
  toggleSocialLinkApi,
} from '../../services/api';
import { usePortal } from '../../context/PortalContext';
import { SocialPlatformIcon } from '../SocialIcons';
import {
  Share2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Power,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Globe,
} from 'lucide-react';

interface SocialLinksManagerProps {
  theme: ThemeMode;
  initialLinks: SocialLinkItem[];
  onUpdated: (links: SocialLinkItem[]) => void;
}

const SUPPORTED_PLATFORMS: { key: SocialPlatform; name: string }[] = [
  { key: 'instagram', name: 'Instagram' },
  { key: 'facebook', name: 'Facebook' },
  { key: 'x', name: 'X (formerly Twitter)' },
  { key: 'youtube', name: 'YouTube' },
  { key: 'telegram', name: 'Telegram' },
  { key: 'linkedin', name: 'LinkedIn' },
  { key: 'whatsapp', name: 'WhatsApp Channel' },
  { key: 'discord', name: 'Discord' },
  { key: 'custom', name: 'Custom Social Link' },
];

export const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({
  theme,
  initialLinks,
  onUpdated,
}) => {
  const { refreshPortalData } = usePortal();

  const [links, setLinks] = useState<SocialLinkItem[]>(initialLinks);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal states: 'none' | 'add' | 'edit'
  const [modalMode, setModalMode] = useState<'none' | 'add' | 'edit'>('none');
  const [editingLink, setEditingLink] = useState<SocialLinkItem | null>(null);

  // Form states for Add/Edit
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [platformName, setPlatformName] = useState('Instagram');
  const [profileUrl, setProfileUrl] = useState('');
  const [handle, setHandle] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<SocialLinkItem | null>(null);

  const openAddModal = () => {
    setPlatform('instagram');
    setPlatformName('Instagram');
    setProfileUrl('');
    setHandle('');
    setIsEnabled(true);
    setEditingLink(null);
    setModalMode('add');
    setFeedback(null);
  };

  const openEditModal = (item: SocialLinkItem) => {
    setEditingLink(item);
    setPlatform(item.platform);
    setPlatformName(item.platformName);
    setProfileUrl(item.profileUrl);
    setHandle(item.handle || '');
    setIsEnabled(item.isEnabled);
    setModalMode('edit');
    setFeedback(null);
  };

  const handlePlatformSelect = (p: SocialPlatform) => {
    setPlatform(p);
    const found = SUPPORTED_PLATFORMS.find((sp) => sp.key === p);
    if (found) {
      setPlatformName(found.name);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const updated = await toggleSocialLinkApi(id);
      const nextLinks = links.map((l) => (l.id === id ? updated : l));
      setLinks(nextLinks);
      onUpdated(nextLinks);
      await refreshPortalData();
      setFeedback({
        type: 'success',
        message: `${updated.platformName} is now ${updated.isEnabled ? 'ENABLED' : 'DISABLED'} on the public website.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to toggle link status';
      setFeedback({ type: 'error', message: msg });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteSocialLinkApi(deleteTarget.id);
      const nextLinks = links.filter((l) => l.id !== deleteTarget.id);
      setLinks(nextLinks);
      onUpdated(nextLinks);
      await refreshPortalData();
      setFeedback({
        type: 'success',
        message: `${deleteTarget.platformName} removed successfully.`,
      });
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete social link';
      setFeedback({ type: 'error', message: msg });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileUrl.trim()) {
      setFeedback({ type: 'error', message: 'Profile URL is required.' });
      return;
    }

    try {
      new URL(profileUrl.trim());
    } catch {
      setFeedback({
        type: 'error',
        message: 'Please provide a valid URL format including https:// (e.g. https://instagram.com/myprofile)',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalMode === 'add') {
        const created = await addSocialLinkApi({
          platform,
          platformName: platformName.trim(),
          profileUrl: profileUrl.trim(),
          handle: handle.trim() || undefined,
          isEnabled,
          order: links.length + 1,
        });
        const nextLinks = [...links, created];
        setLinks(nextLinks);
        onUpdated(nextLinks);
        setFeedback({
          type: 'success',
          message: `${created.platformName} channel added successfully!`,
        });
      } else if (modalMode === 'edit' && editingLink) {
        const updated = await updateSocialLinkApi(editingLink.id, {
          platform,
          platformName: platformName.trim(),
          profileUrl: profileUrl.trim(),
          handle: handle.trim() || undefined,
          isEnabled,
        });
        const nextLinks = links.map((l) => (l.id === editingLink.id ? updated : l));
        setLinks(nextLinks);
        onUpdated(nextLinks);
        setFeedback({
          type: 'success',
          message: `${updated.platformName} channel updated successfully!`,
        });
      }

      await refreshPortalData();
      setModalMode('none');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save social link';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const enabledCount = links.filter((l) => l.isEnabled).length;

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Share2 className="w-3.5 h-3.5" />
            <span>Community Channels Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Social Media Links</h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage public community links. Only enabled links appear in the "Connect With IndiChat" section.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            {enabledCount} of {links.length} Enabled
          </div>

          <button
            type="button"
            id="btn-admin-add-social-link"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 transition-all shadow-lg shadow-indigo-600/30 min-h-[40px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Social Link</span>
          </button>
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
            <span className="font-semibold block">{feedback.type === 'success' ? 'Updated' : 'Error'}</span>
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Social Links List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((link) => (
          <div
            key={link.id}
            id={`admin-social-item-${link.id}`}
            className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
              link.isEnabled
                ? theme === 'dark'
                  ? 'bg-[#0f1424] border-white/10 shadow-lg'
                  : 'bg-white border-slate-200 shadow-sm'
                : theme === 'dark'
                ? 'bg-[#0a0d16]/60 border-white/5 opacity-75'
                : 'bg-slate-100/70 border-slate-200 opacity-75'
            }`}
          >
            {/* Top row: Icon, Name, Toggle */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                    theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <SocialPlatformIcon platform={link.platform} className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base truncate">{link.platformName}</h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono-code uppercase font-semibold ${
                        link.isEnabled
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}
                    >
                      {link.isEnabled ? 'Live on Site' : 'Disabled'}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {link.handle || 'Official Channel'}
                  </p>
                </div>
              </div>

              {/* Enable/Disable Toggle */}
              <button
                type="button"
                id={`btn-toggle-social-${link.id}`}
                onClick={() => handleToggle(link.id)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  link.isEnabled ? 'bg-indigo-600' : 'bg-slate-600'
                }`}
                title={link.isEnabled ? 'Click to disable' : 'Click to enable'}
                aria-label={`Toggle ${link.platformName}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    link.isEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Profile URL snippet */}
            <div className="my-2 p-2.5 rounded-xl bg-black/20 dark:bg-black/40 border border-white/5 font-mono-code text-xs truncate flex items-center justify-between gap-2">
              <span className="truncate text-slate-400">{link.profileUrl}</span>
              <a
                href={link.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 p-1 flex-shrink-0"
                title="Open official URL"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Bottom Actions: Edit & Delete */}
            <div className="pt-3 border-t border-white/5 dark:border-white/5 flex items-center justify-end gap-2">
              <button
                type="button"
                id={`btn-edit-social-${link.id}`}
                onClick={() => openEditModal(link)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  theme === 'dark'
                    ? 'border-white/10 hover:bg-white/10 text-slate-300'
                    : 'border-slate-300 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                id={`btn-delete-social-${link.id}`}
                onClick={() => setDeleteTarget(link)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {modalMode !== 'none' && (
        <div
          id="modal-social-editor-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in"
          onClick={() => setModalMode('none')}
        >
          <div
            id="modal-social-editor-card"
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-md rounded-3xl border shadow-2xl p-6 sm:p-8 ${
              theme === 'dark'
                ? 'bg-[#0f1424] border-white/10 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <button
              type="button"
              onClick={() => setModalMode('none')}
              className="absolute top-5 right-5 p-2 rounded-full border border-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <SocialPlatformIcon platform={platform} className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">
                  {modalMode === 'add' ? 'Add Social Media Link' : 'Edit Social Media Link'}
                </h3>
                <p className="text-xs text-slate-400">Configure platform details and official handle</p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Select Platform */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Platform
                </label>
                <select
                  id="select-social-platform"
                  value={platform}
                  onChange={(e) => handlePlatformSelect(e.target.value as SocialPlatform)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark'
                      ? 'bg-[#07090e] border-white/10 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  {SUPPORTED_PLATFORMS.map((sp) => (
                    <option key={sp.key} value={sp.key}>
                      {sp.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Platform Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  id="input-social-platform-name"
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  placeholder="e.g. Instagram, WhatsApp Channel, Discord"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark'
                      ? 'bg-[#07090e] border-white/10 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  required
                />
              </div>

              {/* Profile URL */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Official Profile URL *
                </label>
                <input
                  id="input-social-profile-url"
                  type="url"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  placeholder="https://..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono-code focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark'
                      ? 'bg-[#07090e] border-white/10 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  required
                />
              </div>

              {/* Handle */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Account Handle or Tagline
                </label>
                <input
                  id="input-social-handle"
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="e.g. @indichatapp or Official Channel"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark'
                      ? 'bg-[#07090e] border-white/10 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Enable Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 dark:bg-black/40 border border-white/5">
                <span className="text-xs font-semibold">Enable link on public website</span>
                <input
                  id="checkbox-social-enable"
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalMode('none')}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/10 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Saving...' : 'Save Channel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteTarget && (
        <div
          id="modal-delete-social-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            id="modal-delete-social-card"
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm rounded-3xl border shadow-2xl p-6 text-center space-y-4 ${
              theme === 'dark' ? 'bg-[#0f1424] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Remove Social Channel?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to delete <strong>{deleteTarget.platformName}</strong>? It will no longer appear on the website.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-white/10 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-delete-social"
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30"
              >
                Delete Channel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
