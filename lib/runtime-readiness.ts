import { getRuntimeEnv } from "@/lib/forms/runtime-env";
import {
  isProductionReady,
  REQUIRED_PRODUCTION_ENV,
  type ProductionEnvName,
} from "@/lib/health";

export async function getRuntimeReadiness(): Promise<boolean> {
  const runtimeNodeEnv = await getRuntimeEnv("NODE_ENV");
  const production = (runtimeNodeEnv ?? process.env.NODE_ENV) === "production";
  if (!production) return true;

  const values = Object.fromEntries(
    await Promise.all(
      REQUIRED_PRODUCTION_ENV.map(async (name) => [name, await getRuntimeEnv(name)] as const),
    ),
  ) as Partial<Record<ProductionEnvName, string>>;

  return isProductionReady(values);
}
