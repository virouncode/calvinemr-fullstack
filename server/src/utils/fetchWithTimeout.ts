// utils/fetchWithTimeout.ts
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 10000 // ⏱️ timeout par défaut : 10 secondes
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    return response;
  } catch (err) {
    // 🧩 Erreur spécifique en cas de timeout
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`);
    }

    // 🚨 Propager toute autre erreur réseau
    throw err;
  } finally {
    clearTimeout(id); // 🔒 Nettoyage du timer quoi qu’il arrive
  }
}
