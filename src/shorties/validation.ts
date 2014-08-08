export function isInvalidUrl(url) {
  if (!url || url.length === 0) return true;
  return false;
}

export function isInvalidSlug(slug) {
  if (!slug || slug.length === 0) return true;
  if (/\#|\?|\//.test(slug)) return true;
  return false;
}

export function isBlacklistedSlug(url) {
  switch (url) {
    case 'login':
    case 'logout':
    case 'me':
    case 'admin':
    case 'api':
    case 'public':
      return true;
  }
  return false;
}
