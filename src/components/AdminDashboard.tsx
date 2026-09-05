import React, { useState, useEffect } from 'react';
import { ThemeMode, RegistrationLinkConfig, ContactInfo, SocialLinkItem, WebsiteSettings, AdminStats, AdminAuditLog } from '../types';
import { usePortal } from '../context/PortalContext';
import {
  verifyAdminApi,
  logoutAdminApi,
  authStorage,
  getAdminStatsApi,
  getAdminAuditLogsApi,
} from '../services/api';
import {
  LayoutDashboard,
  Globe,
  Link2,
  Mail,
  Share2,
  FileText,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  ArrowLeft,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Smartphone,
  Image as ImageIcon,
  TrendingUp,
} from 'lucide-react';

// Subcomponents
import { DashboardOverview } from './AdminDashboard/DashboardOverview';
import { AdminAnalyticsChart } from './AdminDashboard/AdminAnalyticsChart';
import { ApkReleaseManager } from './AdminDashboard/ApkReleaseManager';
import { LogoManager } from './AdminDashboard/LogoManager';
import { WebsiteLinksManager } from './AdminDashboard/WebsiteLinksManager';
import { RegistrationLinkManager } from './AdminDashboard/RegistrationLinkManager';
import { ContactInfoManager } from './AdminDashboard/ContactInfoManager';
import { SocialLinksManager } from './AdminDashboard/SocialLinksManager';
import { PrivacyPolicyManager } from './AdminDashboard/PrivacyPolicyManager';
import { SecurityContentManager } from './AdminDashboard/SecurityContentManager';
import { WebsiteSettingsManager } from './AdminDashboard/WebsiteSettingsManager';

interface AdminDashboardProps {
  theme: ThemeMode;
  onNavigateHome: () => void;
  onAdminLogout: () => void;
}

type AdminTab =
  | 'dashboard'
  | 'analytics'
  | 'logo'
  | 'apk'
  | 'links'
  | 'registration'
  | 'contact'
  | 'social'
  | 'policy'
  | 'security'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  theme,
  onNavigateHome,
  onAdminLogout,
}) => {
  const {
    registrationLink,
    setRegistrationLink,
    contactInfo,
    setContactInfo,
    socialLinks,
    setSocialLinks,
    websiteSettings,
    setWebsiteSettings,
    refreshPortalData,
  } = usePortal();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Admin stats and audit logs from server
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, enabledSocials: 0, pendingInquiries: 0 });
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);

  // Verify server-side authorization on mount
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      setIsVerifyingAuth(true);
      const token = authStorage.getAdminToken();
      if (!token) {
        if (isMounted) {
          setAuthError('Unauthorized. Please log in with administrator credentials.');
          setIsVerifyingAuth(false);
          onAdminLogout();
        }
        return;
      }

      try {
        const verifyRes = await verifyAdminApi();
        if (verifyRes.valid) {
          // Fetch initial admin stats & logs
          try {
            const [fetchedStats, fetchedLogs] = await Promise.all([
              getAdminStatsApi(),
              getAdminAuditLogsApi(),
            ]);
            if (isMounted) {
              setStats(fetchedStats);
              setAuditLogs(fetchedLogs);
            }
          } catch {
            // non-fatal
          }
        } else {
          authStorage.clearAdminToken();
          if (isMounted) onAdminLogout();
        }
      } catch {
        authStorage.clearAdminToken();
        if (isMounted) {
          setAuthError('Administrator session expired or invalid.');
          onAdminLogout();
        }
      } finally {
        if (isMounted) setIsVerifyingAuth(false);
      }
    };

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [onAdminLogout]);

  const handleLogout = async () => {
    try {
      await logoutAdminApi();
    } catch {
      // clear local token regardless
    } finally {
      authStorage.clearAdminToken();
      onAdminLogout();
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics & Growth', icon: TrendingUp },
    { id: 'logo', label: 'Logo & Branding', icon: ImageIcon },
    { id: 'apk', label: 'APK Management', icon: Smartphone },
    { id: 'links', label: 'Website Links', icon: Globe },
    { id: 'registration', label: 'Registration Link', icon: Link2 },
    { id: 'contact', label: 'Contact Information', icon: Mail },
    { id: 'social', label: 'Social Media Links', icon: Share2 },
    { id: 'policy', label: 'Privacy Policy', icon: FileText },
    { id: 'security', label: 'Security Content', icon: ShieldCheck },
    { id: 'settings', label: 'Website Settings', icon: Settings },
  ] as const;

  if (isVerifyingAuth) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center p-6 ${
          theme === 'dark' ? 'bg-[#060810] text-white' : 'bg-slate-50 text-slate-900'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white mb-4 animate-spin shadow-lg shadow-indigo-600/30">
          <Shield className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold tracking-wide">
          Verifying cryptographic server credentials...
        </p>
      </div>
    );
  }

  return (
    <div
      id="admin-dashboard-container"
      className={`min-h-screen flex transition-colors ${
        theme === 'dark' ? 'bg-[#07090e] text-slate-100' : 'bg-slate-100/90 text-slate-900'
      }`}
    >
      {/* MOBILE SIDEBAR OVERLAY BACKDROP */}
      {isMobileSidebarOpen && (
        <div
          id="admin-mobile-backdrop"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR (Desktop Fixed / Mobile Drawer) */}
      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col border-r transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          theme === 'dark'
            ? 'bg-[#0b0e18] border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-xl lg:shadow-none'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-6 border-b border-white/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-[2px] shadow-lg shadow-indigo-600/30">
              <div
                className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                  theme === 'dark' ? 'bg-[#080b14]' : 'bg-white'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <span className="font-display font-extrabold text-lg tracking-tight block">
                IndiChat
              </span>
              <span className="text-[10px] uppercase font-mono-code font-bold tracking-wider text-indigo-400">
                Admin CMS
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            id="btn-close-admin-mobile-menu"
            type="button"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-2 rounded-xl lg:hidden text-slate-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation Options */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto" aria-label="Admin Sections">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                type="button"
                onClick={() => {
                  setActiveTab(item.id as AdminTab);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-pink-600/10 text-indigo-400 border border-indigo-500/30 shadow-md shadow-indigo-600/10'
                    : theme === 'dark'
                    ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-indigo-400' : 'text-slate-400'
                  }`}
                />
                <span className="truncate flex-1 text-left">{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: Return to Public Site & Logout */}
        <div className="p-4 border-t border-white/10 dark:border-white/10 space-y-2">
          <button
            id="btn-admin-return-portal"
            type="button"
            onClick={onNavigateHome}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              theme === 'dark'
                ? 'text-slate-400 hover:text-white hover:bg-white/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Public Website</span>
          </button>

          <button
            id="btn-admin-sidebar-logout"
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header
          id="admin-topbar"
          className={`h-16 px-4 sm:px-8 border-b flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl ${
            theme === 'dark'
              ? 'bg-[#07090e]/80 border-white/10 text-white'
              : 'bg-white/80 border-slate-200 text-slate-900 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger toggle for Admin Sidebar */}
            <button
              id="btn-admin-hamburger-open"
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl border border-white/10 lg:hidden text-slate-300 hover:text-white"
              aria-label="Open administration sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:block">
              <span className="text-xs font-semibold text-slate-400">Section:</span>
              <span className="ml-1.5 text-xs font-bold text-indigo-400 capitalize">
                {navItems.find((n) => n.id === activeTab)?.label}
              </span>
            </div>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Refresh Data */}
            <button
              type="button"
              id="btn-admin-refresh-data"
              onClick={() => refreshPortalData()}
              className={`p-2 rounded-xl border text-xs font-semibold transition-colors ${
                theme === 'dark'
                  ? 'border-white/10 hover:bg-white/5 text-slate-300'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
              title="Refresh database records"
              aria-label="Refresh database records"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* View Live Public Site */}
            <button
              type="button"
              id="btn-admin-view-live-site"
              onClick={onNavigateHome}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-500/30 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </button>

            {/* Admin Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/10 dark:border-white/10">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                A
              </div>
              <span className="hidden md:block text-xs font-semibold">Super Admin</span>
            </div>
          </div>
        </header>

        {/* Tab View Container */}
        <main id="admin-main-view" className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              theme={theme}
              stats={stats}
              auditLogs={auditLogs}
              registrationLink={registrationLink}
              contactInfo={contactInfo}
              socialLinks={socialLinks}
              onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
            />
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <AdminAnalyticsChart
                theme={theme}
                initialRange="30d"
                onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
              />
            </div>
          )}

          {activeTab === 'logo' && <LogoManager theme={theme} />}

          {activeTab === 'apk' && <ApkReleaseManager />}

          {activeTab === 'links' && (
            <WebsiteLinksManager theme={theme} onNavigateHome={onNavigateHome} />
          )}

          {activeTab === 'registration' && (
            <RegistrationLinkManager
              theme={theme}
              initialConfig={registrationLink}
              onUpdated={(cfg) => setRegistrationLink(cfg)}
            />
          )}

          {activeTab === 'contact' && (
            <ContactInfoManager
              theme={theme}
              initialInfo={contactInfo}
              onUpdated={(info) => setContactInfo(info)}
            />
          )}

          {activeTab === 'social' && (
            <SocialLinksManager
              theme={theme}
              initialLinks={socialLinks}
              onUpdated={(links) => setSocialLinks(links)}
            />
          )}

          {activeTab === 'policy' && <PrivacyPolicyManager theme={theme} />}

          {activeTab === 'security' && <SecurityContentManager theme={theme} />}

          {activeTab === 'settings' && (
            <WebsiteSettingsManager
              theme={theme}
              initialSettings={websiteSettings}
              onUpdated={(s) => setWebsiteSettings(s)}
            />
          )}
        </main>
      </div>
    </div>
  );
};
