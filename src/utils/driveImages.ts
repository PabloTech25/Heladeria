/**
 * Utility to format Google Drive image URLs
 * 
 * Google Drive file URLs come in different formats. This utility
 * converts them to a format that can be used directly in <img> tags.
 */

/**
 * Extracts the file ID from various Google Drive URL formats
 * @param url - Google Drive URL or file ID
 * @returns The file ID
 */
export function extractDriveFileId(url: string): string {
  // If it's already just the ID (no slashes or https)
  if (!url.includes('/') && !url.includes('http')) {
    return url;
  }

  // Extract ID from: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return fileMatch[1];
  }

  // Extract ID from: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    return openMatch[1];
  }

  // Extract ID from: https://drive.google.com/uc?export=view&id=FILE_ID
  const ucMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) {
    return ucMatch[1];
  }

  // If no pattern matches, return the original (might be the ID itself)
  return url;
}

/**
 * Converts a Google Drive URL or file ID to a direct image URL
 * @param urlOrId - Google Drive URL or file ID
 * @returns Direct image URL that can be used in <img> tags
 */
export function getDriveImageUrl(urlOrId: string): string {
  const fileId = extractDriveFileId(urlOrId);
  // Using thumbnail endpoint with high resolution - more reliable than uc endpoint
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}

/**
 * Alternative direct view format (use if thumbnail doesn't work)
 * @param urlOrId - Google Drive URL or file ID
 * @returns Direct image URL
 */
export function getDriveDirectUrl(urlOrId: string): string {
  const fileId = extractDriveFileId(urlOrId);
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

/**
 * Alternative format using thumbnail endpoint (smaller, faster loading)
 * @param urlOrId - Google Drive URL or file ID
 * @param size - Thumbnail size (default: 800)
 * @returns Thumbnail URL
 */
export function getDriveThumbnailUrl(urlOrId: string, size: number = 800): string {
  const fileId = extractDriveFileId(urlOrId);
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}
