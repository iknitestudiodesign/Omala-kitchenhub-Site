import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

function request(pathname, init = {}) {
  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html", ...(init.headers ?? {}) },
      ...init,
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished homepage without starter markers", async () => {
  const response = await request("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Omala Kitchen Hub/i);
  assert.match(html, /You cook/i);
  assert.match(html, /Start an order/i);
  assert.match(html, /Apply as a kitchen/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("renders core public and legal routes", async () => {
  const expectations = [
    ["/for-kitchens", /one-month pilot/i],
    ["/how-it-works", /customer journey/i],
    ["/order", /order request/i],
    ["/group-orders", /group order/i],
    ["/about", /Starting in Buea/i],
    ["/faq", /Ordering and fulfilment/i],
    ["/contact", /General message/i],
    ["/join-updates", /Choose your channels/i],
    ["/marketing-preferences", /Withdraw all/i],
    ["/privacy", /Your information should have a clear purpose/i],
    ["/terms", /Clear expectations/i],
    ["/order-policy", /A request first/i],
    ["/marketing-notice", /Menus and offers/i],
  ];

  for (const [pathname, pattern] of expectations) {
    const response = await request(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(await response.text(), pattern, pathname);
  }
});

test("production health fails safely until launch integrations are configured", async () => {
  const response = await request("/api/health", { headers: { accept: "application/json" } });
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.ok, false);
  assert.equal(body.status, "configuration_required");
  assert.deepEqual(Object.keys(body).sort(), ["ok", "service", "status"]);
});

test("unknown kitchen routes return the designed 404", async () => {
  const response = await request("/kitchens/not-a-real-kitchen");
  assert.equal(response.status, 404);
  assert.match(await response.text(), /not on today’s menu/i);
});

test("non-JavaScript form submissions use POST without exposing personal details in a URL", async () => {
  const body = new URLSearchParams({
    name: "Site Test",
    phone: "677000000",
    topic: "Partnership",
    message: "A safe non-JavaScript submission test.",
    serviceContactConsent: "true",
  });
  const response = await request("/api/forms/contact", {
    method: "POST",
    headers: {
      accept: "text/html",
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });

  assert.notEqual(response.status, 415);
  assert.notEqual(response.status, 422);
  const location = response.headers.get("location") ?? "";
  assert.doesNotMatch(location, /677000000|Site%20Test|Site\+Test/);
  if (response.status === 303) assert.match(location, /^\/confirmation\/contact\?id=OML-/);
  else assert.equal(response.headers.get("content-type")?.startsWith("text/html"), true);
});
