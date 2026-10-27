// ===== Server-side (Server Components): talk to PHP directly =====
const BACKEND = process.env.BACKEND_URL || "http://localhost:8000";

export async function getPublicResult(path, revalidate = 15) {
  let res;
  try {
    const options =
      revalidate > 0 ? { next: { revalidate } } : { cache: "no-store" };
    res = await fetch(`${BACKEND}/api${path}`, options);
  } catch (error) {
    console.error(`Public API request failed for ${path}`, error);
    return { status: 0, data: null };
  }
  if (!res.ok) {
    console.error(`Public API request returned HTTP ${res.status} for ${path}`);
    return { status: res.status, data: null };
  }
  try {
    const json = await res.json();
    if (!json.success) {
      console.error(`Public API returned an unsuccessful response for ${path}`);
      return { status: res.status, data: null };
    }
    return { status: res.status, data: json.data, meta: json.meta };
  } catch (error) {
    console.error(`Invalid public API response for ${path}`, error);
    return { status: res.status, data: null };
  }
}

export async function getPublic(path, revalidate = 15) {
  try {
    const res = await fetch(`${BACKEND}/api${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json : null;
  } catch {
    return null; // backend down / endpoint not built yet: page falls back gracefully
  }
}

// ===== Client-side (admin): same-origin /api via Next proxy, cookie + CSRF =====
const CSRF_KEY = "digi_arts_store_csrf";
export const setCsrf = (t) =>
  typeof window !== "undefined" && sessionStorage.setItem(CSRF_KEY, t || "");
export const getCsrf = () =>
  typeof window !== "undefined" ? sessionStorage.getItem(CSRF_KEY) || "" : "";

export async function adminFetch(path, { method = "GET", body } = {}) {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const headers = { "X-CSRF-Token": getCsrf() };
  if (body && !isForm) headers["Content-Type"] = "application/json";
  const res = await fetch(`/api${path}`, {
    method,
    headers,
    credentials: "include",
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });
  let json = {};
  try {
    json = await res.json();
  } catch {}
  if (!res.ok || json.success === false) {
    const err = new Error(json.message || "Request failed");
    err.status = res.status;
    err.errors = json.data;
    throw err;
  }
  return json;
}

export const imageUrl = (p) =>
  !p ? "" : p.startsWith("http") || p.startsWith("/") ? p : `/uploads/${p}`;
