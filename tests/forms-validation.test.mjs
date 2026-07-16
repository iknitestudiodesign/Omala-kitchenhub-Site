import assert from "node:assert/strict";
import test from "node:test";

import { createSubmissionEnvelope } from "../lib/forms/envelope.ts";
import {
  normalizeCameroonPhone,
  validateFormPayload,
} from "../lib/forms/validation.ts";

test("normalizes common Cameroon phone formats without requiring one display style", () => {
  assert.equal(normalizeCameroonPhone("677 123 456"), "+237677123456");
  assert.equal(normalizeCameroonPhone("+237 677-123-456"), "+237677123456");
  assert.equal(normalizeCameroonPhone("00237 (677) 123 456"), "+237677123456");
  assert.equal(normalizeCameroonPhone("0677123456"), "+237677123456");
  assert.equal(normalizeCameroonPhone("233 123 456"), "+237233123456");
  assert.equal(normalizeCameroonPhone("+1 202 555 0123"), null);
  assert.equal(normalizeCameroonPhone("677-CALL-NOW"), null);
  assert.equal(normalizeCameroonPhone("123"), null);
});

test("validates and canonicalizes a kitchen pilot application", () => {
  const result = validateFormPayload("kitchen-application", {
    decisionMakerName: "Manka N.",
    kitchenName: "Buea Bowl Kitchen",
    phone: "6 77 123 456",
    email: "HELLO@EXAMPLE.COM",
    role: "Owner / founder",
    city: "Buea",
    serviceArea: "Molyko and central Buea",
    cuisine: "Cameroonian home cooking",
    currentOrderChannels: ["WhatsApp", "Phone"],
    fulfillmentModel: "Pickup",
    approximateCustomerListSize: "About 200",
    pilotGoals: "Spend less time switching between cooking and customer chats.",
    contactAuthorityAttestation: true,
    serviceContactConsent: "on",
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.data.phone, "+237677123456");
  assert.equal(result.data.email, "hello@example.com");
  assert.equal(result.data.role, "Owner / founder");
  assert.equal(result.data.pilotInterest, true);
  assert.deepEqual(result.data.currentOrderChannels, ["WhatsApp", "Phone"]);
  assert.deepEqual(result.data.fulfillmentModel, ["Pickup"]);
  assert.equal(result.data.approximateCustomerListSize, "About 200");
  assert.equal(result.data.pilotGoals, "Spend less time switching between cooking and customer chats.");
});

test("rejects missing authority and service-contact confirmations", () => {
  const result = validateFormPayload("kitchen-application", {
    decisionMakerName: "Manka N.",
    kitchenName: "Buea Bowl Kitchen",
    phone: "677123456",
    city: "Buea",
    serviceArea: "Molyko",
  });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.deepEqual(
    result.issues.map((issue) => issue.field),
    ["contactAuthorityAttestation", "serviceContactConsent"],
  );
});

test("validates an order request and keeps service consent separate from marketing", () => {
  const result = validateFormPayload("order-request", {
    customerName: "Nadine E.",
    phone: "+237 650 111 222",
    email: "NADINE@EXAMPLE.COM",
    requestType: "specific-order",
    kitchenPreference: "No preference",
    requestedItems: "Jollof rice and chicken",
    quantity: "3",
    fulfillmentMode: "pickup",
    requestedDateTime: "2026-07-20T12:30",
    city: "Buea",
    neighborhood: "Molyko",
    landmark: "Near the university gate",
    paymentPreference: "Mobile Money after confirmation",
    orderAcknowledgement: true,
    serviceContactConsent: true,
    consentMarketingWhatsApp: true,
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.data.quantity, 3);
  assert.equal(result.data.email, "nadine@example.com");
  assert.equal(result.data.fulfillmentMode, "pickup");
  assert.equal("consentMarketingWhatsApp" in result.data, false);
});

test("requires an email address when email marketing is selected", () => {
  const result = validateFormPayload("order-request", {
    customerName: "Nadine E.",
    phone: "650111222",
    requestType: "today-menu",
    kitchenPreference: "Let Omala match my request",
    requestedItems: "Today's menu",
    quantity: 1,
    fulfillmentMode: "delivery",
    requestedDateTime: "2026-07-21T12:00",
    city: "Buea",
    neighborhood: "Molyko",
    landmark: "Main gate",
    paymentPreference: "Confirm options with me",
    orderAcknowledgement: true,
    serviceContactConsent: true,
    consentMarketingEmail: true,
  });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.issues.some(({ field }) => field === "email"), true);
});

test("preserves optional group-order coordination fields and planned fulfillment values", () => {
  const result = validateFormPayload("group-order", {
    contactName: "Nadine E.",
    phone: "650111222",
    organization: "Molyko Team",
    headcount: "18",
    requestedDateTime: "2026-07-21T12:00",
    city: "Buea",
    neighborhood: "Molyko",
    locationLandmark: "Main gate",
    mealPreferences: "Cameroonian lunch boxes",
    fulfillmentMode: "HELP ME CHOOSE",
    coordinationNotes: "Please call when the rider reaches the gate.",
    orderAcknowledgement: true,
    serviceContactConsent: true,
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.data.fulfillmentMode, "delivery-or-pickup");
  assert.equal(result.data.neighborhood, "Molyko");
  assert.equal(result.data.coordinationNotes, "Please call when the rider reaches the gate.");
});

test("captures independently checked marketing channels on a service submission", () => {
  const validated = validateFormPayload("order-request", {
    customerName: "Nadine E.",
    phone: "650111222",
    requestType: "today-menu",
    kitchenPreference: "Let Omala match my request",
    requestedItems: "Today's menu",
    quantity: 1,
    fulfillmentMode: "Delivery",
    requestedDateTime: "2026-07-21T12:00",
    city: "Buea",
    neighborhood: "Molyko",
    landmark: "Main gate",
    paymentPreference: "Confirm options with me",
    orderAcknowledgement: true,
    serviceContactConsent: true,
  });
  assert.equal(validated.ok, true);
  if (!validated.ok) return;

  const envelope = createSubmissionEnvelope(
    "order-request",
    validated.data,
    {
      consentMarketingWhatsApp: "TRUE",
      consentMarketingSms: "On",
      consentMarketingEmail: "yes",
    },
    { url: "https://omala.example/api/forms/order-request", headers: new Headers() },
    {
      consentTextVersion: "consent-v3",
      now: new Date("2026-07-16T12:00:00.000Z"),
      uuid: "11223344-5566-4778-8990-aabbccddeeff",
    },
  );

  assert.deepEqual(envelope.communicationPermissions, {
    service: true,
    marketingWhatsApp: true,
    marketingSms: true,
    marketingEmail: true,
  });
  assert.deepEqual(envelope.consentAudit.permissions, envelope.communicationPermissions);
});

test("leaves omitted optional marketing channels unchecked on a service submission", () => {
  const validated = validateFormPayload("contact", {
    name: "Nadine E.",
    phone: "650111222",
    topic: "Order help",
    message: "Please help me check an order request.",
    serviceContactConsent: true,
  });
  assert.equal(validated.ok, true);
  if (!validated.ok) return;

  const envelope = createSubmissionEnvelope(
    "contact",
    validated.data,
    {},
    { url: "https://omala.example/api/forms/contact", headers: new Headers() },
    {
      consentTextVersion: "consent-v3",
      now: new Date("2026-07-16T12:00:00.000Z"),
      uuid: "22334455-6677-4889-9001-bbccddeeff00",
    },
  );

  assert.deepEqual(envelope.communicationPermissions, {
    service: true,
    marketingWhatsApp: false,
    marketingSms: false,
    marketingEmail: false,
  });
  assert.deepEqual(envelope.consentAudit.permissions, envelope.communicationPermissions);
});

test("withdraw-all overrides channel choices in marketing preferences", () => {
  const result = validateFormPayload("marketing-preferences", {
    name: "Nadine E.",
    phone: "650111222",
    action: "withdraw-all",
    consentMarketingWhatsApp: true,
    consentMarketingSms: true,
    consentMarketingEmail: true,
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.data.action, "withdraw");
  assert.equal(result.data.consentMarketingWhatsApp, false);
  assert.equal(result.data.consentMarketingSms, false);
  assert.equal(result.data.consentMarketingEmail, false);
});

test("builds a server-owned envelope with safe attribution and routing", () => {
  const validated = validateFormPayload("marketing-preferences", {
    name: "Nadine E.",
    phone: "650111222",
    action: "update",
    consentMarketingWhatsApp: true,
    consentMarketingSms: false,
    consentMarketingEmail: false,
  });
  assert.equal(validated.ok, true);
  if (!validated.ok) return;

  const envelope = createSubmissionEnvelope(
    "marketing-preferences",
    validated.data,
    {
      sourceUrl: "javascript:alert(1)",
      language: "fr-CM",
      utmSource: " launch\u0000-campaign ",
    },
    {
      url: "https://omala.example/api/forms/marketing-preferences",
      headers: new Headers({ referer: "https://omala.example/join-updates" }),
    },
    {
      consentTextVersion: "consent-v3",
      now: new Date("2026-07-16T12:00:00.000Z"),
      uuid: "12345678-1234-4234-9234-123456789abc",
    },
  );

  assert.equal(envelope.receiptId, "OML-123456781234");
  assert.equal(envelope.sourceUrl, "https://omala.example/join-updates");
  assert.equal(envelope.language, "fr");
  assert.equal(envelope.utm.source, "launch-campaign");
  assert.equal(envelope.consentTextVersion, "consent-v3");
  assert.equal(envelope.communicationPermissions.marketingWhatsApp, true);
  assert.equal(envelope.consentAudit.capturedAt, "2026-07-16T12:00:00.000Z");
  assert.equal(envelope.consentAudit.withdrawnAt, null);
  assert.deepEqual(
    envelope.consentAudit.channelDecisions.map(({ channel, status, withdrawnAt }) => ({ channel, status, withdrawnAt })),
    [
      { channel: "service", status: "not-applicable", withdrawnAt: null },
      { channel: "whatsapp", status: "granted", withdrawnAt: null },
      { channel: "sms", status: "withdrawn", withdrawnAt: "2026-07-16T12:00:00.000Z" },
      { channel: "email", status: "withdrawn", withdrawnAt: "2026-07-16T12:00:00.000Z" },
    ],
  );
  assert.deepEqual(envelope.routing.tags, ["website-source", "consent-preferences"]);
});

test("does not accept an off-site URL as consent provenance", () => {
  const validated = validateFormPayload("contact", {
    name: "Nadine E.",
    phone: "650111222",
    topic: "Order help",
    message: "Please help me check an order request.",
    serviceContactConsent: true,
  });
  assert.equal(validated.ok, true);
  if (!validated.ok) return;

  const envelope = createSubmissionEnvelope(
    "contact",
    validated.data,
    { sourceUrl: "https://untrusted.example/fake-source" },
    { url: "https://omala.example/api/forms/contact", headers: new Headers() },
    {
      consentTextVersion: "consent-v3",
      now: new Date("2026-07-16T12:00:00.000Z"),
      uuid: "abcdefab-cdef-4abc-8def-abcdefabcdef",
    },
  );

  assert.equal(envelope.sourceUrl, "https://omala.example");
});

test("source provenance keeps attribution but strips unrelated query details", () => {
  const validated = validateFormPayload("contact", {
    name: "Nadine E.",
    phone: "650111222",
    topic: "Order help",
    message: "Please help me check an order request.",
    serviceContactConsent: true,
  });
  assert.equal(validated.ok, true);
  if (!validated.ok) return;

  const envelope = createSubmissionEnvelope(
    "contact",
    validated.data,
    {},
    {
      url: "https://omala.example/api/forms/contact",
      headers: new Headers({
        referer: "https://omala.example/contact?utm_source=office-list&phone=677123456#private",
      }),
    },
    {
      consentTextVersion: "consent-v3",
      now: new Date("2026-07-16T12:00:00.000Z"),
      uuid: "fedcbafe-dcba-4fed-8cba-fedcbafedcba",
    },
  );

  assert.equal(envelope.sourceUrl, "https://omala.example/contact?utm_source=office-list");
  assert.equal(envelope.utm.source, "office-list");
  assert.doesNotMatch(envelope.sourceUrl, /phone|677123456|private/);
});

test("records the explicit withdrawal time in the consent audit", () => {
  const validated = validateFormPayload("marketing-preferences", {
    name: "Nadine E.",
    phone: "650111222",
    action: "withdraw",
  });
  assert.equal(validated.ok, true);
  if (!validated.ok) return;

  const envelope = createSubmissionEnvelope(
    "marketing-preferences",
    validated.data,
    {},
    { url: "https://omala.example/api/forms/marketing-preferences", headers: new Headers() },
    {
      consentTextVersion: "consent-v3",
      now: new Date("2026-07-16T15:30:00.000Z"),
      uuid: "87654321-4321-4321-8321-cba987654321",
    },
  );

  assert.equal(envelope.consentAudit.withdrawnAt, "2026-07-16T15:30:00.000Z");
  assert.equal(envelope.consentAudit.permissions.marketingWhatsApp, false);
  assert.deepEqual(
    envelope.consentAudit.channelDecisions
      .filter(({ channel }) => channel !== "service")
      .map(({ channel, status, withdrawnAt }) => ({ channel, status, withdrawnAt })),
    [
      { channel: "whatsapp", status: "withdrawn", withdrawnAt: "2026-07-16T15:30:00.000Z" },
      { channel: "sms", status: "withdrawn", withdrawnAt: "2026-07-16T15:30:00.000Z" },
      { channel: "email", status: "withdrawn", withdrawnAt: "2026-07-16T15:30:00.000Z" },
    ],
  );
});
