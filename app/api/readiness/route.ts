import { getRuntimeReadiness } from "@/lib/runtime-readiness";

export async function GET(): Promise<Response> {
  const ready = await getRuntimeReadiness();

  return Response.json(
    {
      ok: ready,
      service: "omala-kitchen-hub",
      ready,
      ...(ready ? {} : { status: "configuration_required" }),
    },
    {
      status: ready ? 200 : 503,
      headers: { "cache-control": "no-store" },
    },
  );
}
