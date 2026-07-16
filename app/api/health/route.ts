import { isProductionReady, REQUIRED_PRODUCTION_ENV, type ProductionEnvName } from "@/lib/health";
import { getRuntimeEnv } from "@/lib/forms/runtime-env";

export async function GET(): Promise<Response> {
  const runtimeNodeEnv = await getRuntimeEnv("NODE_ENV");
  const production = (runtimeNodeEnv ?? process.env.NODE_ENV) === "production";
  const values = production
    ? Object.fromEntries(
        await Promise.all(
          REQUIRED_PRODUCTION_ENV.map(async (name) => [name, await getRuntimeEnv(name)] as const),
        ),
      ) as Partial<Record<ProductionEnvName, string>>
    : {};
  const ready = !production || isProductionReady(values);

  return new Response(
    JSON.stringify({
      ok: ready,
      service: "omala-kitchen-hub",
      ...(ready ? {} : { status: "configuration_required" }),
    }),
    {
      status: ready ? 200 : 503,
      headers: {
        "cache-control": "no-store",
        "content-type": "application/json; charset=utf-8",
      },
    },
  );
}
