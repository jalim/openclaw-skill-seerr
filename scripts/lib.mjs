const base = process.env.SEERR_URL?.replace(/\/+$/, "");
const apiKey = process.env.SEERR_API_KEY;

if (!base) throw new Error("Missing SEERR_URL");
if (!apiKey) throw new Error("Missing SEERR_API_KEY");

export async function seerr(path, options = {}) {
  const res = await fetch(`${base}/api/v1${path}`, {
    ...options,
    headers: {
      "X-Api-Key": apiKey,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const text = await res.text();
    let detail = text;
    try {
      const json = JSON.parse(text);
      detail = json.message || json.error || text;
    } catch {
      // keep raw text
    }
    throw new Error(`Seerr API ${res.status}: ${detail}`);
  }

  return res.json();
}