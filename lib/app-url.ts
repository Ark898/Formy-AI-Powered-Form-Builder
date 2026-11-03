const FALLBACK_APP_URL = "http://localhost:3000";

function normalizeBaseUrl(value: string | undefined): string | null {
  if (!value) return null;

  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return trimmed;
  } catch {
    return null;
  }
}

function isLoopbackUrl(value: string): boolean {
  try {
    const { hostname } = new URL(value);
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname === "[::1]"
    );
  } catch {
    return false;
  }
}

export function getAppUrl(): string {
  const configured = normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL);
  // A leftover localhost value would break every link on a deployed instance.
  if (configured && !(process.env.VERCEL && isLoopbackUrl(configured))) {
    return configured;
  }

  const productionHost = normalizeBaseUrl(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined
  );
  if (productionHost) return productionHost;

  const deploymentHost = normalizeBaseUrl(
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined
  );
  if (deploymentHost) return deploymentHost;

  return FALLBACK_APP_URL;
}
