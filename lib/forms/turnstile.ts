export type TurnstileResult =
  | { ok: true }
  | { ok: false; reason: "missing-token" | "rejected" | "unavailable" };

export async function verifyTurnstile(
  token: string | undefined,
  secret: string | undefined,
  fetchImplementation: typeof fetch = fetch,
): Promise<TurnstileResult> {
  if (!secret) return { ok: true };
  if (!token) return { ok: false, reason: "missing-token" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  const form = new FormData();
  form.set("secret", secret);
  form.set("response", token);

  try {
    const response = await fetchImplementation(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: form, signal: controller.signal },
    );
    if (!response.ok) return { ok: false, reason: "unavailable" };
    const result = (await response.json()) as { success?: unknown };
    return result.success === true
      ? { ok: true }
      : { ok: false, reason: "rejected" };
  } catch {
    return { ok: false, reason: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}
