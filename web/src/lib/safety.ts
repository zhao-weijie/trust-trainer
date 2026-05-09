import { TeachingLabels } from "./types";

const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const phonePattern = /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}\b/g;
const accountPattern = /\b(?:acct|account|card|otp|pin|ssn|nric|id)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/gi;
const urlPattern = /\b(https?:\/\/|www\.)[^\s<>"']+/gi;

export function defangUrl(value: string): string {
  return value
    .replace(/^https:\/\//i, "hxxps://")
    .replace(/^http:\/\//i, "hxxp://")
    .replace(/^www\./i, "www[.]")
    .replace(/\./g, "[.]");
}

export function defangUrls(text: string): string {
  return text.replace(urlPattern, (match) => defangUrl(match));
}

export function redactPII(text: string): string {
  return text
    .replace(emailPattern, "[email redacted]")
    .replace(phonePattern, "[phone redacted]")
    .replace(accountPattern, "[account detail redacted]")
    .replace(/\b(?:Dear|Hi|Hello)\s+([A-Z][a-z]+)\b/g, "Hello [name redacted]")
    .replace(/\b\d{1,5}\s+[A-Z][a-z]+(?:\s+(?:Street|St|Road|Rd|Avenue|Ave|Drive|Dr|Lane|Ln))\b/g, "[address redacted]");
}

export function sanitizeSubmission(text: string): { pii_redacted_text: string; defanged_text: string } {
  const pii_redacted_text = redactPII(text);
  return {
    pii_redacted_text,
    defanged_text: defangUrls(pii_redacted_text)
  };
}

export function heuristicCheck(text: string): TeachingLabels {
  const lower = text.toLowerCase();
  const hasSpamOnly = /sale|coupon|newsletter|clearance|advertising/.test(lower) && !/login|pay|verify|account|wallet|bank/.test(lower);
  const hasLink = /(https?:\/\/|www\.)/i.test(text);
  const hasCredential = /password|otp|pin|login|verify|account/.test(lower);
  const hasPayment = /pay|fee|wallet|transfer|refund|delivery/.test(lower);
  const hasUrgency = /urgent|today|now|limited|suspend|final|immediately/.test(lower);

  if (hasSpamOnly) {
    return {
      scam_status: "legitimate",
      scope_status: "out_of_scope_spam",
      threat_type: "generic_spam",
      risk_level: "low",
      red_flags: [],
      safest_action: "Ignore or unsubscribe through the official sender controls.",
      skeptical_claims: ["This is advertising, not a concrete phishing or scam scenario."],
      skill_tags: ["scope_boundary"]
    };
  }

  if (hasCredential || hasPayment || hasUrgency || hasLink) {
    return {
      scam_status: "suspected_scam",
      scope_status: "in_scope_phishing_or_scam",
      threat_type: hasCredential ? "credential_theft" : hasPayment ? "payment_theft" : "malicious_link",
      risk_level: hasCredential || hasPayment ? "high" : "medium",
      red_flags: [
        hasUrgency ? "urgent pressure" : "unexpected request",
        hasLink ? "unfamiliar link" : "asks for action outside a trusted app",
        hasCredential ? "requests account access details" : hasPayment ? "payment or fee pressure" : "unclear source"
      ],
      safest_action: "Do not click or reply. Open the official app or website directly.",
      skeptical_claims: [],
      skill_tags: ["urgency_trap", hasLink ? "link_inspection" : "official_source_check", hasCredential ? "credential_safety" : "payment_safety"]
    };
  }

  return {
    scam_status: "legitimate",
    scope_status: "benign_contrast",
    threat_type: "none",
    risk_level: "low",
    red_flags: [],
    safest_action: "No action needed, but keep using official channels for account or payment requests.",
    skeptical_claims: ["Legitimate-looking messages can still be checked through official channels."],
    skill_tags: ["benign_contrast", "official_source_check"]
  };
}

export function normalizeList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
