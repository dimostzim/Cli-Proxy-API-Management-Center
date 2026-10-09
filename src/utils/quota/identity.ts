import type { AuthFileItem } from '@/types';
import { normalizeRecentRequestAuthIndex } from '@/utils/recentRequests';
import { isDevinFile } from './validators';

const QUOTA_IDENTITY_SEPARATOR = '\0';

/**
 * Cache identity is filename-based for every existing provider. Devin alone can
 * expose multiple credential identities from one physical file, distinguished
 * by auth_index.
 */
export function getQuotaCacheKey(file: AuthFileItem): string {
  if (!isDevinFile(file)) return file.name;
  const authIndex = normalizeRecentRequestAuthIndex(file.authIndex);
  return `${file.name}${QUOTA_IDENTITY_SEPARATOR}${authIndex ?? ''}`;
}

/** Display public provider/account identifiers; account can contain an API key. */
export function getQuotaDisplayName(file: AuthFileItem): string {
  const provider = (file.provider || file.type || 'unknown').trim().toLowerCase();
  const email = file.email?.trim();
  const identity = email || file.name;
  const authIndex =
    isDevinFile(file) && !email ? normalizeRecentRequestAuthIndex(file.authIndex) : null;
  return `${provider} - ${identity}${authIndex ? ` · ${authIndex}` : ''}`;
}

/** Resolve a cache identity back to the physical filename used by file mutations. */
export function getQuotaCacheFileName(key: string): string {
  const separatorIndex = key.indexOf(QUOTA_IDENTITY_SEPARATOR);
  return separatorIndex === -1 ? key : key.slice(0, separatorIndex);
}
