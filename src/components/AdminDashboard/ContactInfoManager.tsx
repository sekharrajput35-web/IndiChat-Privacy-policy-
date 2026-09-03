import React, { useState } from 'react';
import { ThemeMode, ContactInfo } from '../../types';
import { updateContactInfoApi } from '../../services/api';
import { usePortal } from '../../context/PortalContext';
import { Mail, Phone, Globe, MapPin, Save, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';

interface ContactInfoManagerProps {
  theme: ThemeMode;
  initialInfo: ContactInfo;
  onUpdated: (info: ContactInfo) => void;
}

export const ContactInfoManager: React.FC<ContactInfoManagerProps> = ({
  theme,
  initialInfo,
  onUpdated,
}) => {
  const { refreshPortalData } = usePortal();

  const [privacyEmail, setPrivacyEmail] = useState(initialInfo.privacyEmail || 'privacy@indichat.com');
  const [supportEmail, setSupportEmail] = useState(initialInfo.supportEmail || 'support@indichat.com');
  const [businessEmail, setBusinessEmail] = useState(initialInfo.businessEmail || 'business@indichat.com');
  const [phoneNumber, setPhoneNumber] = useState(initialInfo.phoneNumber || '+91 98765 43210');
  const [websiteAddress, setWebsiteAddress] = useState(initialInfo.websiteAddress || 'https://indichat.com');
  const [address, setAddress] = useState(
    initialInfo.address || 'IndiChat Technologies Inc., Level 4 Cyber Horizon, Tech Hub, Bangalore 560103'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!privacyEmail.trim() || !privacyEmail.includes('@')) {
      setFeedback({ type: 'error', message: 'A valid Privacy Email address is required.' });
      return;
    }

    if (!supportEmail.trim() || !supportEmail.includes('@')) {
      setFeedback({ type: 'error', message: 'A valid Support Email address is required.' });
      return;
    }

    setIsLoading(true);
    try {
      const updated = await updateContactInfoApi({
        privacyEmail: privacyEmail.trim(),
        supportEmail: supportEmail.trim(),
        businessEmail: businessEmail.trim(),
        phoneNumber: phoneNumber.trim(),
        websiteAddress: websiteAddress.trim(),
        address: address.trim(),
      });

      onUpdated(updated);
      await refreshPortalData();
      setFeedback({
        type: 'success',
        message: 'Contact information updated successfully! Public website sections (footer, policy, modals) are now updated.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update contact info';
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
            <Mail className="w-3.5 h-3.5" />
            <span>Corporate Communication Channels</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Contact Information Management
          </h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Update official emails, support numbers, and website addresses displayed across the public portal.
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
            <span className="font-semibold block">
              {feedback.type === 'success' ? 'Changes Published' : 'Validation Error'}
            </span>
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div
          className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border space-y-6 ${
            theme === 'dark' ? 'bg-[#0f1424] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          {/* Email addresses grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Privacy Email */}
            <div>
              <label
                htmlFor="input-admin-privacy-email"
                className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Privacy Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 text-purple-400" />
                </div>
                <input
                  id="input-admin-privacy-email"
                  type="email"
                  value={privacyEmail}
                  onChange={(e) => setPrivacyEmail(e.target.value)}
                  placeholder="privacy@indichat.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-mono-code focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-600'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                  required
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Used in Section 9 of Privacy Policy & DPO inquiries
              </span>
            </div>

            {/* Support Email */}
            <div>
              <label
                htmlFor="input-admin-support-email"
                className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Support Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 text-indigo-400" />
                </div>
                <input
                  id="input-admin-support-email"
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="support@indichat.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-mono-code focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-600'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                  required
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                General customer assistance & support tickets
              </span>
            </div>

            {/* Business Email */}
            <div>
              <label
                htmlFor="input-admin-business-email"
                className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Business Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4 text-pink-400" />
                </div>
                <input
                  id="input-admin-business-email"
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  placeholder="business@indichat.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-mono-code focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-600'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Partnerships, enterprise & press inquiries
              </span>
            </div>
          </div>

          {/* Phone & Website Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Contact Phone Number */}
            <div>
              <label
                htmlFor="input-admin-phone"
                className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Contact Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
                <input
                  id="input-admin-phone"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210 or 1-800-555-INDI"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-mono-code focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-600'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Toll-free or regional hotline shown in contact modal
              </span>
            </div>

            {/* Website Address */}
            <div>
              <label
                htmlFor="input-admin-website"
                className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Website Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4 text-cyan-400" />
                </div>
                <input
                  id="input-admin-website"
                  type="text"
                  value={websiteAddress}
                  onChange={(e) => setWebsiteAddress(e.target.value)}
                  placeholder="https://indichat.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-mono-code focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-600'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Primary portal root URL
              </span>
            </div>
          </div>

          {/* Physical Address */}
          <div>
            <label
              htmlFor="input-admin-address"
              className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Corporate Headquarters Address
            </label>
            <div className="relative">
              <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4 text-amber-400" />
              </div>
              <textarea
                id="input-admin-address"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Corporate headquarters physical address"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#07090e] border-white/10 text-white placeholder:text-slate-600'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Live Public Website Preview Card */}
        <div
          className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border ${
            theme === 'dark' ? 'bg-[#0b0e18] border-white/10' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">
            Live Public Website Appearance Preview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-white/5 dark:border-white/5 bg-white/5 dark:bg-white/5">
              <span className="text-slate-400 block mb-1">Privacy Officer Email:</span>
              <span className="font-mono-code font-bold text-purple-400">{privacyEmail}</span>
            </div>
            <div className="p-3 rounded-xl border border-white/5 dark:border-white/5 bg-white/5 dark:bg-white/5">
              <span className="text-slate-400 block mb-1">User Support Email:</span>
              <span className="font-mono-code font-bold text-indigo-400">{supportEmail}</span>
            </div>
            <div className="p-3 rounded-xl border border-white/5 dark:border-white/5 bg-white/5 dark:bg-white/5">
              <span className="text-slate-400 block mb-1">Support Hotline:</span>
              <span className="font-mono-code font-bold text-emerald-400">{phoneNumber || 'Not configured'}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            id="btn-save-contact-info"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-60 min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Publishing Changes...' : 'Save & Publish Contact Info'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
