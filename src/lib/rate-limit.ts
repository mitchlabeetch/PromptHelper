export class RateLimiter {
  private requests: Map<string, number[]>;
  private limit: number;
  private interval: number;

  constructor(limit: number, interval: number) {
    this.requests = new Map();
    this.limit = limit;
    this.interval = interval;
  }

  check(ip: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(ip) || [];

    // Remove timestamps older than the interval
    const validTimestamps = timestamps.filter(ts => now - ts < this.interval);

    if (validTimestamps.length >= this.limit) {
      return false;
    }

    validTimestamps.push(now);
    this.requests.set(ip, validTimestamps);
    return true;
  }
}

// Create a global instance to persist across invocations in some environments
// Note: In serverless (like Vercel), this only persists if the container is reused.
// For strict enforcement, use Redis/Upstash.
declare global {
  var rateLimiter: RateLimiter | undefined;
}

export const rateLimiter = global.rateLimiter || new RateLimiter(10, 60 * 1000); // 10 reqs per minute
if (process.env.NODE_ENV !== 'production') global.rateLimiter = rateLimiter;
