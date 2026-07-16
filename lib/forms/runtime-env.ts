type EnvironmentRecord = Record<string, unknown>;

let cloudflareEnvironment: Promise<EnvironmentRecord> | null = null;

async function getCloudflareEnvironment(): Promise<EnvironmentRecord> {
  if (!cloudflareEnvironment) {
    cloudflareEnvironment = import("cloudflare:workers")
      .then((module) => (module.env ?? {}) as EnvironmentRecord)
      .catch(() => ({}));
  }
  return cloudflareEnvironment;
}

/** Reads Railway/Node variables first, then Cloudflare bindings used by vinext. */
export async function getRuntimeEnv(name: string): Promise<string | undefined> {
  const nodeValue = typeof process !== "undefined" ? process.env?.[name] : undefined;
  if (typeof nodeValue === "string" && nodeValue.trim()) return nodeValue.trim();

  const workers = await getCloudflareEnvironment();
  const workerValue = workers[name];
  return typeof workerValue === "string" && workerValue.trim() ? workerValue.trim() : undefined;
}

export function parsePositiveEnv(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}
