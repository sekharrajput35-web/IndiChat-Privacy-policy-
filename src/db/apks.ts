import { db } from './index.ts';
import { apkReleases } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export async function getLatestApkRelease() {
  try {
    const releases = await db
      .select()
      .from(apkReleases)
      .where(eq(apkReleases.displayStatus, 'active'))
      .orderBy(desc(apkReleases.versionCode), desc(apkReleases.id))
      .limit(1);
    return releases[0] || null;
  } catch (error) {
    console.error('Database query getLatestApkRelease failed:', error);
    throw new Error('Failed to retrieve APK release from database', { cause: error });
  }
}

export async function insertApkRelease(data: typeof apkReleases.$inferInsert) {
  try {
    const res = await db.insert(apkReleases).values(data).returning();
    return res[0];
  } catch (error) {
    console.error('Database insert insertApkRelease failed:', error);
    throw new Error('Failed to save APK release in database', { cause: error });
  }
}
