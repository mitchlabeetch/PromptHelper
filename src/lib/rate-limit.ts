// Simple in-memory rate limiter for API protection
// For production, consider using Redis or a proper rate limiting service

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 } // 10 requests per minute by default
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  // Initialize or get existing entry
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + config.windowMs,
    };
  }

  // Increment counter
  store[key].count++;

  const allowed = store[key].count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - store[key].count);

  return {
    allowed,
    remaining,
    resetTime: store[key].resetTime,
  };
}

export function getClientIdentifier(req: Request): string {
  // Try to get IP from various headers (for different hosting providers)
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  
  // Use the first available identifier
  const ip = forwarded?.split(",")[0] || realIp || cfConnectingIp || "unknown";
  
  return ip;
}
