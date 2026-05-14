/**
 * Backend Discovery Service
 *
 * - In PRODUCTION: the frontend is served from the same Express server,
 *   so all API calls use relative paths (empty string = same origin).
 *   No port scanning needed.
 *
 * - In DEVELOPMENT: scans common localhost ports to find the backend.
 */

const IS_PROD = import.meta.env.PROD; // true when built by Vite for production
const COMMON_PORTS = [5000, 5001, 5002, 5003, 5004, 5005, 8000, 3000, 3001];
const TIMEOUT = 2000;

async function checkBackendOnPort(port: number): Promise<string | null> {
  try {
    const url = `http://localhost:${port}/api/config`;
    const response = await Promise.race([
      fetch(url),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), TIMEOUT)
      ),
    ]);
    if (response.ok) {
      console.log(`✅ Backend found on port ${port}`);
      return `http://localhost:${port}`;
    }
  } catch {
    // Port not available, try next
  }
  return null;
}

async function discoverBackendUrl(): Promise<string> {
  // ── PRODUCTION: same-origin, use relative paths ──────────────
  if (IS_PROD || import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL || "";
    console.log(`🚀 Production mode — backend URL: "${url || "(relative)"}"`);
    localStorage.setItem("backendUrl", url);
    return url;
  }

  // ── DEVELOPMENT: scan localhost ports ─────────────────────────
  console.log("🔍 Discovering backend URL...");
  for (const port of COMMON_PORTS) {
    const backendUrl = await checkBackendOnPort(port);
    if (backendUrl) {
      localStorage.setItem("backendUrl", backendUrl);
      return backendUrl;
    }
  }

  const fallback = "http://localhost:5000";
  console.warn(`⚠️  Could not discover backend. Using fallback: ${fallback}`);
  return fallback;
}

export function getBackendUrl(): string {
  // In production, use relative paths (empty string = same origin)
  if (IS_PROD) {
    return import.meta.env.VITE_API_URL || "";
  }
  const stored = localStorage.getItem("backendUrl");
  return stored || import.meta.env.VITE_API_URL || "http://localhost:5000";
}

export { discoverBackendUrl };
