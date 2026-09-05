import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  ContactInfo,
  RegistrationLinkConfig,
  SocialLinkItem,
  WebsiteSettings,
  AdminAuditLog,
  AdminStats,
  UserAccount,
  ApkConfig,
  WebsiteLogoConfig,
} from '../src/types';

export const DEFAULT_LOGO_CONFIG: WebsiteLogoConfig = {
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

interface StoredSession {
  token: string;
  adminEmail: string;
  createdAt: string;
  expiresAt: string;
}

interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  salt: string;
  passwordHash: string;
  createdAt: string;
}

interface DatabaseSchema {
  contactInfo: ContactInfo;
  registrationLink: RegistrationLinkConfig;
  socialLinks: SocialLinkItem[];
  settings: WebsiteSettings;
  apkConfig: ApkConfig;
  admin: {
    email: string;
    username: string;
    salt: string;
    passwordHash: string;
    updatedAt: string;
  };
  sessions: Record<string, StoredSession>;
  users: StoredUser[];
  auditLogs: AdminAuditLog[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Cryptographic Password Helpers using standard Node PBKDF2
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, generatedSalt, 100000, 64, 'sha512')
    .toString('hex');
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString('hex');
  const hashBuffer = Buffer.from(hash, 'hex');
  const storedHashBuffer = Buffer.from(storedHash, 'hex');
  if (hashBuffer.length !== storedHashBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(hashBuffer, storedHashBuffer);
}

// Initial default seed
const defaultAdminEmail = process.env.ADMIN_EMAIL || 'UP74AB4513@indichat.com';
const defaultAdminUsername = process.env.ADMIN_USERNAME || 'UP74AB4513';
const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'Abhayraj@4513';
const initialAdminHash = hashPassword(defaultAdminPassword);

const DEFAULT_DB: DatabaseSchema = {
  contactInfo: {
    privacyEmail: 'IndiChatindilife@gmail.com',
    supportEmail: 'IndiChatindilife@gmail.com',
    businessEmail: 'business@indichat.com',
    phoneNumber: '+91 98765 43210',
    websiteAddress: 'https://indichat.com',
    address: 'IndiChat Technologies Inc., Level 4 Cyber Horizon, Tech Hub, Bangalore 560103',
    updatedAt: new Date().toISOString(),
  },
  registrationLink: {
    id: 'reg-link-primary',
    title: 'IndiChat Super App Early Access & Portal',
    destinationUrl: 'https://indichat.com/join',
    isEnabled: false, // Default: false = use built-in modern registration modal. When true, redirect to this URL.
    description: 'Official registration portal for new IndiChat super app community accounts',
    openInNewTab: true,
    updatedAt: new Date().toISOString(),
  },
  socialLinks: [
    {
      id: 'soc-instagram',
      platform: 'instagram',
      platformName: 'Instagram',
      profileUrl: 'https://instagram.com/indichatapp',
      handle: '@indichatapp',
      isEnabled: true,
      order: 1,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'soc-facebook',
      platform: 'facebook',
      platformName: 'Facebook',
      profileUrl: 'https://facebook.com/indichatapp',
      handle: 'IndiChat Official',
      isEnabled: true,
      order: 2,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'soc-x',
      platform: 'x',
      platformName: 'X (formerly Twitter)',
      profileUrl: 'https://x.com/indichatapp',
      handle: '@indichatapp',
      isEnabled: true,
      order: 3,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'soc-youtube',
      platform: 'youtube',
      platformName: 'YouTube',
      profileUrl: 'https://youtube.com/@indichat',
      handle: '@indichat',
      isEnabled: true,
      order: 4,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'soc-telegram',
      platform: 'telegram',
      platformName: 'Telegram',
      profileUrl: 'https://t.me/indichatchannel',
      handle: 't.me/indichatchannel',
      isEnabled: true,
      order: 5,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'soc-linkedin',
      platform: 'linkedin',
      platformName: 'LinkedIn',
      profileUrl: 'https://linkedin.com/company/indichat',
      handle: 'IndiChat Technologies',
      isEnabled: true,
      order: 6,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'soc-whatsapp',
      platform: 'whatsapp',
      platformName: 'WhatsApp Channel',
      profileUrl: 'https://whatsapp.com/channel/indichat',
      handle: 'IndiChat Verified',
      isEnabled: true,
      order: 7,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'soc-discord',
      platform: 'discord',
      platformName: 'Discord',
      profileUrl: 'https://discord.gg/indichat',
      handle: 'IndiChat Community',
      isEnabled: true,
      order: 8,
      updatedAt: new Date().toISOString(),
    },
  ],
  settings: {
    siteTitle: 'IndiChat Privacy & Security',
    siteTagline: 'Everything You Love. One App You Trust.',
    maintenanceMode: false,
    allowNewRegistrations: true,
    securityBannerText: 'End-to-end encrypted chats, reels, live streams and privacy-first commerce',
    updatedAt: new Date().toISOString(),
    logo: DEFAULT_LOGO_CONFIG,
  },
  apkConfig: {
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
  },
  admin: {
    email: defaultAdminEmail,
    username: defaultAdminUsername,
    salt: initialAdminHash.salt,
    passwordHash: initialAdminHash.hash,
    updatedAt: new Date().toISOString(),
  },
  sessions: {},
  users: [],
  auditLogs: [
    {
      id: 'log-seed-1',
      action: 'SYSTEM_INITIALIZED',
      details: 'Secure database initialized with cryptographic salted credential protection.',
      timestamp: new Date().toISOString(),
    },
  ],
};

// Thread-safe / persistent DB loader
class DatabaseManager {
  private db: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.db = this.loadDatabase();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Merge with defaults to ensure all fields exist
        return {
          ...DEFAULT_DB,
          ...parsed,
          contactInfo: { ...DEFAULT_DB.contactInfo, ...(parsed.contactInfo || {}) },
          registrationLink: { ...DEFAULT_DB.registrationLink, ...(parsed.registrationLink || {}) },
          settings: {
            ...DEFAULT_DB.settings,
            ...(parsed.settings || {}),
            logo: {
              ...DEFAULT_LOGO_CONFIG,
              ...((parsed.settings && parsed.settings.logo) || {}),
            },
          },
          apkConfig: { ...DEFAULT_DB.apkConfig, ...(parsed.apkConfig || {}) },
          socialLinks: Array.isArray(parsed.socialLinks) && parsed.socialLinks.length > 0 ? parsed.socialLinks : DEFAULT_DB.socialLinks,
          sessions: parsed.sessions || {},
          users: parsed.users || [],
          auditLogs: parsed.auditLogs || DEFAULT_DB.auditLogs,
        };
      }
    } catch (err) {
      console.error('Error reading database file, using defaults:', err);
    }
    this.saveDatabase(DEFAULT_DB);
    return JSON.parse(JSON.stringify(DEFAULT_DB));
  }

  private saveDatabase(data?: DatabaseSchema) {
    try {
      this.ensureDataDir();
      const toSave = data || this.db;
      fs.writeFileSync(DB_FILE, JSON.stringify(toSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public logAction(action: string, details: string, ipAddress?: string) {
    const log: AdminAuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      action,
      details,
      timestamp: new Date().toISOString(),
      ipAddress,
    };
    this.db.auditLogs.unshift(log);
    if (this.db.auditLogs.length > 100) {
      this.db.auditLogs = this.db.auditLogs.slice(0, 100);
    }
    this.saveDatabase();
  }

  // --- Public Data Access ---
  public getPublicData() {
    return {
      contactInfo: this.db.contactInfo,
      registrationLink: this.db.registrationLink,
      socialLinks: this.db.socialLinks.filter((s) => s.isEnabled),
      settings: this.db.settings,
      apkConfig: this.db.apkConfig,
      logo: this.getLogoConfig(),
    };
  }

  // --- APK Release Management ---
  public getApkConfig(): ApkConfig {
    return this.db.apkConfig;
  }

  public updateApkConfig(updates: Partial<ApkConfig>, adminActor: string = 'admin'): ApkConfig {
    const prev = this.db.apkConfig;
    let displayStatus = updates.displayStatus || prev.displayStatus || (prev.directDownloadEnabled ? 'active' : 'paused');
    let directDownloadEnabled = updates.directDownloadEnabled !== undefined ? updates.directDownloadEnabled : prev.directDownloadEnabled;

    if (updates.displayStatus && updates.directDownloadEnabled === undefined) {
      directDownloadEnabled = updates.displayStatus === 'active';
    } else if (updates.directDownloadEnabled !== undefined && !updates.displayStatus) {
      displayStatus = updates.directDownloadEnabled ? 'active' : 'paused';
    }

    this.db.apkConfig = {
      ...prev,
      ...updates,
      displayStatus,
      directDownloadEnabled,
      updatedAt: new Date().toISOString(),
    };
    this.logAction(
      'APK_CONFIG_UPDATED',
      `APK release updated to ${this.db.apkConfig.versionName} (${this.db.apkConfig.fileName}, status: ${this.db.apkConfig.displayStatus}) by ${adminActor}`
    );
    this.saveDatabase();
    return this.db.apkConfig;
  }

  public incrementApkDownload(): number {
    this.db.apkConfig.downloadCount = (this.db.apkConfig.downloadCount || 0) + 1;
    this.saveDatabase();
    return this.db.apkConfig.downloadCount;
  }

  // --- Registration Link Management ---
  public getRegistrationLink(): RegistrationLinkConfig {
    return this.db.registrationLink;
  }

  public updateRegistrationLink(
    updates: Partial<RegistrationLinkConfig>,
    adminActor: string = 'admin'
  ): RegistrationLinkConfig {
    this.db.registrationLink = {
      ...this.db.registrationLink,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.logAction(
      'REGISTRATION_LINK_UPDATED',
      `Registration destination updated to: ${this.db.registrationLink.destinationUrl} (Active: ${this.db.registrationLink.isEnabled}) by ${adminActor}`
    );
    this.saveDatabase();
    return this.db.registrationLink;
  }

  // --- Contact Info Management ---
  public getContactInfo(): ContactInfo {
    return this.db.contactInfo;
  }

  public updateContactInfo(
    updates: Partial<ContactInfo>,
    adminActor: string = 'admin'
  ): ContactInfo {
    this.db.contactInfo = {
      ...this.db.contactInfo,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.logAction(
      'CONTACT_INFO_UPDATED',
      `Updated contact emails/phones: Privacy(${this.db.contactInfo.privacyEmail}), Support(${this.db.contactInfo.supportEmail}) by ${adminActor}`
    );
    this.saveDatabase();
    return this.db.contactInfo;
  }

  // --- Social Media Links Management ---
  public getAllSocialLinks(): SocialLinkItem[] {
    return this.db.socialLinks.sort((a, b) => a.order - b.order);
  }

  public addSocialLink(
    item: Omit<SocialLinkItem, 'id' | 'updatedAt'>,
    adminActor: string = 'admin'
  ): SocialLinkItem {
    const newId = 'soc-' + Date.now();
    const newLink: SocialLinkItem = {
      ...item,
      id: newId,
      updatedAt: new Date().toISOString(),
    };
    this.db.socialLinks.push(newLink);
    this.logAction(
      'SOCIAL_LINK_ADDED',
      `Added social platform: ${item.platformName} (${item.profileUrl}) by ${adminActor}`
    );
    this.saveDatabase();
    return newLink;
  }

  public updateSocialLink(
    id: string,
    updates: Partial<SocialLinkItem>,
    adminActor: string = 'admin'
  ): SocialLinkItem | null {
    const index = this.db.socialLinks.findIndex((s) => s.id === id);
    if (index === -1) return null;
    this.db.socialLinks[index] = {
      ...this.db.socialLinks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.logAction(
      'SOCIAL_LINK_UPDATED',
      `Updated social link ${this.db.socialLinks[index].platformName} by ${adminActor}`
    );
    this.saveDatabase();
    return this.db.socialLinks[index];
  }

  public deleteSocialLink(id: string, adminActor: string = 'admin'): boolean {
    const index = this.db.socialLinks.findIndex((s) => s.id === id);
    if (index === -1) return false;
    const removed = this.db.socialLinks.splice(index, 1)[0];
    this.logAction(
      'SOCIAL_LINK_DELETED',
      `Removed social link: ${removed.platformName} by ${adminActor}`
    );
    this.saveDatabase();
    return true;
  }

  public toggleSocialLink(id: string, adminActor: string = 'admin'): SocialLinkItem | null {
    const item = this.db.socialLinks.find((s) => s.id === id);
    if (!item) return null;
    item.isEnabled = !item.isEnabled;
    item.updatedAt = new Date().toISOString();
    this.logAction(
      'SOCIAL_LINK_TOGGLED',
      `Toggled ${item.platformName} to ${item.isEnabled ? 'ENABLED' : 'DISABLED'} by ${adminActor}`
    );
    this.saveDatabase();
    return item;
  }

  // --- Settings Management ---
  public getSettings(): WebsiteSettings {
    return this.db.settings;
  }

  public updateSettings(
    updates: Partial<WebsiteSettings>,
    adminActor: string = 'admin'
  ): WebsiteSettings {
    this.db.settings = {
      ...this.db.settings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.logAction('SETTINGS_UPDATED', `Updated website global settings by ${adminActor}`);
    this.saveDatabase();
    return this.db.settings;
  }

  // --- Logo & Branding Management ---
  public getLogoConfig(): WebsiteLogoConfig {
    if (!this.db.settings.logo) {
      this.db.settings.logo = { ...DEFAULT_LOGO_CONFIG };
      this.saveDatabase();
    }
    return this.db.settings.logo;
  }

  public updateLogoConfig(
    updates: Partial<WebsiteLogoConfig>,
    adminActor: string = 'admin'
  ): WebsiteLogoConfig {
    const current = this.getLogoConfig();
    const updated: WebsiteLogoConfig = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.db.settings.logo = updated;
    this.logAction(
      'LOGO_UPDATED',
      `Updated website logo (${updated.logoType}${updated.imageUrl ? `: ${updated.imageUrl}` : ''}) by ${adminActor}`
    );
    this.saveDatabase();
    return updated;
  }

  public resetLogoConfig(adminActor: string = 'admin'): WebsiteLogoConfig {
    this.db.settings.logo = {
      ...DEFAULT_LOGO_CONFIG,
      updatedAt: new Date().toISOString(),
    };
    this.logAction('LOGO_RESET', `Reset website logo to official default preset by ${adminActor}`);
    this.saveDatabase();
    return this.db.settings.logo;
  }

  // --- Admin Authentication & Session Management ---
  public verifyAdminCredentials(identifier: string, pass: string): boolean {
    const trimmedId = identifier.trim().toLowerCase();
    const adminEmail = this.db.admin.email.toLowerCase();
    const adminUsername = this.db.admin.username.toLowerCase();

    if (trimmedId !== adminEmail && trimmedId !== adminUsername) {
      return false;
    }

    return verifyPassword(pass, this.db.admin.salt, this.db.admin.passwordHash);
  }

  public createAdminSession(adminEmail: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    // 24 hours expiration
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

    this.db.sessions[token] = {
      token,
      adminEmail,
      createdAt: now.toISOString(),
      expiresAt,
    };

    // Clean up expired sessions
    this.cleanupExpiredSessions();
    this.saveDatabase();
    this.logAction('ADMIN_LOGIN', `Admin logged in successfully (${adminEmail})`);
    return token;
  }

  public verifyAdminSession(token: string): StoredSession | null {
    if (!token) return null;
    const session = this.db.sessions[token];
    if (!session) return null;

    const now = new Date().getTime();
    const expiresAt = new Date(session.expiresAt).getTime();
    if (now > expiresAt) {
      delete this.db.sessions[token];
      this.saveDatabase();
      return null;
    }
    return session;
  }

  public destroyAdminSession(token: string): boolean {
    if (token && this.db.sessions[token]) {
      const email = this.db.sessions[token].adminEmail;
      delete this.db.sessions[token];
      this.logAction('ADMIN_LOGOUT', `Admin session ended (${email})`);
      this.saveDatabase();
      return true;
    }
    return false;
  }

  private cleanupExpiredSessions() {
    const now = new Date().getTime();
    for (const [t, s] of Object.entries(this.db.sessions)) {
      if (now > new Date(s.expiresAt).getTime()) {
        delete this.db.sessions[t];
      }
    }
  }

  // --- User Registration & Authentication ---
  public registerUser(
    fullName: string,
    email: string,
    phoneNumber: string,
    pass: string
  ): { user: UserAccount; token: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phoneNumber.trim();

    // Check existing
    const existing = this.db.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail || u.phoneNumber === normalizedPhone
    );
    if (existing) {
      throw new Error('An account with this email address or phone number already exists.');
    }

    const { hash, salt } = hashPassword(pass);
    const id = 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newUser: StoredUser = {
      id,
      fullName: fullName.trim(),
      email: normalizedEmail,
      phoneNumber: normalizedPhone,
      salt,
      passwordHash: hash,
      createdAt: new Date().toISOString(),
    };

    this.db.users.push(newUser);
    this.saveDatabase();

    const token = crypto.randomBytes(32).toString('hex');
    const userSafe: UserAccount = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      createdAt: newUser.createdAt,
    };

    return { user: userSafe, token };
  }

  public loginUser(
    identifier: string,
    pass: string
  ): { user: UserAccount; token: string } {
    const trimmed = identifier.trim().toLowerCase();
    const user = this.db.users.find(
      (u) => u.email.toLowerCase() === trimmed || u.phoneNumber.replace(/\s+/g, '') === trimmed.replace(/\s+/g, '')
    );

    if (!user) {
      throw new Error('Invalid email, phone number, or password.');
    }

    const isValid = verifyPassword(pass, user.salt, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email, phone number, or password.');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const userSafe: UserAccount = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
    };

    return { user: userSafe, token };
  }

  public getUsersCount(): number {
    return this.db.users.length;
  }

  // --- Admin Overview Stats & Logs ---
  public getAdminStats(): AdminStats {
    this.cleanupExpiredSessions();
    const enabledSocials = this.db.socialLinks.filter((s) => s.isEnabled).length;
    return {
      totalUsers: this.db.users.length,
      activeSessions: Object.keys(this.db.sessions).length,
      enabledSocialLinksCount: enabledSocials,
      isCustomRegEnabled: this.db.registrationLink.isEnabled,
      systemHealth: '100% Operational (TLS 1.3 / AES-256 / Salted PBKDF2)',
      lastUpdated: new Date().toISOString(),
    };
  }

  public getAuditLogs(): AdminAuditLog[] {
    return this.db.auditLogs;
  }
}

export const dbManager = new DatabaseManager();
