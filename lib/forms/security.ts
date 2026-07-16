interface RateWindow {
  count: number;
  resetAt: number;
}

interface IdempotencyEntry<T> {
  fingerprint: string;
  expiresAt: number;
  promise: Promise<T>;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export type IdempotencyResult<T> =
  | { kind: "executed"; value: T }
  | { kind: "replayed"; value: T }
  | { kind: "conflict" }
  | { kind: "capacity" };

const rateWindows = new Map<string, RateWindow>();
const idempotencyEntries = new Map<string, IdempotencyEntry<unknown>>();
export const FORM_SECURITY_ENTRY_LIMIT = 5_000;

export const MAX_IDEMPOTENCY_KEY_LENGTH = 128;

export async function hashValue(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function rateLimitIdentity(request: Pick<Request, "headers">): Promise<string> {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const raw = request.headers.get("cf-connecting-ip")?.trim() || forwarded || "anonymous";
  return hashValue(raw);
}

export function checkRateLimit(
  key: string,
  options: { limit: number; windowMs: number; now?: number },
): RateLimitResult {
  const now = options.now ?? Date.now();
  const limit = Math.max(1, options.limit);
  const windowMs = Math.max(1_000, options.windowMs);
  if (rateWindows.size >= FORM_SECURITY_ENTRY_LIMIT) {
    for (const [storedKey, stored] of rateWindows) {
      if (stored.resetAt <= now) rateWindows.delete(storedKey);
    }
    if (rateWindows.size >= FORM_SECURITY_ENTRY_LIMIT && !rateWindows.has(key)) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil(windowMs / 1000)),
      };
    }
  }
  let entry = rateWindows.get(key);

  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
    rateWindows.set(key, entry);
  }

  entry.count += 1;
  const allowed = entry.count <= limit;
  const remaining = Math.max(0, limit - entry.count);
  const retryAfterSeconds = allowed ? 0 : Math.max(1, Math.ceil((entry.resetAt - now) / 1000));

  return { allowed, remaining, retryAfterSeconds };
}

export function stableSerialize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? String(value);
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableSerialize(record[key])}`)
    .join(",")}}`;
}

export async function runIdempotent<T>(
  key: string,
  fingerprint: string,
  work: () => Promise<T>,
  options: { ttlMs?: number; now?: number; shouldCache?: (value: T) => boolean } = {},
): Promise<IdempotencyResult<T>> {
  const now = options.now ?? Date.now();
  if (idempotencyEntries.size >= FORM_SECURITY_ENTRY_LIMIT) {
    for (const [storedKey, stored] of idempotencyEntries) {
      if (stored.expiresAt <= now) idempotencyEntries.delete(storedKey);
    }
  }
  const existing = idempotencyEntries.get(key) as IdempotencyEntry<T> | undefined;
  if (existing && existing.expiresAt > now) {
    if (existing.fingerprint !== fingerprint) return { kind: "conflict" };
    return { kind: "replayed", value: await existing.promise };
  }
  if (existing) idempotencyEntries.delete(key);

  // Preserve active and completed keys rather than weakening duplicate
  // protection under an extreme burst of unique submissions.
  if (idempotencyEntries.size >= FORM_SECURITY_ENTRY_LIMIT) {
    return { kind: "capacity" };
  }

  const ttlMs = Math.max(1_000, options.ttlMs ?? 15 * 60_000);
  const promise = work();
  const entry: IdempotencyEntry<T> = { fingerprint, expiresAt: now + ttlMs, promise };
  idempotencyEntries.set(key, entry as IdempotencyEntry<unknown>);

  try {
    const value = await promise;
    if (options.shouldCache && !options.shouldCache(value)) {
      if (idempotencyEntries.get(key)?.promise === promise) idempotencyEntries.delete(key);
    }
    return { kind: "executed", value };
  } catch (error) {
    if (idempotencyEntries.get(key)?.promise === promise) idempotencyEntries.delete(key);
    throw error;
  }
}

export function resetFormSecurityStateForTests(): void {
  rateWindows.clear();
  idempotencyEntries.clear();
}
