# Omala Kitchen Hub

Public, mobile-first website for the Omala Kitchen Hub pilot in Buea, Cameroon.
The site explains the service to kitchens and customers, accepts order and
partner requests, records channel-specific marketing permission, and forwards
validated submissions to dedicated GoHighLevel inbound workflows.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

When a GHL webhook is not configured, form submissions return a development
stub receipt so the complete experience can be tested locally. Production fails
safely until each form's webhook is configured.

## Validate

```bash
npm run lint
npm test
```

## GoHighLevel setup

Create one inbound-webhook workflow for each public form and assign the
corresponding environment variable listed in `.env.example`. The webhook
payload includes:

- a receipt and submission ID;
- source, language and UTM attribution;
- versioned service and channel-specific consent;
- suggested audience, tags, pipeline and first stage;
- normalized form data, including Cameroon phone numbers in E.164 format.

Recommended pipelines:

- **Kitchen Partners:** New Application → Qualification → Pilot Setup → Pilot
  Ready → Pilot Live → Active Partner → Not Now
- **Order Requests:** Request Received → Awaiting Kitchen → Awaiting Customer
  Confirmation → Payment Pending → Confirmed → Preparing → Ready/Out for
  Delivery → Completed → Cancelled

The built-in throttle and idempotency cache are bounded and intended for the
single-replica pilot. Before horizontally scaling the site, move those two
short-lived stores to a shared service such as Redis so protection is consistent
across replicas.

## Railway

The repository includes a deterministic Docker build and Railway health check.
Connect the repository to Railway, add the production environment values, and
deploy. The compact standalone server listens on Railway's `PORT`.
`/api/health` is a liveness check that stays available for Railway while its
response reports whether integrations are ready. `/api/readiness` remains
unavailable until every GHL webhook, Turnstile key, public URL, WhatsApp
fallback and consent version is configured. Forms continue to fail safely when
their GHL workflow is not configured.

The Docker image supplies safe defaults for the consent version, per-instance
rate limit and disabled analytics state. Turnstile and GHL webhook values are
intentionally never baked into source or the image; add their real values as
Railway secrets when those integrations are ready.

The site always emits a small vendor-neutral analytics event layer. Google Tag
Manager loads only when both a valid `NEXT_PUBLIC_GTM_ID` and
`NEXT_PUBLIC_ANALYTICS_CONSENT_APPROVED=true` are supplied after the tracking
and consent configuration has been approved.

The official Omala Kitchen SVG identity and optimized supplied photography are
included in the repository. See `docs/asset-sources.md` for provenance and
usage notes. Before public launch, verify the public WhatsApp number and site
URL, reauthenticate GHL, test every workflow, and have the pilot legal pages
reviewed in Cameroon.
