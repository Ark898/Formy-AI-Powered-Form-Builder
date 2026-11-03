type RateLimitRecord = {
  timestamps: number[];
};

class RateLimiter {
  private cache: Map<string, RateLimitRecord>;

  constructor() {
    // Use global object to persist map across hot reloads in development
    const globalAny = global as any;
    if (!globalAny.customRateLimitCache) {
      globalAny.customRateLimitCache = new Map<string, RateLimitRecord>();
    }
    this.cache = globalAny.customRateLimitCache;

    // Periodically clean up the cache to prevent memory leaks (every 10 minutes)
    if (!globalAny.rateLimitCleanupInterval) {
      globalAny.rateLimitCleanupInterval = setInterval(() => this.cleanup(), 10 * 60 * 1000);
    }
  }

  /**
   * Professional-grade Sliding Window Log rate limit algorithm
   */
  public async limit(identifier: string, maxRequests: number, windowMs: number): Promise<{ success: boolean }> {
    const now = Date.now();
    const record = this.cache.get(identifier);

    if (!record) {
      this.cache.set(identifier, { timestamps: [now] });
      return { success: true };
    }

    // Filter out timestamps that are strictly outside the sliding window
    const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

    if (validTimestamps.length >= maxRequests) {
      // Limit exceeded. Update cache to drop old timestamps anyway.
      this.cache.set(identifier, { timestamps: validTimestamps });
      return { success: false };
    }

    // Accept request, push new timestamp
    validTimestamps.push(now);
    this.cache.set(identifier, { timestamps: validTimestamps });

    return { success: true };
  }

  // Garbage collection to prevent memory leaks over time
  private cleanup() {
    const now = Date.now();
    // Define the maximum possible window size (1 hour) to safely garbage collect
    const maxWindowMs = 60 * 60 * 1000; 
    
    this.cache.forEach((record, key) => {
      const validTimestamps = record.timestamps.filter((ts: number) => now - ts < maxWindowMs);
      if (validTimestamps.length === 0) {
        this.cache.delete(key);
      } else {
        this.cache.set(key, { timestamps: validTimestamps });
      }
    });
  }
}

const rateLimiter = new RateLimiter();

export const checkAiRateLimit = async (identifier: string) => {
  // AI limit: 5 requests per 1 minute
  return await rateLimiter.limit(`ai:${identifier}`, 5, 60 * 1000); 
};

export const checkFormCreationRateLimit = async (identifier: string) => {
  // Form creation limit: 10 forms per 1 hour
  return await rateLimiter.limit(`form-creation:${identifier}`, 10, 60 * 60 * 1000); 
};

export const checkFormResponseRateLimit = async (identifier: string) => {
  // Form response limit: 30 responses per 1 minute
  return await rateLimiter.limit(`form-response:${identifier}`, 30, 60 * 1000); 
};
