import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table authenticated via Firebase Auth
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  activityLogs: many(activityLogs),
}));

// APK Releases & Configuration
export const apkReleases = pgTable('apk_releases', {
  id: serial('id').primaryKey(),
  versionName: text('version_name').notNull(),
  versionCode: integer('version_code').notNull(),
  fileSizeBytes: integer('file_size_bytes').default(0),
  fileSizeFormatted: text('file_size_formatted').default('0 MB'),
  sha256: text('sha256').default(''),
  downloadUrl: text('download_url').notNull(),
  directDownloadEnabled: boolean('direct_download_enabled').default(true),
  minAndroidVersion: text('min_android_version').default('Android 8.0 (Oreo)'),
  targetSdk: text('target_sdk').default('API 34 (Android 14)'),
  releaseNotes: text('release_notes').notNull(),
  sourceType: text('source_type').default('uploaded'),
  displayStatus: text('display_status').default('active'), // 'active' | 'archived' | 'hidden'
  uploadedBy: text('uploaded_by').default('admin'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Beta Testers
export const betaTesters = pgTable('beta_testers', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  deviceModel: text('device_model'),
  androidVersion: text('android_version'),
  status: text('status').default('pending'), // 'pending' | 'approved' | 'invited' | 'active'
  createdAt: timestamp('created_at').defaultNow(),
});

// Contact Inquiries
export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').default('unread'), // 'unread' | 'read' | 'replied'
  createdAt: timestamp('created_at').defaultNow(),
});

// Admin / System Activity Logs
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  actor: text('actor').notNull().default('admin'),
  action: text('action').notNull(),
  category: text('category').default('general'),
  details: text('details'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));
