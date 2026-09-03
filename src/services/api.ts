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
} from '../types';

export interface PublicDataResponse {
  contactInfo: ContactInfo;
  registrationLink: RegistrationLinkConfig;
  socialLinks: SocialLinkItem[];
  settings: WebsiteSettings;
  apkConfig?: ApkConfig;
  logo?: WebsiteLogoConfig;
}

export interface AuthUserResponse {
  success: boolean;
  message: string;
  user: UserAccount;
  token: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: {
    email: string;
    role: string;
  };
}

export interface AdminOverviewResponse {
  success: boolean;
  stats: AdminStats;
  contactInfo: ContactInfo;
  registrationLink: RegistrationLinkConfig;
  socialLinks: SocialLinkItem[];
  settings: WebsiteSettings;
  apkConfig?: ApkConfig;
  logo?: WebsiteLogoConfig;
  auditLogs: AdminAuditLog[];
}

// Token storage keys
const ADMIN_TOKEN_KEY = 'indichat_admin_session_token';
const USER_TOKEN_KEY = 'indichat_user_session_token';
const USER_DATA_KEY = 'indichat_user_data';

export const authStorage = {
  getAdminToken: (): string | null => localStorage.getItem(ADMIN_TOKEN_KEY),
  setAdminToken: (token: string): void => localStorage.setItem(ADMIN_TOKEN_KEY, token),
  removeAdminToken: (): void => localStorage.removeItem(ADMIN_TOKEN_KEY),
  clearAdminToken: (): void => localStorage.removeItem(ADMIN_TOKEN_KEY),

  getUserToken: (): string | null => localStorage.getItem(USER_TOKEN_KEY),
  setUserToken: (token: string): void => localStorage.setItem(USER_TOKEN_KEY, token),
  removeUserToken: (): void => {
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  },

  getUserData: (): UserAccount | null => {
    const raw = localStorage.getItem(USER_DATA_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUserData: (user: UserAccount): void => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  },
};

// --- PUBLIC APIS ---
export async function fetchPublicData(): Promise<PublicDataResponse> {
  const res = await fetch('/api/public/data');
  if (!res.ok) {
    throw new Error('Failed to fetch dynamic website data');
  }
  const json = await res.json();
  return json.data;
}

// --- USER AUTH APIS ---
export async function loginUserApi(identifier: string, password: string): Promise<AuthUserResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to log in');
  }
  return data;
}

export async function registerUserApi(
  fullName: string,
  email: string,
  phoneNumber: string,
  password: string,
  confirmPassword: string
): Promise<AuthUserResponse> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, phoneNumber, password, confirmPassword }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create account');
  }
  return data;
}

export async function forgotPasswordApi(identifier: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

// --- ADMIN AUTH APIS ---
export async function loginAdminApi(usernameOrEmail: string, password: string): Promise<AdminLoginResponse> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Invalid administrator credentials. Access denied.');
  }
  return data;
}

export async function verifyAdminApi(): Promise<{ valid: boolean }> {
  const token = authStorage.getAdminToken();
  if (!token) return { valid: false };

  try {
    const res = await fetch('/api/admin/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      authStorage.removeAdminToken();
      return { valid: false };
    }
    const data = await res.json();
    return { valid: Boolean(data.valid) };
  } catch {
    return { valid: false };
  }
}

export async function verifyAdminSessionApi(): Promise<boolean> {
  const result = await verifyAdminApi();
  return result.valid;
}

export async function logoutAdminApi(): Promise<void> {
  const token = authStorage.getAdminToken();
  if (token) {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Ignore network errors on logout
    }
  }
  authStorage.removeAdminToken();
}

// --- PROTECTED ADMIN APIS ---
function getAdminHeaders(): HeadersInit {
  const token = authStorage.getAdminToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token || ''}`,
  };
}

export async function getAdminStatsApi(): Promise<AdminStats> {
  const res = await fetch('/api/admin/stats', {
    headers: getAdminHeaders(),
  });
  if (!res.ok) {
    const overview = await fetchAdminOverview();
    return overview.stats;
  }
  const data = await res.json();
  return data.stats;
}

export async function getAdminAuditLogsApi(): Promise<AdminAuditLog[]> {
  const res = await fetch('/api/admin/audit-logs', {
    headers: getAdminHeaders(),
  });
  if (!res.ok) {
    const overview = await fetchAdminOverview();
    return overview.auditLogs;
  }
  const data = await res.json();
  return data.auditLogs;
}

export async function fetchAdminOverview(): Promise<AdminOverviewResponse> {
  const res = await fetch('/api/admin/overview', {
    headers: getAdminHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch admin dashboard overview');
  }
  return data;
}

export async function updateRegistrationLinkApi(
  config: Partial<RegistrationLinkConfig>
): Promise<RegistrationLinkConfig> {
  const res = await fetch('/api/admin/registration-link', {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(config),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update registration link');
  }
  return data.registrationLink;
}

export async function updateContactInfoApi(info: Partial<ContactInfo>): Promise<ContactInfo> {
  const res = await fetch('/api/admin/contact-info', {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(info),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update contact information');
  }
  return data.contactInfo;
}

export async function addSocialLinkApi(link: Omit<SocialLinkItem, 'id' | 'updatedAt'>): Promise<SocialLinkItem> {
  const res = await fetch('/api/admin/social-links', {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(link),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to add social link');
  }
  return data.socialLink;
}

export async function updateSocialLinkApi(
  id: string,
  updates: Partial<SocialLinkItem>
): Promise<SocialLinkItem> {
  const res = await fetch(`/api/admin/social-links/${id}`, {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update social link');
  }
  return data.socialLink;
}

export async function deleteSocialLinkApi(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/social-links/${id}`, {
    method: 'DELETE',
    headers: getAdminHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete social link');
  }
  return true;
}

export async function toggleSocialLinkApi(id: string): Promise<SocialLinkItem> {
  const res = await fetch(`/api/admin/social-links/${id}/toggle`, {
    method: 'PATCH',
    headers: getAdminHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to toggle social link');
  }
  return data.socialLink;
}

export async function updateSettingsApi(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
  const res = await fetch('/api/admin/settings', {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(settings),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update website settings');
  }
  return data.settings;
}

export const updateWebsiteSettingsApi = updateSettingsApi;

// --- APK RELEASE & DOWNLOAD APIS ---
export async function fetchPublicApkApi(): Promise<ApkConfig> {
  const res = await fetch('/api/public/apk');
  if (!res.ok) {
    throw new Error('Failed to fetch public APK information');
  }
  const data = await res.json();
  return data.apk;
}

export async function getAdminApkApi(): Promise<ApkConfig> {
  const res = await fetch('/api/admin/apk', {
    headers: getAdminHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to load APK release configuration');
  }
  const data = await res.json();
  return data.apk;
}

export async function uploadAdminApkApi(formData: FormData): Promise<{
  success: boolean;
  message: string;
  apk: ApkConfig;
}> {
  const token = authStorage.getAdminToken();
  const res = await fetch('/api/admin/apk/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token || ''}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload APK file');
  }
  return data;
}

export async function updateAdminApkConfigApi(updates: Partial<ApkConfig>): Promise<ApkConfig> {
  const res = await fetch('/api/admin/apk/config', {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update APK settings');
  }
  return data.apk;
}

// --- WEBSITE LOGO & BRANDING APIS ---
export async function fetchPublicLogoApi(): Promise<WebsiteLogoConfig> {
  const res = await fetch('/api/public/logo');
  if (!res.ok) {
    throw new Error('Failed to fetch website logo');
  }
  const data = await res.json();
  return data.logo;
}

export async function getAdminLogoApi(): Promise<WebsiteLogoConfig> {
  const res = await fetch('/api/admin/logo', {
    headers: getAdminHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to retrieve website logo configuration');
  }
  const data = await res.json();
  return data.logo;
}

export async function uploadAdminLogoApi(formData: FormData): Promise<{
  success: boolean;
  message: string;
  logo: WebsiteLogoConfig;
}> {
  const token = authStorage.getAdminToken();
  const res = await fetch('/api/admin/logo/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token || ''}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload logo image file');
  }
  return data;
}

export async function updateAdminLogoApi(updates: Partial<WebsiteLogoConfig>): Promise<WebsiteLogoConfig> {
  const res = await fetch('/api/admin/logo', {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update logo configuration');
  }
  return data.logo;
}

export async function resetAdminLogoApi(): Promise<WebsiteLogoConfig> {
  const res = await fetch('/api/admin/logo/reset', {
    method: 'POST',
    headers: getAdminHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to reset website logo');
  }
  return data.logo;
}
