
const trackers = new Map<string, { count: number; expiresAt: number }>();

/**
 * Basic in-memory rate limiter for Next.js API routes.
 * Note: In a serverless environment, this state is per-lambda instance.
 * For distributed rate limiting, use Redis or a similar external store.
 */
export function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000) {
  const now = Date.now();

  // Prevent memory leaks / DoS on memory
  if (trackers.size > 10000) {
    const cleanupTime = now;
    for (const [key, data] of trackers.entries()) {
      if (data.expiresAt < cleanupTime) {
        trackers.delete(key);
      }
    }
    // If still too big, hard reset to fail open/safe
    if (trackers.size > 10000) {
        trackers.clear();
    }
  }

  const record = trackers.get(ip);

  if (!record || now > record.expiresAt) {
    trackers.set(ip, { count: 1, expiresAt: now + windowMs });
    return { success: true };
  }

  if (record.count >= limit) {
    return { success: false };
  }

  record.count++;
  return { success: true };
}
