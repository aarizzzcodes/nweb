/**
 * Resolves static media asset paths so they work reliably across
 * root domains ('/'), Vite preview, and GitHub Pages subpath repositories (e.g. '/nweb/').
 * Also cleanly handles URL encoding for filenames with spaces and parentheses.
 */
export const resolveMediaPath = (rawPath?: string): string => {
  if (!rawPath) return '';
  if (
    rawPath.startsWith('blob:') ||
    rawPath.startsWith('data:') ||
    rawPath.startsWith('http://') ||
    rawPath.startsWith('https://')
  ) {
    return rawPath;
  }

  // Remove leading slash or dot-slash
  const trimmed = rawPath.replace(/^(\.\/|\/)/, '');

  // Split path into segments and encode each segment properly
  // so that "media/sensors/temp hum.JPG" or "angle tilt (2).JPG"
  // resolves correctly to valid URLs without 404 or bad character decoding
  const encodedSegments = trimmed.split('/').map((segment) => encodeURIComponent(segment));
  const encodedPath = encodedSegments.join('/');

  const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${encodedPath}`;
};
