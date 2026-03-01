const BASE = process.env.MC_API_BASE_URL || "https://mc-api.elevatestudios.io";
const KEY = process.env.MC_API_KEY || "";

export async function mcFetch(path: string, init: RequestInit = {}) {
  const shouldPrefix = /localhost|127\.0\.0\.1/.test(BASE);
  const apiPath = shouldPrefix && !path.startsWith("/v1") ? `/v1${path}` : path;
  return fetch(`${BASE}${apiPath}`, {
    ...init,
    headers: {
      "x-mc-key": KEY,
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
}
