import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

// Lazy init to avoid build-time errors when env vars aren't set
let ratelimitInstance: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimitInstance) return ratelimitInstance;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn("[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN not set, rate limiting disabled");
    return null;
  }
  ratelimitInstance = new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(100, "60 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
  });
  return ratelimitInstance;
}

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number = 60_000
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const rl = getRatelimit();
  if (!rl) {
    // Fallback: allow all if Redis not configured
    return { allowed: true, remaining: limit, resetIn: 0 };
  }

  const { success, remaining, reset } = await rl.limit(key);
  return {
    allowed: success,
    remaining,
    resetIn: Math.max(0, reset - Date.now()),
  };
}

export function rateLimitResponse(resetIn: number): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil(resetIn / 1000)),
        "X-RateLimit-Remaining": "0",
      },
    }
  );
}
