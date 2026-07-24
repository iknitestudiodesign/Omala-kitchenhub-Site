import { getRuntimeReadiness } from "@/lib/runtime-readiness";

export async function GET(): Promise<Response> {
  const ready = await getRuntimeReadiness();

  return new Response(
    JSON.stringify({
      ok: true,
      service: "ekoraa-kitchen-hub",
      ready,
      ...(ready ? {} : { status: "configuration_required" }),
    }),
    {
      status: 200,
      headers: {
        "cache-control": "no-store",
        "content-type": "application/json; charset=utf-8",
      },
    },
  );
}
