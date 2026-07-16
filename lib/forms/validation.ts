export const FORM_TYPES = [
  "kitchen-application",
  "order-request",
  "group-order",
  "contact",
  "marketing-preferences",
] as const;

export type FormType = (typeof FORM_TYPES)[number];

export interface KitchenApplicationData {
  decisionMakerName: string;
  kitchenName: string;
  phone: string;
  email?: string;
  role?: string;
  city: string;
  neighborhood?: string;
  serviceArea: string;
  cuisine?: string;
  operatingHours?: string;
  currentOrderChannels?: string[];
  dailyOrderBand?: string;
  fulfillmentModel?: string[];
  customerListType?: string;
  approximateCustomerListSize?: string;
  preferredContactTime?: string;
  pilotGoals?: string;
  contactAuthorityAttestation: true;
  serviceContactConsent: true;
  pilotInterest: true;
}

export interface OrderRequestData {
  customerName: string;
  phone: string;
  email?: string;
  requestType: string;
  kitchenPreference: string;
  requestedItems: string;
  quantity: number;
  fulfillmentMode: "delivery" | "pickup" | "delivery-or-pickup";
  requestedDateTime: string;
  city: string;
  neighborhood: string;
  landmark: string;
  paymentPreference: string;
  preparationNotes?: string;
  orderAcknowledgement: true;
  serviceContactConsent: true;
}

export interface GroupOrderData {
  contactName: string;
  phone: string;
  email?: string;
  organization: string;
  headcount: number;
  requestedDateTime: string;
  city: string;
  neighborhood?: string;
  locationLandmark: string;
  mealPreferences: string;
  budget?: string;
  coordinationNotes?: string;
  fulfillmentMode: "delivery" | "pickup" | "delivery-or-pickup";
  orderAcknowledgement: true;
  serviceContactConsent: true;
}

export interface ContactData {
  name: string;
  phone: string;
  email?: string;
  topic: string;
  message: string;
  serviceContactConsent: true;
}

export interface MarketingPreferencesData {
  name: string;
  phone: string;
  email?: string;
  action: "update" | "withdraw";
  consentMarketingWhatsApp: boolean;
  consentMarketingSms: boolean;
  consentMarketingEmail: boolean;
}

export interface FormDataByType {
  "kitchen-application": KitchenApplicationData;
  "order-request": OrderRequestData;
  "group-order": GroupOrderData;
  contact: ContactData;
  "marketing-preferences": MarketingPreferencesData;
}

export interface ValidationIssue {
  field: string;
  message: string;
}

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; issues: ValidationIssue[] };

type JsonRecord = Record<string, unknown>;

const PHONE_SEPARATORS = /[\s().-]/g;
const DISALLOWED_TEXT_CONTROLS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/**
 * Normalizes common local and international Cameroon formats to E.164.
 * Cameroon national numbers contain nine digits; an accidental local trunk
 * zero is tolerated because it is common in manually entered address books.
 */
export function normalizeCameroonPhone(value: unknown): string | null {
  if (typeof value !== "string" && typeof value !== "number") return null;

  let compact = String(value).trim().replace(PHONE_SEPARATORS, "");
  if (!compact || /[^+\d]/.test(compact) || (compact.match(/\+/g)?.length ?? 0) > 1) {
    return null;
  }

  if (compact.startsWith("00")) compact = `+${compact.slice(2)}`;

  let national: string;
  if (compact.startsWith("+237")) {
    national = compact.slice(4);
  } else if (compact.startsWith("237") && compact.length === 12) {
    national = compact.slice(3);
  } else {
    national = compact;
  }

  if (national.length === 10 && national.startsWith("0")) {
    national = national.slice(1);
  }

  if (!/^[2-9]\d{8}$/.test(national)) return null;
  return `+237${national}`;
}

function cleanText(value: string): string {
  return value.replace(DISALLOWED_TEXT_CONTROLS, "").trim();
}

function requiredString(
  body: JsonRecord,
  field: string,
  issues: ValidationIssue[],
  options: { min?: number; max?: number } = {},
): string {
  const value = body[field];
  if (typeof value !== "string") {
    issues.push({ field, message: "This field is required." });
    return "";
  }

  const cleaned = cleanText(value);
  const min = options.min ?? 1;
  const max = options.max ?? 200;
  if (cleaned.length < min) {
    issues.push({ field, message: "Please provide a little more detail." });
  } else if (cleaned.length > max) {
    issues.push({ field, message: `Please keep this under ${max} characters.` });
  }
  return cleaned;
}

function optionalString(
  body: JsonRecord,
  field: string,
  issues: ValidationIssue[],
  max = 200,
): string | undefined {
  const value = body[field];
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") {
    issues.push({ field, message: "Please enter valid text." });
    return undefined;
  }

  const cleaned = cleanText(value);
  if (cleaned.length > max) {
    issues.push({ field, message: `Please keep this under ${max} characters.` });
  }
  return cleaned || undefined;
}

function optionalEmail(
  body: JsonRecord,
  field: string,
  issues: ValidationIssue[],
): string | undefined {
  const value = optionalString(body, field, issues, 254);
  if (!value) return undefined;
  const normalized = value.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    issues.push({ field, message: "Enter a valid email address." });
  }
  return normalized;
}

function requireEmailForSelectedMarketing(
  body: JsonRecord,
  email: string | undefined,
  issues: ValidationIssue[],
): void {
  if (
    parseBoolean(body.consentMarketingEmail) === true &&
    !email &&
    !issues.some((issue) => issue.field === "email")
  ) {
    issues.push({ field: "email", message: "Add an email address to choose email updates." });
  }
}

function requiredPhone(body: JsonRecord, field: string, issues: ValidationIssue[]): string {
  const normalized = normalizeCameroonPhone(body[field]);
  if (!normalized) {
    issues.push({
      field,
      message: "Enter a valid Cameroon phone number, such as 6XX XXX XXX.",
    });
    return "";
  }
  return normalized;
}

function parseBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "off", ""].includes(normalized)) return false;
  return undefined;
}

function booleanField(
  body: JsonRecord,
  field: string,
  issues: ValidationIssue[],
  fallback = false,
): boolean {
  const parsed = parseBoolean(body[field]);
  if (parsed === undefined && body[field] !== undefined) {
    issues.push({ field, message: "Choose a valid option." });
  }
  return parsed ?? fallback;
}

function requiredConfirmation(
  body: JsonRecord,
  field: string,
  issues: ValidationIssue[],
  message: string,
): true {
  if (parseBoolean(body[field]) !== true) issues.push({ field, message });
  return true;
}

function positiveInteger(
  body: JsonRecord,
  field: string,
  issues: ValidationIssue[],
  max: number,
): number {
  const raw = body[field];
  const value = typeof raw === "string" && raw.trim() ? Number(raw) : raw;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > max) {
    issues.push({ field, message: `Enter a whole number from 1 to ${max}.` });
    return 0;
  }
  return value;
}

function dateTimeField(body: JsonRecord, field: string, issues: ValidationIssue[]): string {
  const value = requiredString(body, field, issues, { max: 80 });
  if (value && (!/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(value) || Number.isNaN(Date.parse(value)))) {
    issues.push({ field, message: "Choose a valid date and time." });
  }
  return value;
}

function fulfillmentField(
  body: JsonRecord,
  field: string,
  issues: ValidationIssue[],
): "delivery" | "pickup" | "delivery-or-pickup" {
  const raw = requiredString(body, field, issues, { max: 40 })
    .toLowerCase()
    .replace(/[ _]+/g, "-");
  const aliases: Record<string, "delivery" | "pickup" | "delivery-or-pickup"> = {
    delivery: "delivery",
    pickup: "pickup",
    collection: "pickup",
    both: "delivery-or-pickup",
    "delivery-or-pickup": "delivery-or-pickup",
    "help-me-choose": "delivery-or-pickup",
  };
  const value = aliases[raw];
  if (!value && raw) {
    issues.push({ field, message: "Choose delivery or pickup." });
  }
  return value ?? "delivery";
}

function optionalStringList(
  body: JsonRecord,
  field: string,
  issues: ValidationIssue[],
): string[] | undefined {
  const raw = body[field];
  if (raw === undefined || raw === null || raw === "") return undefined;
  const values = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(",") : [];
  if (!values.length || values.length > 10 || values.some((value) => typeof value !== "string")) {
    issues.push({ field, message: "Choose up to 10 valid options." });
    return undefined;
  }
  const cleaned = values.map((value) => cleanText(String(value))).filter(Boolean);
  if (cleaned.some((value) => value.length > 60)) {
    issues.push({ field, message: "Each option must be under 60 characters." });
  }
  return cleaned.length ? cleaned : undefined;
}

function asRecord(value: unknown): JsonRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as JsonRecord;
}

function validateKitchenApplication(body: JsonRecord): ValidationResult<KitchenApplicationData> {
  const issues: ValidationIssue[] = [];
  const email = optionalEmail(body, "email", issues);
  const role = optionalString(body, "role", issues, 100);
  const neighborhood = optionalString(body, "neighborhood", issues, 100);
  const cuisine = optionalString(body, "cuisine", issues, 160);
  const operatingHours = optionalString(body, "operatingHours", issues, 200);
  const currentOrderChannels = optionalStringList(body, "currentOrderChannels", issues);
  const dailyOrderBand = optionalString(body, "dailyOrderBand", issues, 60);
  const fulfillmentModel = optionalStringList(body, "fulfillmentModel", issues);
  const customerListType = optionalString(body, "customerListType", issues, 100);
  const approximateCustomerListSize = optionalString(body, "approximateCustomerListSize", issues, 60);
  const preferredContactTime = optionalString(body, "preferredContactTime", issues, 100);
  const pilotGoals = optionalString(body, "pilotGoals", issues, 1500);
  const pilotInterest = body.pilotInterest === undefined
    ? true
    : requiredConfirmation(body, "pilotInterest", issues, "Confirm your interest in the one-month pilot.");
  const data: KitchenApplicationData = {
    decisionMakerName: requiredString(body, "decisionMakerName", issues, { min: 2, max: 100 }),
    kitchenName: requiredString(body, "kitchenName", issues, { min: 2, max: 120 }),
    phone: requiredPhone(body, "phone", issues),
    ...(email ? { email } : {}),
    ...(role ? { role } : {}),
    city: requiredString(body, "city", issues, { min: 2, max: 80 }),
    ...(neighborhood ? { neighborhood } : {}),
    serviceArea: requiredString(body, "serviceArea", issues, { min: 2, max: 200 }),
    ...(cuisine ? { cuisine } : {}),
    ...(operatingHours ? { operatingHours } : {}),
    ...(currentOrderChannels ? { currentOrderChannels } : {}),
    ...(dailyOrderBand ? { dailyOrderBand } : {}),
    ...(fulfillmentModel ? { fulfillmentModel } : {}),
    ...(customerListType ? { customerListType } : {}),
    ...(approximateCustomerListSize ? { approximateCustomerListSize } : {}),
    ...(preferredContactTime ? { preferredContactTime } : {}),
    ...(pilotGoals ? { pilotGoals } : {}),
    contactAuthorityAttestation: requiredConfirmation(
      body,
      "contactAuthorityAttestation",
      issues,
      "Confirm that you have authority and a lawful basis to use customer contacts.",
    ),
    serviceContactConsent: requiredConfirmation(
      body,
      "serviceContactConsent",
      issues,
      "Consent is required so Omala can contact you about this application.",
    ),
    pilotInterest,
  };
  return issues.length ? { ok: false, issues } : { ok: true, data };
}

function validateOrderRequest(body: JsonRecord): ValidationResult<OrderRequestData> {
  const issues: ValidationIssue[] = [];
  const email = optionalEmail(body, "email", issues);
  requireEmailForSelectedMarketing(body, email, issues);
  const preparationNotes = optionalString(body, "preparationNotes", issues, 1200);
  const data: OrderRequestData = {
    customerName: requiredString(body, "customerName", issues, { min: 2, max: 100 }),
    phone: requiredPhone(body, "phone", issues),
    ...(email ? { email } : {}),
    requestType: requiredString(body, "requestType", issues, { max: 60 }),
    kitchenPreference: requiredString(body, "kitchenPreference", issues, { max: 120 }),
    requestedItems: requiredString(body, "requestedItems", issues, { min: 2, max: 1200 }),
    quantity: positiveInteger(body, "quantity", issues, 500),
    fulfillmentMode: fulfillmentField(body, "fulfillmentMode", issues),
    requestedDateTime: dateTimeField(body, "requestedDateTime", issues),
    city: requiredString(body, "city", issues, { min: 2, max: 80 }),
    neighborhood: requiredString(body, "neighborhood", issues, { min: 2, max: 100 }),
    landmark: requiredString(body, "landmark", issues, { min: 2, max: 240 }),
    paymentPreference: requiredString(body, "paymentPreference", issues, { max: 80 }),
    ...(preparationNotes ? { preparationNotes } : {}),
    orderAcknowledgement: requiredConfirmation(
      body,
      "orderAcknowledgement",
      issues,
      "Acknowledge that Omala must confirm availability, price, and fulfillment.",
    ),
    serviceContactConsent: requiredConfirmation(
      body,
      "serviceContactConsent",
      issues,
      "Consent is required so Omala can contact you about this request.",
    ),
  };
  return issues.length ? { ok: false, issues } : { ok: true, data };
}

function validateGroupOrder(body: JsonRecord): ValidationResult<GroupOrderData> {
  const issues: ValidationIssue[] = [];
  const email = optionalEmail(body, "email", issues);
  const budget = optionalString(body, "budget", issues, 120);
  const neighborhood = optionalString(body, "neighborhood", issues, 100);
  const coordinationNotes = optionalString(body, "coordinationNotes", issues, 1500);
  const data: GroupOrderData = {
    contactName: requiredString(body, "contactName", issues, { min: 2, max: 100 }),
    phone: requiredPhone(body, "phone", issues),
    ...(email ? { email } : {}),
    organization: requiredString(body, "organization", issues, { min: 2, max: 160 }),
    headcount: positiveInteger(body, "headcount", issues, 5000),
    requestedDateTime: dateTimeField(body, "requestedDateTime", issues),
    city: requiredString(body, "city", issues, { min: 2, max: 80 }),
    ...(neighborhood ? { neighborhood } : {}),
    locationLandmark: requiredString(body, "locationLandmark", issues, { min: 2, max: 300 }),
    mealPreferences: requiredString(body, "mealPreferences", issues, { min: 2, max: 1500 }),
    ...(budget ? { budget } : {}),
    ...(coordinationNotes ? { coordinationNotes } : {}),
    fulfillmentMode: fulfillmentField(body, "fulfillmentMode", issues),
    orderAcknowledgement: requiredConfirmation(
      body,
      "orderAcknowledgement",
      issues,
      "Acknowledge that Omala will confirm the quote and fulfillment details.",
    ),
    serviceContactConsent: requiredConfirmation(
      body,
      "serviceContactConsent",
      issues,
      "Consent is required so Omala can contact you about this request.",
    ),
  };
  return issues.length ? { ok: false, issues } : { ok: true, data };
}

function validateContact(body: JsonRecord): ValidationResult<ContactData> {
  const issues: ValidationIssue[] = [];
  const email = optionalEmail(body, "email", issues);
  const data: ContactData = {
    name: requiredString(body, "name", issues, { min: 2, max: 100 }),
    phone: requiredPhone(body, "phone", issues),
    ...(email ? { email } : {}),
    topic: requiredString(body, "topic", issues, { min: 2, max: 100 }),
    message: requiredString(body, "message", issues, { min: 10, max: 2000 }),
    serviceContactConsent: requiredConfirmation(
      body,
      "serviceContactConsent",
      issues,
      "Consent is required so Omala can reply to your message.",
    ),
  };
  return issues.length ? { ok: false, issues } : { ok: true, data };
}

function validateMarketingPreferences(body: JsonRecord): ValidationResult<MarketingPreferencesData> {
  const issues: ValidationIssue[] = [];
  const rawAction = requiredString(body, "action", issues, { max: 30 }).toLowerCase();
  const action = rawAction === "withdraw" || rawAction === "withdraw-all" ? "withdraw" : "update";
  if (rawAction && !["update", "withdraw", "withdraw-all"].includes(rawAction)) {
    issues.push({ field: "action", message: "Choose to update or withdraw your preferences." });
  }

  const email = optionalEmail(body, "email", issues);
  const preferences = action === "withdraw"
    ? {
        consentMarketingWhatsApp: false,
        consentMarketingSms: false,
        consentMarketingEmail: false,
      }
    : {
        consentMarketingWhatsApp: booleanField(body, "consentMarketingWhatsApp", issues),
        consentMarketingSms: booleanField(body, "consentMarketingSms", issues),
        consentMarketingEmail: booleanField(body, "consentMarketingEmail", issues),
      };
  if (action === "update") requireEmailForSelectedMarketing(body, email, issues);

  const data: MarketingPreferencesData = {
    name: requiredString(body, "name", issues, { min: 2, max: 100 }),
    phone: requiredPhone(body, "phone", issues),
    ...(email ? { email } : {}),
    action,
    ...preferences,
  };
  return issues.length ? { ok: false, issues } : { ok: true, data };
}

export function validateFormPayload<K extends FormType>(
  formType: K,
  value: unknown,
): ValidationResult<FormDataByType[K]> {
  const body = asRecord(value);
  if (!body) {
    return { ok: false, issues: [{ field: "form", message: "Submit a valid form." }] };
  }

  switch (formType) {
    case "kitchen-application":
      return validateKitchenApplication(body) as ValidationResult<FormDataByType[K]>;
    case "order-request":
      return validateOrderRequest(body) as ValidationResult<FormDataByType[K]>;
    case "group-order":
      return validateGroupOrder(body) as ValidationResult<FormDataByType[K]>;
    case "contact":
      return validateContact(body) as ValidationResult<FormDataByType[K]>;
    case "marketing-preferences":
      return validateMarketingPreferences(body) as ValidationResult<FormDataByType[K]>;
  }
}
