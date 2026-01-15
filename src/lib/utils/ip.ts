import { NextRequest } from "next/server";

/**
 * Retrieves the client's IP address from the request.
 * Prioritizes Next.js `req.ip` if available, then falls back to standard headers.
 *
 * @param req - The incoming request object (Request or NextRequest)
 * @returns The client IP address or "unknown"
 */
export function getClientIp(req: Request | NextRequest): string {
  // 1. Try Next.js provided IP (most reliable in Vercel/Next.js environment)
  // Casting to any because the type definition might vary across Next.js versions/configurations
  // but the property exists at runtime on NextRequest.
  const ip = (req as any).ip;

  if (ip && typeof ip === "string") {
    return ip;
  }

  // 2. Try x-forwarded-for header
  // Standard format: client, proxy1, proxy2
  // We take the first IP as the original client IP.
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  // 3. Try x-real-ip header
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}
