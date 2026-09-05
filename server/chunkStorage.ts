import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { APK_STORAGE_DIR, ensureApkDirectory, formatBytes } from './apkStorage';

export const CHUNK_STORAGE_DIR = path.join(process.cwd(), 'uploads', 'apk_chunks');

export interface ChunkSessionMetadata {
  versionName?: string;
  versionCode?: number | string;
  releaseNotes?: string;
  minAndroidVersion?: string;
  packageName?: string;
  appName?: string;
  displayStatus?: string;
  directDownloadEnabled?: boolean | string;
}

export interface ChunkSession {
  uploadId: string;
  fileName: string;
  fileSizeBytes: number;
  totalChunks: number;
  chunkSize: number;
  uploadedChunks: Set<number>;
  createdAt: number;
  adminEmail: string;
  metadata: ChunkSessionMetadata;
}

// In-memory sessions index
const chunkSessions = new Map<string, ChunkSession>();

export function ensureChunkDirectory() {
  if (!fs.existsSync(CHUNK_STORAGE_DIR)) {
    fs.mkdirSync(CHUNK_STORAGE_DIR, { recursive: true });
  }
}

/**
 * Initialize a new chunked upload session
 */
export function createChunkSession(params: {
  fileName: string;
  fileSizeBytes: number;
  totalChunks: number;
  chunkSize: number;
  metadata: ChunkSessionMetadata;
  adminEmail: string;
}): ChunkSession {
  ensureChunkDirectory();

  const uploadId = `apk_upload_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  const sessionDir = path.join(CHUNK_STORAGE_DIR, uploadId);
  fs.mkdirSync(sessionDir, { recursive: true });

  const session: ChunkSession = {
    uploadId,
    fileName: params.fileName,
    fileSizeBytes: params.fileSizeBytes,
    totalChunks: params.totalChunks,
    chunkSize: params.chunkSize,
    uploadedChunks: new Set<number>(),
    createdAt: Date.now(),
    adminEmail: params.adminEmail || 'admin',
    metadata: params.metadata || {},
  };

  chunkSessions.set(uploadId, session);
  return session;
}

export function getChunkSession(uploadId: string): ChunkSession | null {
  return chunkSessions.get(uploadId) || null;
}

/**
 * Save an individual chunk file into the session directory
 */
export async function saveChunk(
  uploadId: string,
  chunkIndex: number,
  chunkTempPath: string
): Promise<{
  chunkIndex: number;
  uploadedCount: number;
  totalChunks: number;
  isComplete: boolean;
}> {
  const session = chunkSessions.get(uploadId);
  if (!session) {
    throw new Error('Chunk upload session not found or has expired. Please restart the upload.');
  }

  if (chunkIndex < 0 || chunkIndex >= session.totalChunks) {
    throw new Error(`Invalid chunk index ${chunkIndex}. Expected 0 to ${session.totalChunks - 1}.`);
  }

  const sessionDir = path.join(CHUNK_STORAGE_DIR, uploadId);
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  const targetChunkPath = path.join(sessionDir, `part_${chunkIndex}`);

  // Move or copy chunk file to target path
  await fs.promises.copyFile(chunkTempPath, targetChunkPath);
  try {
    await fs.promises.unlink(chunkTempPath);
  } catch {
    // Ignore cleanup error of temp file
  }

  session.uploadedChunks.add(chunkIndex);

  return {
    chunkIndex,
    uploadedCount: session.uploadedChunks.size,
    totalChunks: session.totalChunks,
    isComplete: session.uploadedChunks.size === session.totalChunks,
  };
}

/**
 * Concatenates all uploaded chunks sequentially into the final APK file,
 * verifies SHA-256 integrity, and cleans up chunk parts.
 */
export async function assembleChunks(uploadId: string): Promise<{
  finalFileName: string;
  finalFilePath: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  sha256: string;
  metadata: ChunkSessionMetadata;
  adminEmail: string;
}> {
  const session = chunkSessions.get(uploadId);
  if (!session) {
    throw new Error('Chunk upload session not found or expired.');
  }

  const sessionDir = path.join(CHUNK_STORAGE_DIR, uploadId);
  if (!fs.existsSync(sessionDir)) {
    throw new Error('Session directory not found on storage disk.');
  }

  // Verify all chunk parts exist
  for (let i = 0; i < session.totalChunks; i++) {
    const chunkPath = path.join(sessionDir, `part_${i}`);
    if (!fs.existsSync(chunkPath)) {
      throw new Error(`Missing chunk part #${i} of ${session.totalChunks}. Please re-upload missing chunks.`);
    }
  }

  ensureApkDirectory();

  const cleanName = session.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const finalName = cleanName.toLowerCase().endsWith('.apk') ? cleanName : `${cleanName}.apk`;
  const finalFilePath = path.join(APK_STORAGE_DIR, finalName);

  // Stream-write all chunk parts into the destination file
  const writeStream = fs.createWriteStream(finalFilePath);
  const hash = crypto.createHash('sha256');

  try {
    for (let i = 0; i < session.totalChunks; i++) {
      const chunkPath = path.join(sessionDir, `part_${i}`);
      await new Promise<void>((resolve, reject) => {
        const readStream = fs.createReadStream(chunkPath);
        readStream.on('data', (chunk) => {
          hash.update(chunk);
        });
        readStream.on('error', reject);
        readStream.on('end', () => resolve());
        readStream.pipe(writeStream, { end: false });
      });
    }

    // Finalize write stream
    await new Promise<void>((resolve, reject) => {
      writeStream.end((err?: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch (assembleErr) {
    // Attempt cleanup of corrupted output
    if (fs.existsSync(finalFilePath)) {
      try {
        fs.unlinkSync(finalFilePath);
      } catch {
        // ignore
      }
    }
    throw new Error(`Failed during chunk assembly: ${assembleErr instanceof Error ? assembleErr.message : String(assembleErr)}`);
  }

  const sha256 = hash.digest('hex');
  const stats = fs.statSync(finalFilePath);

  // Clean up temporary chunk parts directory
  try {
    fs.rmSync(sessionDir, { recursive: true, force: true });
    chunkSessions.delete(uploadId);
  } catch (cleanupErr) {
    console.warn(`[ChunkStorage] Cleanup error for session ${uploadId}:`, cleanupErr);
  }

  return {
    finalFileName: finalName,
    finalFilePath,
    fileSizeBytes: stats.size,
    fileSizeFormatted: formatBytes(stats.size),
    sha256,
    metadata: session.metadata,
    adminEmail: session.adminEmail,
  };
}

/**
 * Cancel an active chunk session and remove any stored chunk files
 */
export function cancelChunkSession(uploadId: string): boolean {
  const session = chunkSessions.get(uploadId);
  const sessionDir = path.join(CHUNK_STORAGE_DIR, uploadId);

  if (fs.existsSync(sessionDir)) {
    try {
      fs.rmSync(sessionDir, { recursive: true, force: true });
    } catch (e) {
      console.warn(`[ChunkStorage] Failed to purge session dir ${uploadId}:`, e);
    }
  }

  chunkSessions.delete(uploadId);
  return !!session;
}

/**
 * Clean up expired sessions (older than 2 hours)
 */
export function cleanupExpiredChunkSessions() {
  const now = Date.now();
  const maxAge = 2 * 60 * 60 * 1000; // 2 hours

  for (const [uploadId, session] of chunkSessions.entries()) {
    if (now - session.createdAt > maxAge) {
      cancelChunkSession(uploadId);
    }
  }

  // Also clean up any orphan directories in CHUNK_STORAGE_DIR
  try {
    if (fs.existsSync(CHUNK_STORAGE_DIR)) {
      const dirs = fs.readdirSync(CHUNK_STORAGE_DIR);
      for (const dir of dirs) {
        const dirPath = path.join(CHUNK_STORAGE_DIR, dir);
        try {
          const stat = fs.statSync(dirPath);
          if (stat.isDirectory() && now - stat.mtimeMs > maxAge) {
            fs.rmSync(dirPath, { recursive: true, force: true });
          }
        } catch {
          // ignore
        }
      }
    }
  } catch (e) {
    console.warn('[ChunkStorage] Periodic cleanup check error:', e);
  }
}

// Run cleanup every 30 minutes
setInterval(cleanupExpiredChunkSessions, 30 * 60 * 1000);
