export type SubmissionResult = "confirmed_scam" | "suspected_scam" | "legitimate";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type AnswerChoice = {
  id: "A" | "B" | "C" | "D";
  text: string;
};

export type DrillQuiz = {
  scenario: string;
  result: SubmissionResult;
  threat_type: string;
  risk_level: "low" | "medium" | "high";
  red_flags: string[];
  safest_action: string;
  skill_tags: string[];
  answer_choices: AnswerChoice[];
  correct_answer: AnswerChoice["id"];
  explanation: string;
  infographic_prompt: string;
};

export type ApprovedDrill = {
  id: string;
  quiz: DrillQuiz;
  generated_asset_url?: string;
};

export function classifySubmission(text: string): SubmissionResult {
  const lower = text.toLowerCase();
  const hasCredential = /password|otp|pin|login|verify|account|wallet|seed phrase|sign in/.test(lower);
  const hasPayment = /pay|fee|transfer|refund|card|bank|deposit|delivery|toll|crypto/.test(lower);
  const hasUrgency = /urgent|today|now|limited|suspend|final|immediately|expires|within/.test(lower);
  const hasLink = /\b(hxxps?:\/\/|https?:\/\/|www\[?\.\]?|www\.)/i.test(text);
  const hasBenignSignals = /no reply needed|official app|statement is ready|delivered at|reminder/.test(lower);

  if ((hasCredential || hasPayment) && (hasUrgency || hasLink)) return "confirmed_scam";
  if (hasCredential || hasPayment || hasUrgency || hasLink) return "suspected_scam";
  if (hasBenignSignals) return "legitimate";
  return "suspected_scam";
}

export function buildFallbackQuiz(text: string, result = classifySubmission(text)): DrillQuiz {
  const lower = text.toLowerCase();
  const asksForMoney = /pay|fee|transfer|refund|deposit|card|bank/.test(lower);
  const asksForLogin = /password|otp|pin|login|verify|account|sign in/.test(lower);
  const hasLink = /\b(hxxps?:\/\/|https?:\/\/|www\[?\.\]?|www\.)/i.test(text);
  const threatType = asksForLogin ? "credential_theft" : asksForMoney ? "payment_theft" : hasLink ? "malicious_link" : "impersonation";
  const riskLevel = result === "legitimate" ? "low" : asksForLogin || asksForMoney ? "high" : "medium";
  const redFlags = [
    asksForLogin ? "asks for account access" : null,
    asksForMoney ? "pushes payment or banking action" : null,
    hasLink ? "uses an unsolicited link" : null,
    /urgent|today|now|final|immediately|expires|within/i.test(text) ? "creates urgency" : null
  ].filter(Boolean) as string[];

  return {
    scenario: `A family member receives this screenshot text: "${text.slice(0, 220)}${text.length > 220 ? "..." : ""}"`,
    result,
    threat_type: result === "legitimate" ? "benign_contrast" : threatType,
    risk_level: riskLevel,
    red_flags: redFlags.length ? redFlags : ["unexpected request", "unclear sender"],
    safest_action:
      result === "legitimate"
        ? "No risky action is needed. Use the official app or known contact path if unsure."
        : "Do not tap links or reply. Open the official app, website, or known contact path directly.",
    skill_tags:
      result === "legitimate"
        ? ["benign_contrast", "official_source_check"]
        : [hasLink ? "link_inspection" : "sender_check", asksForLogin ? "credential_safety" : "payment_safety"],
    answer_choices: [
      { id: "A", text: "Follow the message instructions immediately." },
      { id: "B", text: "Use the official app, website, or known contact path directly." },
      { id: "C", text: "Reply and ask the sender to prove who they are." },
      { id: "D", text: "Forward it to family and let them decide." }
    ],
    correct_answer: "B",
    explanation:
      result === "legitimate"
        ? "This looks lower risk because it avoids payment, login, and private-data pressure. Official channels are still the safest way to check."
        : "Scams work by making unsafe actions feel urgent and normal. Slow down and switch to a trusted channel.",
    infographic_prompt: `A clean safety infographic showing ${threatType} warning signs: ${redFlags.join(", ") || "unexpected request, unclear sender"}.`
  };
}

export const fallbackDrills: ApprovedDrill[] = [
  {
    id: "local-delivery-fee",
    quiz: buildFallbackQuiz(
      "Delivery notice: your parcel is held for a $1.49 redelivery fee. Pay today at hxxps://parcel-help[.]example/fee.",
      "confirmed_scam"
    )
  },
  {
    id: "local-family-impersonation",
    quiz: buildFallbackQuiz(
      "Hi mom, I dropped my phone and this is my new number. I need $980 for rent today. Please transfer now.",
      "confirmed_scam"
    )
  },
  {
    id: "local-benign",
    quiz: buildFallbackQuiz(
      "Your package was delivered at 2:14 PM. Check the official carrier app for photo proof. No reply needed.",
      "legitimate"
    )
  }
];
