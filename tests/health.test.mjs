import assert from "node:assert/strict";
import test from "node:test";

import { isProductionReady } from "../lib/health.ts";

const readyEnvironment = {
  NEXT_PUBLIC_SITE_URL: "https://omala.example",
  NEXT_PUBLIC_WHATSAPP_NUMBER: "237677123456",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "public-key",
  TURNSTILE_SECRET_KEY: "secret-key",
  CONSENT_TEXT_VERSION: "2026-07-v1",
  GHL_KITCHEN_APPLICATION_WEBHOOK_URL: "https://services.leadconnectorhq.com/hooks/a",
  GHL_ORDER_REQUEST_WEBHOOK_URL: "https://services.leadconnectorhq.com/hooks/b",
  GHL_GROUP_ORDER_WEBHOOK_URL: "https://services.leadconnectorhq.com/hooks/c",
  GHL_CONTACT_WEBHOOK_URL: "https://services.leadconnectorhq.com/hooks/d",
  GHL_MARKETING_PREFERENCES_WEBHOOK_URL: "https://services.leadconnectorhq.com/hooks/e",
};

test("production readiness requires every launch-critical integration", () => {
  assert.equal(isProductionReady(readyEnvironment), true);
  assert.equal(isProductionReady({ ...readyEnvironment, GHL_ORDER_REQUEST_WEBHOOK_URL: "" }), false);
  assert.equal(isProductionReady({ ...readyEnvironment, TURNSTILE_SECRET_KEY: "" }), false);
});

test("production readiness rejects unsafe public and webhook URLs", () => {
  assert.equal(isProductionReady({ ...readyEnvironment, NEXT_PUBLIC_SITE_URL: "http://omala.example" }), false);
  assert.equal(
    isProductionReady({ ...readyEnvironment, GHL_CONTACT_WEBHOOK_URL: "http://localhost:4000/hook" }),
    false,
  );
  assert.equal(isProductionReady({ ...readyEnvironment, NEXT_PUBLIC_WHATSAPP_NUMBER: "123" }), false);
});
