"use client";

import Script from "next/script";
import type { FormEvent, ReactNode } from "react";
import { useRef, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type SubmissionFormProps = {
  endpoint: string;
  formName: string;
  successPath: string;
  submitLabel: string;
  eventContext: string;
  requireOneOf?: string[];
  submissionNotice?: string;
  children: ReactNode;
};

type SubmissionResponse = {
  id?: string;
  receiptId?: string;
  error?: string | { code?: string; message?: string; fields?: Array<{ field: string; message: string }> };
  message?: string;
};

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function valueForPayload(value: FormDataEntryValue) {
  if (value === "true") return true;
  if (value === "false") return false;
  return String(value).trim();
}

export function SubmissionForm({
  endpoint,
  formName,
  successPath,
  submitLabel,
  eventContext,
  requireOneOf,
  submissionNotice = "By sending this form, you agree to the service-related contact described above. Optional marketing choices remain separate.",
  children,
}: SubmissionFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const idempotencyKey = useRef<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, unknown> = {};

    for (const [key, rawValue] of formData.entries()) {
      const normalizedKey = key === "cf-turnstile-response" ? "turnstileToken" : key;
      const value = valueForPayload(rawValue);
      const existing = payload[normalizedKey];
      if (existing === undefined) {
        payload[normalizedKey] = value;
      } else if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        payload[normalizedKey] = [existing, value];
      }
    }

    if (requireOneOf?.length && !requireOneOf.some((field) => payload[field] === true)) {
      setError("Choose at least one communication channel before continuing.");
      setSubmitting(false);
      return;
    }

    const url = new URL(window.location.href);
    payload.sourceUrl = url.origin + url.pathname;
    payload.language = document.documentElement.lang || "en";
    payload.utmSource = url.searchParams.get("utm_source") ?? "";
    payload.utmMedium = url.searchParams.get("utm_medium") ?? "";
    payload.utmCampaign = url.searchParams.get("utm_campaign") ?? "";
    payload.utmContent = url.searchParams.get("utm_content") ?? "";
    payload.utmTerm = url.searchParams.get("utm_term") ?? "";

    idempotencyKey.current ??= window.crypto?.randomUUID?.() ?? `${Date.now()}-${formName}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current,
        },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as SubmissionResponse;

      if (!response.ok) {
        const firstIssue = typeof data.error === "object" ? data.error.fields?.[0] : undefined;
        if (firstIssue) {
          const namedControl = form.elements.namedItem(firstIssue.field);
          const control =
            namedControl instanceof RadioNodeList
              ? namedControl.item(0) instanceof HTMLInputElement
                ? namedControl.item(0) as HTMLInputElement
                : null
              : namedControl instanceof HTMLInputElement ||
                  namedControl instanceof HTMLSelectElement ||
                  namedControl instanceof HTMLTextAreaElement
                ? namedControl
                : null;

          if (control) {
            control.setCustomValidity(firstIssue.message);
            control.setAttribute("aria-invalid", "true");
            control.addEventListener(
              "input",
              () => {
                control.setCustomValidity("");
                control.removeAttribute("aria-invalid");
              },
              { once: true },
            );
            control.reportValidity();
            control.focus();
          }
        }
        const nestedError = typeof data.error === "object" ? data.error?.message : data.error;
        throw new Error(data.message || nestedError || "We could not send this yet.");
      }

      const receipt = data.receiptId || data.id || "received";
      trackEvent("form_submit_success", { form: eventContext });
      if (eventContext === "consent_opt_in") {
        trackEvent("consent_opt_in", { form: formName });
      }
      window.location.assign(`${successPath}?id=${encodeURIComponent(receipt)}`);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "We could not send this yet. Please try again.";
      setError(`${message} You can retry, or contact Omala for help.`);
      setSubmitting(false);
    }
  }

  return (
    <>
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      ) : null}
      <form className="submission-form" name={formName} method="post" action={endpoint} onSubmit={handleSubmit} noValidate={false}>
        {children}
        <label className="honeypot-field" aria-hidden="true">
          Leave this field empty
          <input name="honeypot" tabIndex={-1} autoComplete="off" />
        </label>
        {turnstileSiteKey ? (
          <div className="turnstile-wrap">
            <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="light" />
          </div>
        ) : null}
        {error ? (
          <p className="form-status form-status--error" role="alert">
            {error} <a href="/contact">Contact Omala</a>.
          </p>
        ) : null}
        <div className="form-submit-row">
          <p>{submissionNotice}</p>
          <button className="button button--accent" type="submit" disabled={submitting}>
            {submitting ? (
              <><LoaderCircle size={17} className="spin" /> Sending…</>
            ) : (
              <>{submitLabel} <ArrowRight size={17} /></>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
