const BASE = process.env.MC_API_BASE_URL || "https://mc-api.elevatestudios.io";
const KEY = process.env.MC_API_KEY || "";

function joinUrl(base: string, path: string) {
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

export async function mcFetch(path: string, init: RequestInit = {}) {
  return fetch(joinUrl(BASE, path), {
    ...init,
    headers: {
      "X-MC-Key": KEY,
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
}
