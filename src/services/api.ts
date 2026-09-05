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
  AdminAnalyticsData,
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

export async function getAdminAnalyticsApi(range: string = '30d'): Promise<AdminAnalyticsData> {
  const res = await fetch(`/api/admin/analytics?range=${encodeURIComponent(range)}`, {
    headers: getAdminHeaders(),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch administrator analytics data');
  }
  const data = await res.json();
  return data.analytics;
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

export interface ApkUploadProgress {
  percent: number;
  loadedBytes: number;
  totalBytes: number;
  formattedLoaded: string;
  formattedTotal: string;
  speedFormatted: string;
  estimatedSecondsLeft: number | null;
  phase?: 'initializing' | 'uploading' | 'assembling' | 'complete' | 'error';
  currentChunk?: number;
  totalChunks?: number;
  chunkSize?: number;
  statusMessage?: string;
  retryAttempt?: number;
}

export function formatTransferBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export interface ChunkedApkUploadOptions {
  file: File;
  metadata?: {
    versionName?: string;
    versionCode?: number | string;
    releaseNotes?: string;
    minAndroidVersion?: string;
    packageName?: string;
    appName?: string;
    displayStatus?: string;
    directDownloadEnabled?: boolean | string;
  };
  chunkSize?: number; // default: 2.5 MB
  onProgress?: (progress: ApkUploadProgress) => void;
  abortSignal?: AbortSignal;
}

/**
 * High-performance Chunked Upload Strategy for APK files.
 * Slices the APK into resilient parts (default 2.5MB), uploads with auto-retry
 * per chunk, tracks accurate granular progress and ETA, and asks server to assemble.
 */
export async function uploadAdminApkChunkedApi(
  options: ChunkedApkUploadOptions
): Promise<{
  success: boolean;
  message: string;
  apk: ApkConfig;
}> {
  const { file, metadata = {}, onProgress, abortSignal } = options;
  const token = authStorage.getAdminToken();
  const chunkSize = options.chunkSize || 2.5 * 1024 * 1024; // 2.5 MB chunks
  const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize));
  const startTime = Date.now();
  let uploadId: string | null = null;

  const notifyCancel = async (id: string) => {
    try {
      await fetch('/api/admin/apk/chunk/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ uploadId: id }),
      });
    } catch {
      // ignore
    }
  };

  if (abortSignal?.aborted) {
    throw new Error('Upload was cancelled before starting.');
  }

  // Phase 1: Initialize Chunked Session
  onProgress?.({
    percent: 0,
    loadedBytes: 0,
    totalBytes: file.size,
    formattedLoaded: '0 B',
    formattedTotal: formatTransferBytes(file.size),
    speedFormatted: 'Initializing...',
    estimatedSecondsLeft: null,
    phase: 'initializing',
    currentChunk: 0,
    totalChunks,
    chunkSize,
    statusMessage: `Initializing chunked session for ${file.name} (${totalChunks} parts)...`,
  });

  const initResponse = await fetch('/api/admin/apk/chunk/init', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      fileName: file.name,
      fileSizeBytes: file.size,
      totalChunks,
      chunkSize,
      metadata,
    }),
  });

  if (!initResponse.ok) {
    const errData = await initResponse.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to initialize chunk session (HTTP ${initResponse.status})`);
  }

  const initData = await initResponse.json();
  uploadId = initData.uploadId;

  // Phase 2: Upload Each Chunk with Retries & Live Speed/ETA Calculations
  let cumulativeBytesUploaded = 0;
  let lastSpeedCheckTime = startTime;
  let lastSpeedCheckBytes = 0;
  let currentSpeed = 0;

  for (let chunkIdx = 0; chunkIdx < totalChunks; chunkIdx++) {
    if (abortSignal?.aborted) {
      if (uploadId) await notifyCancel(uploadId);
      throw new Error('APK chunked upload was cancelled.');
    }

    const start = chunkIdx * chunkSize;
    const end = Math.min(file.size, start + chunkSize);
    const chunkBlob = file.slice(start, end);
    const chunkSizeBytes = end - start;

    let retryCount = 0;
    const maxRetries = 3;
    let chunkSuccess = false;

    while (!chunkSuccess && retryCount <= maxRetries) {
      if (abortSignal?.aborted) {
        if (uploadId) await notifyCancel(uploadId);
        throw new Error('APK chunked upload was cancelled.');
      }

      try {
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          if (abortSignal) {
            const onAbort = () => {
              xhr.abort();
              reject(new Error('APK chunked upload was cancelled.'));
            };
            abortSignal.addEventListener('abort', onAbort, { once: true });
          }

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
              const currentChunkLoaded = event.loaded;
              const overallLoaded = cumulativeBytesUploaded + currentChunkLoaded;
              const now = Date.now();
              const timeSinceLastSpeed = (now - lastSpeedCheckTime) / 1000;

              if (timeSinceLastSpeed >= 0.25) {
                const bytesDiff = overallLoaded - lastSpeedCheckBytes;
                currentSpeed = Math.max(0, bytesDiff / timeSinceLastSpeed);
                lastSpeedCheckTime = now;
                lastSpeedCheckBytes = overallLoaded;
              }

              const overallPercent = Math.min(99, Math.round((overallLoaded / file.size) * 100));
              const remainingBytes = Math.max(0, file.size - overallLoaded);
              const etaSeconds = currentSpeed > 0 ? Math.ceil(remainingBytes / currentSpeed) : null;
              const speedFormatted = currentSpeed > 0 ? `${formatTransferBytes(currentSpeed)}/s` : 'Measuring...';

              onProgress({
                percent: overallPercent,
                loadedBytes: overallLoaded,
                totalBytes: file.size,
                formattedLoaded: formatTransferBytes(overallLoaded),
                formattedTotal: formatTransferBytes(file.size),
                speedFormatted,
                estimatedSecondsLeft: etaSeconds,
                phase: 'uploading',
                currentChunk: chunkIdx + 1,
                totalChunks,
                chunkSize,
                retryAttempt: retryCount > 0 ? retryCount : undefined,
                statusMessage: `Uploading chunk ${chunkIdx + 1} of ${totalChunks} (${Math.round((event.loaded / event.total) * 100)}%)...`,
              });
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              let msg = `HTTP ${xhr.status}`;
              try {
                const parsed = JSON.parse(xhr.responseText || '{}');
                if (parsed.error) msg = parsed.error;
              } catch {
                // ignore
              }
              reject(new Error(msg));
            }
          };

          xhr.onerror = () => reject(new Error('Network connection error during chunk transfer'));
          xhr.ontimeout = () => reject(new Error('Chunk upload timed out'));
          xhr.timeout = 180000; // 3 minutes per chunk

          const chunkFormData = new FormData();
          chunkFormData.append('uploadId', uploadId!);
          chunkFormData.append('chunkIndex', String(chunkIdx));
          chunkFormData.append('chunk', chunkBlob, `${file.name}.part${chunkIdx}`);

          xhr.open('POST', '/api/admin/apk/chunk/upload');
          if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
          xhr.send(chunkFormData);
        });

        chunkSuccess = true;
        cumulativeBytesUploaded += chunkSizeBytes;
      } catch (chunkErr) {
        if (abortSignal?.aborted) throw chunkErr;
        retryCount++;
        if (retryCount > maxRetries) {
          if (uploadId) await notifyCancel(uploadId);
          throw new Error(
            `Chunk #${chunkIdx + 1} failed after ${maxRetries} attempts: ${chunkErr instanceof Error ? chunkErr.message : String(chunkErr)}`
          );
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  // Phase 3: Assembly & Cryptographic SHA-256 Validation on Server
  onProgress?.({
    percent: 100,
    loadedBytes: file.size,
    totalBytes: file.size,
    formattedLoaded: formatTransferBytes(file.size),
    formattedTotal: formatTransferBytes(file.size),
    speedFormatted: 'Assembling...',
    estimatedSecondsLeft: null,
    phase: 'assembling',
    currentChunk: totalChunks,
    totalChunks,
    chunkSize,
    statusMessage: 'All chunks uploaded! Assembling APK & verifying SHA-256 integrity on server...',
  });

  const completeRes = await fetch('/api/admin/apk/chunk/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ uploadId }),
  });

  if (!completeRes.ok) {
    const errData = await completeRes.json().catch(() => ({}));
    throw new Error(errData.error || `Server failed to assemble chunks (HTTP ${completeRes.status})`);
  }

  const completeData = await completeRes.json();

  onProgress?.({
    percent: 100,
    loadedBytes: file.size,
    totalBytes: file.size,
    formattedLoaded: formatTransferBytes(file.size),
    formattedTotal: formatTransferBytes(file.size),
    speedFormatted: 'Complete',
    estimatedSecondsLeft: 0,
    phase: 'complete',
    currentChunk: totalChunks,
    totalChunks,
    chunkSize,
    statusMessage: 'APK assembled and release is now active!',
  });

  return completeData;
}

export async function uploadAdminApkApi(
  formData: FormData,
  onProgress?: (progress: ApkUploadProgress) => void,
  abortSignal?: AbortSignal
): Promise<{
  success: boolean;
  message: string;
  apk: ApkConfig;
}> {
  // If formData contains an apkFile File object, seamlessly route through high-performance chunked upload
  const fileCandidate = formData.get('apkFile');
  if (fileCandidate instanceof File) {
    const metadata: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'apkFile' && typeof value === 'string') {
        metadata[key] = value;
      }
    }

    return uploadAdminApkChunkedApi({
      file: fileCandidate,
      metadata,
      onProgress,
      abortSignal,
    });
  }

  // Fallback to standard upload
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const token = authStorage.getAdminToken();

    const startTime = Date.now();
    let lastTime = startTime;
    let lastLoaded = 0;

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0) {
          const now = Date.now();
          const timeElapsed = (now - startTime) / 1000;
          const timeDiff = (now - lastTime) / 1000;

          let speed = 0;
          if (timeDiff > 0.25) {
            speed = Math.max(0, (event.loaded - lastLoaded) / timeDiff);
            lastLoaded = event.loaded;
            lastTime = now;
          } else if (timeElapsed > 0.5) {
            speed = event.loaded / timeElapsed;
          }

          const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
          const remainingBytes = Math.max(0, event.total - event.loaded);
          const estimatedSecondsLeft = speed > 0 ? Math.round(remainingBytes / speed) : null;
          const speedFormatted = speed > 0 ? `${formatTransferBytes(speed)}/s` : 'Calculating...';

          onProgress({
            percent,
            loadedBytes: event.loaded,
            totalBytes: event.total,
            formattedLoaded: formatTransferBytes(event.loaded),
            formattedTotal: formatTransferBytes(event.total),
            speedFormatted,
            estimatedSecondsLeft,
          });
        }
      };
    }

    xhr.open('POST', '/api/admin/apk/upload');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        xhr.abort();
        reject(new Error('APK upload was cancelled.'));
      });
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data);
        } else {
          reject(new Error(data.error || `Upload failed with HTTP ${xhr.status}`));
        }
      } catch {
        reject(new Error(xhr.responseText || `Upload failed with HTTP ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during upload. Please check your internet connection and try again.'));
    };

    xhr.ontimeout = () => {
      reject(new Error('Upload request timed out after 10 minutes.'));
    };

    xhr.timeout = 600000;
    xhr.send(formData);
  });
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
