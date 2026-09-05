export interface SecurityCardItem {
  id: string;
  title: string;
  shortDesc: string;
  iconName: string;
  detailedExplanation: string;
  highlights: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'collection' | 'security' | 'control' | 'account';
}

export interface PolicySection {
  id: string;
  number: number;
  title: string;
  summary: string;
  content: string[];
  subsections?: { title: string; body: string }[];
}

export interface TimelineStep {
  step: number;
  title: string;
  shortDesc: string;
  detailedInfo: string;
  iconName: string;
  tag: string;
}

export type ThemeMode = 'dark' | 'light';

export type PrivacyModeType = 'public' | 'private' | 'custom';

export interface CustomPrivacySettings {
  whoCanView: 'everyone' | 'followers' | 'circle' | 'only_me';
  whoCanInteract: 'allow_all' | 'reactions_only' | 'disabled';
  whoCanMessage: 'anyone' | 'verified_contacts' | 'none';
  whoCanShare: 'allow' | 'disable_forwarding';
}

export interface ContactInfo {
  privacyEmail: string;
  supportEmail: string;
  businessEmail: string;
  phoneNumber: string;
  websiteAddress: string;
  address?: string;
  updatedAt?: string;
}

export interface RegistrationLinkConfig {
  id: string;
  title: string;
  destinationUrl: string;
  isEnabled: boolean;
  description: string;
  openInNewTab: boolean;
  updatedAt?: string;
}

export type SocialPlatform =
  | 'instagram'
  | 'facebook'
  | 'x'
  | 'youtube'
  | 'telegram'
  | 'linkedin'
  | 'whatsapp'
  | 'discord'
  | 'custom';

export interface SocialLinkItem {
  id: string;
  platform: SocialPlatform;
  platformName: string;
  profileUrl: string;
  handle?: string;
  isEnabled: boolean;
  order: number;
  customIconName?: string;
  updatedAt?: string;
}

export type LogoDisplayType = 'image' | 'icon' | 'text';
export type LogoShape = 'rounded' | 'square' | 'circle' | 'glow';
export type LogoIconDesign = 'shield_lock' | 'chat_bubble' | 'lotus_sparkle' | 'radar_privacy' | 'key_shield';
export type LogoIconGradient =
  | 'indigo_pink'
  | 'purple_cyan'
  | 'emerald_teal'
  | 'sunset_amber'
  | 'electric_blue'
  | 'monochrome';

export interface WebsiteLogoConfig {
  logoType: LogoDisplayType;
  imageUrl?: string;
  fileName?: string;
  fileSizeBytes?: number;
  altText: string;
  brandText: string;
  taglineText?: string;
  showBrandText: boolean;
  iconDesign: LogoIconDesign;
  iconGradient: LogoIconGradient;
  shape: LogoShape;
  heightPx: number;
  updatedAt?: string;
}

export interface WebsiteSettings {
  siteTitle: string;
  siteTagline: string;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  securityBannerText: string;
  updatedAt?: string;
  siteName?: string;
  tagline?: string;
  allowRegistration?: boolean;
  announcementBanner?: string;
  logo?: WebsiteLogoConfig;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeSessions?: number;
  enabledSocialLinksCount?: number;
  isCustomRegEnabled?: boolean;
  systemHealth?: string;
  lastUpdated?: string;
  enabledSocials?: number;
  pendingInquiries?: number;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
}

export type ApkDisplayStatus = 'active' | 'paused' | 'hidden';

export interface ApkConfig {
  id: string;
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  fileName: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  sha256?: string;
  releaseNotes: string;
  downloadUrl: string;
  directDownloadEnabled: boolean;
  displayStatus: ApkDisplayStatus;
  minAndroidVersion: string;
  downloadCount: number;
  uploadedAt: string;
  updatedAt: string;
  sourceType: 'uploaded' | 'external_url';
  externalUrl?: string;
}

export interface UserGrowthPoint {
  date: string;
  label: string;
  totalUsers: number;
  newRegistrations: number;
  activeSessions: number;
}

export interface RecentActivityPoint {
  date: string;
  label: string;
  adminActions: number;
  securityEvents: number;
  apkDownloads: number;
  totalEvents: number;
}

export interface ActivityCategoryBreakdown {
  category: string;
  count: number;
  color: string;
}

export interface AdminAnalyticsData {
  timeRange: string;
  growthTimeline: UserGrowthPoint[];
  activityTimeline: RecentActivityPoint[];
  categoryBreakdown: ActivityCategoryBreakdown[];
  summary: {
    totalUsers: number;
    growthRatePct: number;
    peakActivityDay: string;
    totalRecentActions: number;
    avgDailyRegistrations: number;
    apkDownloads: number;
  };
}
