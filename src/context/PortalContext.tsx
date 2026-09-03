import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ContactInfo, RegistrationLinkConfig, SocialLinkItem, WebsiteSettings, UserAccount, ApkConfig, WebsiteLogoConfig } from '../types';
import { fetchPublicData, authStorage } from '../services/api';

export const defaultLogoConfig: WebsiteLogoConfig = {
  logoType: 'icon',
  imageUrl: '',
  fileName: '',
  fileSizeBytes: 0,
  altText: 'IndiChat Logo',
  brandText: 'IndiChat',
  taglineText: 'Private & Secure Super App',
  showBrandText: true,
  iconDesign: 'shield_lock',
  iconGradient: 'indigo_pink',
  shape: 'rounded',
  heightPx: 42,
  updatedAt: new Date().toISOString(),
};

interface PortalContextType {
  contactInfo: ContactInfo;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo>>;
  registrationLink: RegistrationLinkConfig;
  setRegistrationLink: React.Dispatch<React.SetStateAction<RegistrationLinkConfig>>;
  socialLinks: SocialLinkItem[];
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLinkItem[]>>;
  settings: WebsiteSettings;
  websiteSettings: WebsiteSettings;
  setWebsiteSettings: React.Dispatch<React.SetStateAction<WebsiteSettings>>;
  apkConfig: ApkConfig;
  setApkConfig: React.Dispatch<React.SetStateAction<ApkConfig>>;
  logoConfig: WebsiteLogoConfig;
  setLogoConfig: React.Dispatch<React.SetStateAction<WebsiteLogoConfig>>;
  currentUser: UserAccount | null;
  isLoading: boolean;
  error: string | null;
  refreshPortalData: () => Promise<void>;
  setCurrentUser: (user: UserAccount | null) => void;
  logoutUser: () => void;
}

const defaultContactInfo: ContactInfo = {
  privacyEmail: 'privacy@indichat.com',
  supportEmail: 'support@indichat.com',
  businessEmail: 'business@indichat.com',
  phoneNumber: '+91 98765 43210',
  websiteAddress: 'https://indichat.com',
  address: 'IndiChat Technologies Inc., Level 4 Cyber Horizon, Tech Hub, Bangalore 560103',
};

const defaultRegistrationLink: RegistrationLinkConfig = {
  id: 'reg-link-primary',
  title: 'IndiChat Super App Early Access & Portal',
  destinationUrl: 'https://indichat.com/join',
  isEnabled: false,
  description: 'Official registration portal for new IndiChat super app community accounts',
  openInNewTab: true,
};

const defaultSettings: WebsiteSettings = {
  siteTitle: 'IndiChat Privacy & Security',
  siteTagline: 'Everything You Love. One App You Trust.',
  maintenanceMode: false,
  allowNewRegistrations: true,
  securityBannerText: 'End-to-end encrypted chats, reels, live streams and privacy-first commerce',
  logo: defaultLogoConfig,
};

const defaultApkConfig: ApkConfig = {
  id: 'apk-release-official',
  appName: 'IndiChat: Private & Secure Super App',
  packageName: 'com.indichat.app',
  versionName: 'v2.4.1',
  versionCode: 24,
  fileName: 'IndiChat-v2.4.1.apk',
  fileSizeBytes: 28416480,
  fileSizeFormatted: '27.1 MB',
  sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  releaseNotes: '• End-to-end encrypted messaging & crystal audio/video calls\n• Zero-telemetry private reels & ephemeral stories\n• Screenshot-protected media with forward restrictions\n• Ultra-low latency and battery optimization for all Android devices',
  downloadUrl: '/api/apk/download',
  directDownloadEnabled: true,
  displayStatus: 'active',
  minAndroidVersion: 'Android 8.0 (Oreo) or later',
  downloadCount: 1420,
  uploadedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sourceType: 'uploaded',
  externalUrl: '',
};

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [registrationLink, setRegistrationLink] = useState<RegistrationLinkConfig>(defaultRegistrationLink);
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [apkConfig, setApkConfig] = useState<ApkConfig>(defaultApkConfig);
  const [logoConfig, setLogoConfig] = useState<WebsiteLogoConfig>(defaultLogoConfig);
  const [currentUser, setCurrentUserState] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize user from storage
  useEffect(() => {
    const stored = authStorage.getUserData();
    if (stored && authStorage.getUserToken()) {
      setCurrentUserState(stored);
    }
  }, []);

  const refreshPortalData = useCallback(async () => {
    try {
      const data = await fetchPublicData();
      if (data) {
        if (data.contactInfo) setContactInfo(data.contactInfo);
        if (data.registrationLink) setRegistrationLink(data.registrationLink);
        if (Array.isArray(data.socialLinks)) setSocialLinks(data.socialLinks);
        if (data.settings) {
          setSettings(data.settings);
          if (data.settings.logo) {
            setLogoConfig(data.settings.logo);
          }
        }
        if (data.logo) setLogoConfig(data.logo);
        if (data.apkConfig) setApkConfig(data.apkConfig);
      }
      setError(null);
    } catch (err) {
      console.warn('Could not fetch dynamic public data, falling back to cached/defaults:', err);
      // Don't blow up app if network hiccup
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPortalData();
  }, [refreshPortalData]);

  const setCurrentUser = (user: UserAccount | null) => {
    setCurrentUserState(user);
    if (user) {
      authStorage.setUserData(user);
    } else {
      authStorage.removeUserToken();
    }
  };

  const logoutUser = () => {
    authStorage.removeUserToken();
    setCurrentUserState(null);
  };

  return (
    <PortalContext.Provider
      value={{
        contactInfo,
        setContactInfo,
        registrationLink,
        setRegistrationLink,
        socialLinks,
        setSocialLinks,
        settings,
        websiteSettings: settings,
        setWebsiteSettings: setSettings,
        apkConfig,
        setApkConfig,
        logoConfig,
        setLogoConfig,
        currentUser,
        isLoading,
        error,
        refreshPortalData,
        setCurrentUser,
        logoutUser,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = (): PortalContextType => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
