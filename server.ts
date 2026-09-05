import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ override: true });

import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { dbManager } from './server/db';
import {
  ensureDefaultApkFile,
  ensureApkDirectory,
  APK_STORAGE_DIR,
  formatBytes,
  computeFileSha256,
  computeFileSha256Async,
} from './server/apkStorage';
import {
  createChunkSession,
  saveChunk,
  assembleChunks,
  cancelChunkSession,
  getChunkSession,
} from './server/chunkStorage';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUsers } from './src/db/users.ts';

interface AuthenticatedRequest extends Request {
  adminSession?: {
    token: string;
    adminEmail: string;
    createdAt: string;
    expiresAt: string;
  };
  file?: Express.Multer.File;
}

// Ensure default APK file exists on server boot
ensureDefaultApkFile('IndiChat-v2.4.1.apk');

// Configure Multer storage for uploaded APK files
const apkUploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureApkDirectory();
    cb(null, APK_STORAGE_DIR);
  },
  filename: (_req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const finalName = cleanName.toLowerCase().endsWith('.apk') ? cleanName : `${cleanName}.apk`;
    cb(null, finalName);
  },
});

const uploadApkMiddleware = multer({
  storage: apkUploadStorage,
  limits: { fileSize: 350 * 1024 * 1024 }, // 350 MB max limit
});

// Configure Multer storage for chunked APK uploads (25MB max per individual chunk)
const CHUNK_TEMP_DIR = path.join(process.cwd(), 'uploads', 'temp_chunks');
if (!fs.existsSync(CHUNK_TEMP_DIR)) {
  fs.mkdirSync(CHUNK_TEMP_DIR, { recursive: true });
}

const chunkUploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(CHUNK_TEMP_DIR)) {
      fs.mkdirSync(CHUNK_TEMP_DIR, { recursive: true });
    }
    cb(null, CHUNK_TEMP_DIR);
  },
  filename: (_req, _file, cb) => {
    cb(null, `chunk_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`);
  },
});

const uploadChunkMiddleware = multer({
  storage: chunkUploadStorage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max per chunk
});

// Configure Multer storage for uploaded Logo images
const LOGO_STORAGE_DIR = path.join(process.cwd(), 'data', 'logos');
if (!fs.existsSync(LOGO_STORAGE_DIR)) {
  fs.mkdirSync(LOGO_STORAGE_DIR, { recursive: true });
}

const logoUploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(LOGO_STORAGE_DIR)) {
      fs.mkdirSync(LOGO_STORAGE_DIR, { recursive: true });
    }
    cb(null, LOGO_STORAGE_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const timestamp = Date.now();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `logo-${cleanName}-${timestamp}${ext}`);
  },
});

const uploadLogoMiddleware = multer({
  storage: logoUploadStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(png|jpe?g|svg|webp|ico)$/i;
    if (!allowed.test(file.originalname)) {
      return cb(new Error('Only PNG, SVG, JPG, WebP, and ICO images are supported for logos.'));
    }
    cb(null, true);
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with reasonable limits
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // --- HEALTH CHECK ---
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'IndiChat Secure Backend',
      database: 'Cloud SQL (PostgreSQL)',
      region: 'asia-southeast1',
      timestamp: new Date().toISOString(),
    });
  });

  // --- FIREBASE AUTH & CLOUD SQL SYNC ENDPOINTS ---
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user || !req.user.uid || !req.user.email) {
        res.status(400).json({ error: 'Invalid user token payload' });
        return;
      }
      const user = await getOrCreateUser(
        req.user.uid,
        req.user.email,
        (req.user.name as string) || undefined,
        (req.user.picture as string) || undefined
      );
      res.json({ success: true, user });
    } catch (err: any) {
      console.error('Failed to synchronize user in Cloud SQL:', err);
      res.status(500).json({ error: 'Failed to synchronize user record' });
    }
  });

  app.get('/api/users/me', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user || !req.user.uid || !req.user.email) {
        res.status(400).json({ error: 'Invalid user token payload' });
        return;
      }
      const user = await getOrCreateUser(
        req.user.uid,
        req.user.email,
        (req.user.name as string) || undefined,
        (req.user.picture as string) || undefined
      );
      res.json({ success: true, user });
    } catch (err: any) {
      console.error('Failed to get user profile from Cloud SQL:', err);
      res.status(500).json({ error: 'Failed to retrieve profile' });
    }
  });

  // --- PUBLIC API ENDPOINTS ---
  // Public website dynamic information
  app.get('/api/public/data', (_req: Request, res: Response) => {
    try {
      const publicData = dbManager.getPublicData();
      res.json({ success: true, data: publicData });
    } catch (err) {
      console.error('Error fetching public data:', err);
      res.status(500).json({ error: 'Internal server error fetching public data' });
    }
  });

  app.get('/api/public/contact', (_req: Request, res: Response) => {
    res.json({ success: true, contactInfo: dbManager.getContactInfo() });
  });

  app.get('/api/public/social-links', (_req: Request, res: Response) => {
    const publicLinks = dbManager.getAllSocialLinks().filter((l) => l.isEnabled);
    res.json({ success: true, socialLinks: publicLinks });
  });

  app.get('/api/public/registration-link', (_req: Request, res: Response) => {
    res.json({ success: true, registrationLink: dbManager.getRegistrationLink() });
  });

  // Public APK information
  app.get('/api/public/apk', (_req: Request, res: Response) => {
    try {
      const apk = dbManager.getApkConfig();
      res.json({ success: true, apk });
    } catch (err) {
      console.error('Error fetching APK data:', err);
      res.status(500).json({ error: 'Failed to fetch APK details' });
    }
  });

  // Public Logo information
  app.get('/api/public/logo', (_req: Request, res: Response) => {
    try {
      const logo = dbManager.getLogoConfig();
      res.json({ success: true, logo });
    } catch (err) {
      console.error('Error fetching public logo config:', err);
      res.status(500).json({ error: 'Failed to retrieve website logo' });
    }
  });

  // Serve uploaded logo images safely
  app.get('/api/public/logo/image/:filename', (req: Request, res: Response) => {
    try {
      const { filename } = req.params;
      const safeFilename = path.basename(filename);
      const filePath = path.join(LOGO_STORAGE_DIR, safeFilename);
      if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'Logo image not found' });
        return;
      }
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.sendFile(filePath);
    } catch (err) {
      console.error('Error serving logo image:', err);
      res.status(500).json({ error: 'Failed to serve logo image' });
    }
  });

  // Direct APK Installation/Download trigger
  app.get('/api/apk/download', (req: Request, res: Response) => {
    try {
      const apk = dbManager.getApkConfig();

      if (apk.displayStatus === 'hidden') {
        res.status(403).json({
          error: 'APK installation is currently hidden from public release by system administrator.',
          code: 'APK_HIDDEN',
        });
        return;
      }

      if (apk.displayStatus === 'paused' || !apk.directDownloadEnabled) {
        res.status(403).json({
          error: 'Direct APK installation is currently paused for routine maintenance.',
          code: 'DOWNLOAD_DISABLED',
        });
        return;
      }

      // If source is external URL (e.g., custom S3/CDN or Cloud link), redirect directly
      if (apk.sourceType === 'external_url' && apk.externalUrl) {
        dbManager.incrementApkDownload();
        res.redirect(apk.externalUrl);
        return;
      }

      const filePath = path.join(APK_STORAGE_DIR, apk.fileName);
      const finalFile = fs.existsSync(filePath)
        ? filePath
        : ensureDefaultApkFile(apk.fileName);

      dbManager.incrementApkDownload();

      // Set standard Android APK download headers so device package installer recognizes it
      res.setHeader('Content-Type', 'application/vnd.android.package-archive');
      res.setHeader('Content-Disposition', `attachment; filename="${apk.fileName}"`);
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(finalFile);
    } catch (err) {
      console.error('Error serving APK download:', err);
      res.status(500).json({ error: 'Failed to serve APK installation file' });
    }
  });

  // --- USER AUTHENTICATION ---
  // User Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { identifier, password } = req.body;
      if (!identifier || !password) {
        res.status(400).json({ error: 'Email or phone number and password are required.' });
        return;
      }

      const result = dbManager.loginUser(identifier, password);
      res.json({
        success: true,
        message: 'Login successful',
        user: result.user,
        token: result.token,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials';
      res.status(401).json({ error: message });
    }
  });

  // User Registration
  app.post('/api/auth/register', (req: Request, res: Response) => {
    try {
      const { fullName, email, phoneNumber, password, confirmPassword } = req.body;

      if (!fullName || !email || !phoneNumber || !password) {
        res.status(400).json({ error: 'All fields are required.' });
        return;
      }

      if (password !== confirmPassword) {
        res.status(400).json({ error: 'Passwords do not match.' });
        return;
      }

      if (password.length < 8) {
        res.status(400).json({ error: 'Password must be at least 8 characters long.' });
        return;
      }

      // Check if registration is allowed by website settings
      const settings = dbManager.getSettings();
      if (!settings.allowNewRegistrations) {
        res.status(403).json({ error: 'New registrations are temporarily closed by the administrator.' });
        return;
      }

      const result = dbManager.registerUser(fullName, email, phoneNumber, password);
      res.status(201).json({
        success: true,
        message: 'Account created successfully! Welcome to IndiChat.',
        user: result.user,
        token: result.token,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      res.status(400).json({ error: message });
    }
  });

  // User Forgot Password Request
  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { identifier } = req.body;
    if (!identifier) {
      res.status(400).json({ error: 'Email address or phone number is required.' });
      return;
    }
    // Simulation with secure messaging
    res.json({
      success: true,
      message: `If an account with "${identifier}" exists in our system, a secure verification link has been dispatched via SMS / Encrypted Email.`,
    });
  });

  // --- ADMIN AUTHENTICATION & SECURITY ---
  // In-memory brute force protection tracking: IP -> { failedCount, lockedUntil }
  const adminLoginAttempts = new Map<string, { failedCount: number; lockedUntil: number }>();

  // Cleanup rate limiter entries periodically (every 10 minutes)
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of adminLoginAttempts.entries()) {
      if (entry.lockedUntil < now && entry.failedCount === 0) {
        adminLoginAttempts.delete(ip);
      }
    }
  }, 10 * 60 * 1000);

  // Admin Login with Server-Side PBKDF2 Verification & Brute-Force Rate Limiting
  app.post('/api/admin/login', (req: Request, res: Response) => {
    try {
      const clientIp =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.socket.remoteAddress ||
        'unknown';
      const now = Date.now();

      // Check brute-force lockout
      const attemptRecord = adminLoginAttempts.get(clientIp);
      if (attemptRecord && attemptRecord.lockedUntil > now) {
        const remainingMinutes = Math.ceil((attemptRecord.lockedUntil - now) / 60000);
        res.status(429).json({
          success: false,
          error: `Too many failed administrator login attempts. Access temporarily locked for ${remainingMinutes} minute(s).`,
          code: 'ADMIN_RATE_LIMITED',
        });
        return;
      }

      const { usernameOrEmail, password } = req.body;

      if (!usernameOrEmail || typeof usernameOrEmail !== 'string' || !password || typeof password !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Administrator username and password are required.',
          code: 'MISSING_CREDENTIALS',
        });
        return;
      }

      const trimmedIdentifier = usernameOrEmail.trim();
      const isValid = dbManager.verifyAdminCredentials(trimmedIdentifier, password);

      if (!isValid) {
        const current = adminLoginAttempts.get(clientIp) || { failedCount: 0, lockedUntil: 0 };
        current.failedCount += 1;
        if (current.failedCount >= 5) {
          current.lockedUntil = now + 15 * 60 * 1000; // 15-minute security lockout
          current.failedCount = 0;
        }
        adminLoginAttempts.set(clientIp, current);

        dbManager.logAction(
          'FAILED_ADMIN_LOGIN',
          `Failed admin login attempt with identifier "${trimmedIdentifier.slice(0, 30)}" from IP ${clientIp}`
        );

        res.status(401).json({
          success: false,
          error: 'Invalid administrator credentials. Access denied.',
          code: 'INVALID_CREDENTIALS',
        });
        return;
      }

      // Successful verification: reset failed attempts
      adminLoginAttempts.delete(clientIp);

      const sessionToken = dbManager.createAdminSession(trimmedIdentifier);
      const configuredAdminUsername = (process.env.ADMIN_USERNAME || 'UP74AB4513').trim();

      res.json({
        success: true,
        message: 'Administrator authentication verified',
        token: sessionToken,
        admin: {
          username: configuredAdminUsername,
          role: 'SUPER_ADMIN',
        },
      });
    } catch (err) {
      console.error('Admin login error:', err);
      res.status(500).json({ success: false, error: 'Authentication service temporarily unavailable' });
    }
  });

  // Verify Admin Session Token
  app.get('/api/admin/verify', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const customHeader = req.headers['x-admin-token'] as string | undefined;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]?.trim();
    } else if (customHeader) {
      token = customHeader.trim();
    }

    if (!token) {
      res.status(401).json({ valid: false, error: 'No authorization token provided' });
      return;
    }

    const session = dbManager.verifyAdminSession(token);
    if (!session) {
      res.status(401).json({ valid: false, error: 'Session expired or invalid' });
      return;
    }

    res.json({
      valid: true,
      adminEmail: session.adminEmail,
      expiresAt: session.expiresAt,
    });
  });

  // --- PROTECTED ADMIN MIDDLEWARE ---
  const requireAdminAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const customHeader = req.headers['x-admin-token'] as string | undefined;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]?.trim();
    } else if (customHeader) {
      token = customHeader.trim();
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: Admin authentication token required',
        code: 'MISSING_ADMIN_TOKEN',
      });
      return;
    }

    // Verify token structure (64-character hex string)
    if (!/^[a-f0-9]{64}$/i.test(token)) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: Malformed admin authentication token',
        code: 'INVALID_TOKEN_FORMAT',
      });
      return;
    }

    const session = dbManager.verifyAdminSession(token);
    if (!session) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: Admin session expired or invalid',
        code: 'SESSION_EXPIRED',
      });
      return;
    }

    req.adminSession = session;
    next();
  };

  // --- PROTECTED ADMIN API ENDPOINTS ---
  // Admin Logout
  app.post('/api/admin/logout', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    if (req.adminSession) {
      dbManager.destroyAdminSession(req.adminSession.token);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Admin Overview Stats & Data
  app.get('/api/admin/overview', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
    try {
      const stats = dbManager.getAdminStats();
      const contactInfo = dbManager.getContactInfo();
      const registrationLink = dbManager.getRegistrationLink();
      const socialLinks = dbManager.getAllSocialLinks();
      const settings = dbManager.getSettings();
      const auditLogs = dbManager.getAuditLogs().slice(0, 15);

      res.json({
        success: true,
        stats,
        contactInfo,
        registrationLink,
        socialLinks,
        settings,
        auditLogs,
      });
    } catch (err) {
      console.error('Error fetching admin overview:', err);
      res.status(500).json({ error: 'Failed to fetch admin overview' });
    }
  });

  // Dedicated stats endpoint
  app.get('/api/admin/stats', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
    try {
      const stats = dbManager.getAdminStats();
      res.json({ success: true, stats });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
  });

  // Dedicated data visualization & analytics endpoint
  app.get('/api/admin/analytics', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const range = (req.query.range as string) || '30d';
      const analytics = dbManager.getAnalyticsData(range);
      res.json({ success: true, analytics });
    } catch (err) {
      console.error('Error fetching admin analytics:', err);
      res.status(500).json({ error: 'Failed to generate admin analytics data' });
    }
  });

  // Dedicated audit logs endpoint
  app.get('/api/admin/audit-logs', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
    try {
      const auditLogs = dbManager.getAuditLogs().slice(0, 30);
      res.json({ success: true, auditLogs });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
  });

  // Registration Link Management
  app.get('/api/admin/registration-link', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
    res.json({ success: true, registrationLink: dbManager.getRegistrationLink() });
  });

  app.post('/api/admin/registration-link', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title, destinationUrl, isEnabled, description, openInNewTab } = req.body;
      const adminEmail = req.adminSession?.adminEmail || 'admin';

      if (!destinationUrl) {
        res.status(400).json({ error: 'Destination URL is required.' });
        return;
      }

      // Basic URL validation
      try {
        new URL(destinationUrl);
      } catch {
        res.status(400).json({ error: 'Please provide a valid URL format (e.g., https://example.com/join).' });
        return;
      }

      const updated = dbManager.updateRegistrationLink(
        {
          title: title || 'IndiChat Registration Link',
          destinationUrl: destinationUrl.trim(),
          isEnabled: Boolean(isEnabled),
          description: description || '',
          openInNewTab: openInNewTab !== undefined ? Boolean(openInNewTab) : true,
        },
        adminEmail
      );

      res.json({
        success: true,
        message: 'Registration link updated successfully. Public website updated!',
        registrationLink: updated,
      });
    } catch (err) {
      console.error('Error updating registration link:', err);
      res.status(500).json({ error: 'Failed to update registration link' });
    }
  });

  // Contact Information Management
  app.get('/api/admin/contact-info', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
    res.json({ success: true, contactInfo: dbManager.getContactInfo() });
  });

  app.post('/api/admin/contact-info', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { privacyEmail, supportEmail, businessEmail, phoneNumber, websiteAddress, address } = req.body;
      const adminEmail = req.adminSession?.adminEmail || 'admin';

      if (!privacyEmail || !supportEmail) {
        res.status(400).json({ error: 'Privacy email and support email are required.' });
        return;
      }

      const updated = dbManager.updateContactInfo(
        {
          privacyEmail: privacyEmail.trim(),
          supportEmail: supportEmail.trim(),
          businessEmail: businessEmail ? businessEmail.trim() : '',
          phoneNumber: phoneNumber ? phoneNumber.trim() : '',
          websiteAddress: websiteAddress ? websiteAddress.trim() : '',
          address: address ? address.trim() : '',
        },
        adminEmail
      );

      res.json({
        success: true,
        message: 'Contact information updated successfully. Changes are live on public website!',
        contactInfo: updated,
      });
    } catch (err) {
      console.error('Error updating contact info:', err);
      res.status(500).json({ error: 'Failed to update contact information' });
    }
  });

  // Social Media Links Management
  app.get('/api/admin/social-links', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
    res.json({ success: true, socialLinks: dbManager.getAllSocialLinks() });
  });

  app.post('/api/admin/social-links', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { platform, platformName, profileUrl, handle, isEnabled } = req.body;
      const adminEmail = req.adminSession?.adminEmail || 'admin';

      if (!platform || !platformName || !profileUrl) {
        res.status(400).json({ error: 'Platform, platform name, and profile URL are required.' });
        return;
      }

      const existingLinks = dbManager.getAllSocialLinks();
      const newLink = dbManager.addSocialLink(
        {
          platform,
          platformName: platformName.trim(),
          profileUrl: profileUrl.trim(),
          handle: handle ? handle.trim() : undefined,
          isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : true,
          order: existingLinks.length + 1,
        },
        adminEmail
      );

      res.status(201).json({
        success: true,
        message: `${newLink.platformName} added successfully.`,
        socialLink: newLink,
      });
    } catch (err) {
      console.error('Error creating social link:', err);
      res.status(500).json({ error: 'Failed to create social link' });
    }
  });

  app.put('/api/admin/social-links/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const adminEmail = req.adminSession?.adminEmail || 'admin';

      const updated = dbManager.updateSocialLink(id, updates, adminEmail);
      if (!updated) {
        res.status(404).json({ error: 'Social link not found' });
        return;
      }

      res.json({
        success: true,
        message: `${updated.platformName} updated successfully.`,
        socialLink: updated,
      });
    } catch (err) {
      console.error('Error updating social link:', err);
      res.status(500).json({ error: 'Failed to update social link' });
    }
  });

  app.delete('/api/admin/social-links/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const adminEmail = req.adminSession?.adminEmail || 'admin';

      const success = dbManager.deleteSocialLink(id, adminEmail);
      if (!success) {
        res.status(404).json({ error: 'Social link not found' });
        return;
      }

      res.json({ success: true, message: 'Social link deleted successfully.' });
    } catch (err) {
      console.error('Error deleting social link:', err);
      res.status(500).json({ error: 'Failed to delete social link' });
    }
  });

  app.patch('/api/admin/social-links/:id/toggle', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const adminEmail = req.adminSession?.adminEmail || 'admin';

      const toggled = dbManager.toggleSocialLink(id, adminEmail);
      if (!toggled) {
        res.status(404).json({ error: 'Social link not found' });
        return;
      }

      res.json({
        success: true,
        message: `${toggled.platformName} is now ${toggled.isEnabled ? 'ENABLED' : 'DISABLED'}.`,
        socialLink: toggled,
      });
    } catch (err) {
      console.error('Error toggling social link:', err);
      res.status(500).json({ error: 'Failed to toggle social link' });
    }
  });

  // Website Settings Management
  app.get('/api/admin/settings', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
    res.json({ success: true, settings: dbManager.getSettings() });
  });

  app.post('/api/admin/settings', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const updates = req.body;
      const adminEmail = req.adminSession?.adminEmail || 'admin';

      const updated = dbManager.updateSettings(updates, adminEmail);
      res.json({
        success: true,
        message: 'Website settings saved and live.',
        settings: updated,
      });
    } catch (err) {
      console.error('Error updating settings:', err);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // Audit Logs
  app.get('/api/admin/logs', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
    res.json({ success: true, logs: dbManager.getAuditLogs() });
  });

  // --- ADMIN APK RELEASE MANAGEMENT ---
  // Get APK Release config
  app.get('/api/admin/apk', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
    try {
      const apk = dbManager.getApkConfig();
      res.json({ success: true, apk });
    } catch (err) {
      console.error('Error fetching admin APK config:', err);
      res.status(500).json({ error: 'Failed to retrieve APK configuration' });
    }
  });

  // Upload new APK file
  app.post(
    '/api/admin/apk/upload',
    requireAdminAuth,
    uploadApkMiddleware.single('apkFile'),
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        if (!req.file) {
          res.status(400).json({ error: 'Please select a valid .apk file to upload.' });
          return;
        }

        const adminEmail = req.adminSession?.adminEmail || 'admin';
        const sha256 = await computeFileSha256Async(req.file.path);
        const fileSizeBytes = req.file.size;
        const fileSizeFormatted = formatBytes(fileSizeBytes);

        const {
          versionName,
          versionCode,
          releaseNotes,
          minAndroidVersion,
          packageName,
          appName,
          directDownloadEnabled,
          displayStatus,
        } = req.body;

        const updated = dbManager.updateApkConfig(
          {
            fileName: req.file.filename,
            fileSizeBytes,
            fileSizeFormatted,
            sha256,
            versionName: versionName && versionName.trim() ? versionName.trim() : 'v2.4.2',
            versionCode: versionCode ? parseInt(versionCode, 10) : Math.floor(Date.now() / 1000),
            releaseNotes:
              releaseNotes && releaseNotes.trim()
                ? releaseNotes.trim()
                : '• New optimized release build with security enhancements.',
            minAndroidVersion:
              minAndroidVersion && minAndroidVersion.trim()
                ? minAndroidVersion.trim()
                : 'Android 8.0 (Oreo) or higher',
            packageName: packageName && packageName.trim() ? packageName.trim() : 'com.indichat.app',
            appName: appName && appName.trim() ? appName.trim() : 'IndiChat: Private & Secure Super App',
            downloadUrl: '/api/apk/download',
            sourceType: 'uploaded',
            displayStatus: displayStatus || (directDownloadEnabled !== undefined ? (directDownloadEnabled === 'true' || directDownloadEnabled === true ? 'active' : 'paused') : 'active'),
            directDownloadEnabled: directDownloadEnabled !== undefined ? directDownloadEnabled === 'true' || directDownloadEnabled === true : (displayStatus === 'active'),
            uploadedAt: new Date().toISOString(),
          },
          adminEmail
        );

        res.json({
          success: true,
          message: `APK "${req.file.filename}" uploaded successfully (${fileSizeFormatted}). Version ${updated.versionName} is now live!`,
          apk: updated,
        });
      } catch (err: unknown) {
        console.error('Error uploading APK file:', err);
        const message = err instanceof Error ? err.message : 'Failed to process APK upload';
        res.status(500).json({ error: message });
      }
    }
  );

  // --- CHUNKED APK UPLOADS FOR HIGH-PERFORMANCE & LARGE FILES ---
  // 1. Initialize chunked upload session
  app.post('/api/admin/apk/chunk/init', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { fileName, fileSizeBytes, totalChunks, chunkSize, metadata } = req.body;

      if (!fileName || !fileSizeBytes || !totalChunks) {
        res.status(400).json({
          success: false,
          error: 'Missing required parameters: fileName, fileSizeBytes, totalChunks.',
        });
        return;
      }

      const cleanFileName = String(fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
      const adminEmail = req.adminSession?.adminEmail || 'admin';

      const session = createChunkSession({
        fileName: cleanFileName,
        fileSizeBytes: Number(fileSizeBytes),
        totalChunks: Number(totalChunks),
        chunkSize: Number(chunkSize) || 2.5 * 1024 * 1024,
        metadata: metadata || {},
        adminEmail,
      });

      res.json({
        success: true,
        uploadId: session.uploadId,
        fileName: session.fileName,
        chunkSize: session.chunkSize,
        totalChunks: session.totalChunks,
      });
    } catch (err) {
      console.error('Error initializing chunked upload session:', err);
      res.status(500).json({
        success: false,
        error: err instanceof Error ? err.message : 'Failed to initialize chunked upload',
      });
    }
  });

  // 2. Upload individual chunk
  app.post(
    '/api/admin/apk/chunk/upload',
    requireAdminAuth,
    uploadChunkMiddleware.single('chunk'),
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const { uploadId, chunkIndex } = req.body;

        if (!uploadId || chunkIndex === undefined || !req.file) {
          res.status(400).json({
            success: false,
            error: 'Missing chunk upload parameters (uploadId, chunkIndex, or binary file).',
          });
          return;
        }

        const idx = parseInt(String(chunkIndex), 10);
        if (isNaN(idx)) {
          res.status(400).json({ success: false, error: 'chunkIndex must be an integer.' });
          return;
        }

        const result = await saveChunk(uploadId, idx, req.file.path);

        res.json({
          success: true,
          uploadId,
          chunkIndex: result.chunkIndex,
          uploadedCount: result.uploadedCount,
          totalChunks: result.totalChunks,
          isComplete: result.isComplete,
        });
      } catch (err) {
        console.error('Error saving chunk part:', err);
        // Attempt cleanup of temp uploaded file
        if (req.file?.path && fs.existsSync(req.file.path)) {
          try {
            fs.unlinkSync(req.file.path);
          } catch {
            // ignore
          }
        }
        res.status(500).json({
          success: false,
          error: err instanceof Error ? err.message : 'Failed to process chunk',
        });
      }
    }
  );

  // 3. Complete chunked upload: assemble all parts, calculate SHA-256 and register release
  app.post('/api/admin/apk/chunk/complete', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { uploadId } = req.body;

      if (!uploadId) {
        res.status(400).json({ success: false, error: 'uploadId is required to complete session.' });
        return;
      }

      const assembled = await assembleChunks(uploadId);
      const meta = assembled.metadata || {};

      const displayStatusVal: 'active' | 'paused' | 'hidden' =
        meta.displayStatus === 'paused' || meta.displayStatus === 'hidden'
          ? meta.displayStatus
          : meta.directDownloadEnabled !== undefined
          ? (meta.directDownloadEnabled === 'true' || meta.directDownloadEnabled === true ? 'active' : 'paused')
          : 'active';

      const updated = dbManager.updateApkConfig(
        {
          fileName: assembled.finalFileName,
          fileSizeBytes: assembled.fileSizeBytes,
          fileSizeFormatted: assembled.fileSizeFormatted,
          sha256: assembled.sha256,
          versionName: meta.versionName && meta.versionName.trim() ? meta.versionName.trim() : 'v2.4.2',
          versionCode: meta.versionCode ? parseInt(String(meta.versionCode), 10) : Math.floor(Date.now() / 1000),
          releaseNotes:
            meta.releaseNotes && meta.releaseNotes.trim()
              ? meta.releaseNotes.trim()
              : '• New optimized release build with security enhancements.',
          minAndroidVersion:
            meta.minAndroidVersion && meta.minAndroidVersion.trim()
              ? meta.minAndroidVersion.trim()
              : 'Android 8.0 (Oreo) or higher',
          packageName: meta.packageName && meta.packageName.trim() ? meta.packageName.trim() : 'com.indichat.app',
          appName: meta.appName && meta.appName.trim() ? meta.appName.trim() : 'IndiChat: Private & Secure Super App',
          downloadUrl: '/api/apk/download',
          sourceType: 'uploaded',
          displayStatus: displayStatusVal,
          directDownloadEnabled: meta.directDownloadEnabled !== undefined ? (meta.directDownloadEnabled === 'true' || meta.directDownloadEnabled === true) : (displayStatusVal === 'active'),
          uploadedAt: new Date().toISOString(),
        },
        assembled.adminEmail
      );

      res.json({
        success: true,
        message: `APK "${assembled.finalFileName}" assembled successfully (${assembled.fileSizeFormatted}). Version ${updated.versionName} is now live!`,
        apk: updated,
      });
    } catch (err) {
      console.error('Error assembling chunked APK upload:', err);
      res.status(500).json({
        success: false,
        error: err instanceof Error ? err.message : 'Failed to finalize chunked APK upload',
      });
    }
  });

  // 4. Cancel chunked upload session
  app.post('/api/admin/apk/chunk/cancel', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { uploadId } = req.body;
      if (uploadId) {
        cancelChunkSession(uploadId);
      }
      res.json({ success: true, message: 'Chunked upload session cancelled and purged.' });
    } catch (err) {
      console.error('Error cancelling chunked session:', err);
      res.status(500).json({ success: false, error: 'Failed to cancel chunked session' });
    }
  });

  // 5. Query chunk upload status (supports upload resumption)
  app.get('/api/admin/apk/chunk/status/:uploadId', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    const { uploadId } = req.params;
    const session = getChunkSession(uploadId);
    if (!session) {
      res.status(404).json({ success: false, error: 'Session not found or expired' });
      return;
    }

    res.json({
      success: true,
      uploadId: session.uploadId,
      fileName: session.fileName,
      totalChunks: session.totalChunks,
      uploadedCount: session.uploadedChunks.size,
      uploadedChunks: Array.from(session.uploadedChunks).sort((a, b) => a - b),
    });
  });

  // Update APK configuration (version, notes, toggle direct download, external url)
  app.put('/api/admin/apk/config', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const updates = req.body;
      const adminEmail = req.adminSession?.adminEmail || 'admin';

      const updated = dbManager.updateApkConfig(updates, adminEmail);
      res.json({
        success: true,
        message: 'APK release settings updated successfully.',
        apk: updated,
      });
    } catch (err) {
      console.error('Error updating APK config:', err);
      res.status(500).json({ error: 'Failed to update APK settings' });
    }
  });

  // --- ADMIN WEBSITE LOGO & BRANDING MANAGEMENT ---
  // Get current Logo config
  app.get('/api/admin/logo', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
    try {
      const logo = dbManager.getLogoConfig();
      res.json({ success: true, logo });
    } catch (err) {
      console.error('Error fetching admin logo config:', err);
      res.status(500).json({ error: 'Failed to retrieve website logo configuration' });
    }
  });

  // Upload new logo image file
  app.post(
    '/api/admin/logo/upload',
    requireAdminAuth,
    uploadLogoMiddleware.single('logoFile'),
    (req: AuthenticatedRequest, res: Response) => {
      try {
        if (!req.file) {
          res.status(400).json({ error: 'Please select a valid image file (PNG, SVG, JPG, WebP, ICO) to upload.' });
          return;
        }

        const adminEmail = req.adminSession?.adminEmail || 'admin';
        const imageUrl = `/api/public/logo/image/${req.file.filename}`;
        const { altText, brandText, shape, heightPx, showBrandText, taglineText } = req.body;

        const updated = dbManager.updateLogoConfig(
          {
            logoType: 'image',
            imageUrl,
            fileName: req.file.originalname,
            fileSizeBytes: req.file.size,
            altText: altText && altText.trim() ? altText.trim() : 'Website Logo',
            brandText: brandText !== undefined ? brandText.trim() : 'IndiChat',
            taglineText: taglineText !== undefined ? taglineText.trim() : undefined,
            showBrandText: showBrandText !== undefined ? showBrandText === 'true' || showBrandText === true : true,
            shape: shape || 'rounded',
            heightPx: heightPx ? parseInt(heightPx, 10) : 42,
          },
          adminEmail
        );

        res.json({
          success: true,
          message: `Logo image "${req.file.originalname}" uploaded and activated successfully across the website!`,
          logo: updated,
        });
      } catch (err: unknown) {
        console.error('Error uploading logo file:', err);
        const message = err instanceof Error ? err.message : 'Failed to process logo upload';
        res.status(500).json({ error: message });
      }
    }
  );

  // Update logo configuration (switch between image/icon/text, external URL, presets, sizing, shape, brand text)
  app.put('/api/admin/logo', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const updates = req.body;
      const adminEmail = req.adminSession?.adminEmail || 'admin';

      const updated = dbManager.updateLogoConfig(updates, adminEmail);
      res.json({
        success: true,
        message: 'Website logo updated and activated successfully across the website.',
        logo: updated,
      });
    } catch (err) {
      console.error('Error updating logo config:', err);
      res.status(500).json({ error: 'Failed to update website logo configuration' });
    }
  });

  // Reset logo configuration to official default preset
  app.post('/api/admin/logo/reset', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const adminEmail = req.adminSession?.adminEmail || 'admin';
      const reset = dbManager.resetLogoConfig(adminEmail);
      res.json({
        success: true,
        message: 'Website logo reset to official default IndiChat preset.',
        logo: reset,
      });
    } catch (err) {
      console.error('Error resetting logo config:', err);
      res.status(500).json({ error: 'Failed to reset website logo' });
    }
  });

  // --- VITE / STATIC FILE SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[IndiChat Server] Running on http://localhost:${PORT}`);
  });

  // Keep connections alive and allow up to 10 minutes for large APK file uploads
  server.keepAliveTimeout = 120000;
  server.headersTimeout = 125000;
  server.requestTimeout = 600000;
}

startServer();
