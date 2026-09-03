import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { dbManager } from './server/db';
import {
  ensureDefaultApkFile,
  APK_STORAGE_DIR,
  formatBytes,
  computeFileSha256,
} from './server/apkStorage';

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
    ensureDefaultApkFile();
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
  limits: { fileSize: 250 * 1024 * 1024 }, // 250 MB
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
      timestamp: new Date().toISOString(),
    });
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

  // --- ADMIN AUTHENTICATION ---
  // Admin Login with Server-Side Salting & PBKDF2 Verification
  app.post('/api/admin/login', (req: Request, res: Response) => {
    try {
      const { usernameOrEmail, password } = req.body;

      if (!usernameOrEmail || !password) {
        res.status(400).json({ error: 'Admin username/email and password are required.' });
        return;
      }

      const isValid = dbManager.verifyAdminCredentials(usernameOrEmail, password);
      if (!isValid) {
        res.status(401).json({ error: 'Invalid administrator credentials. Access denied.' });
        return;
      }

      const sessionToken = dbManager.createAdminSession(usernameOrEmail);
      res.json({
        success: true,
        message: 'Administrator authentication verified',
        token: sessionToken,
        admin: {
          email: usernameOrEmail,
          role: 'SUPER_ADMIN',
        },
      });
    } catch (err) {
      console.error('Admin login error:', err);
      res.status(500).json({ error: 'Authentication service temporarily unavailable' });
    }
  });

  // Verify Admin Session Token
  app.get('/api/admin/verify', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ valid: false, error: 'No authorization token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
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
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const session = dbManager.verifyAdminSession(token);
    if (!session) {
      res.status(401).json({ error: 'Unauthorized: Admin session expired or invalid' });
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
    (req: AuthenticatedRequest, res: Response) => {
      try {
        if (!req.file) {
          res.status(400).json({ error: 'Please select a valid .apk file to upload.' });
          return;
        }

        const adminEmail = req.adminSession?.adminEmail || 'admin';
        const sha256 = computeFileSha256(req.file.path);
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[IndiChat Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
