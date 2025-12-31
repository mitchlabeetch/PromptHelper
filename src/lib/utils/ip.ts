/**
 * Extracts the client IP from the request headers.
 * Handles x-forwarded-for headers with multiple proxies by taking the first IP.
 */
export function getIP(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "unknown";
}
