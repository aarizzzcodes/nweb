/**
 * Resolves static media asset paths so they work reliably across
 * root domains ('/') and GitHub Pages subpath repositories (e.g. '/nweb/').
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
  const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${trimmed}`;
};
