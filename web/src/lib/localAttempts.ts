import type { AnswerChoice } from "./drill";

const storageKey = "trust-trainer-attempts";

export type LocalAttempt = {
  drill_id: string;
  selected_answer: AnswerChoice["id"];
  is_correct: boolean;
  created_at: string;
};

export function readAttempts(): LocalAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "[]") as LocalAttempt[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAttempt(attempt: LocalAttempt): void {
  if (typeof window === "undefined") return;
  const attempts = readAttempts();
  attempts.push(attempt);
  window.localStorage.setItem(storageKey, JSON.stringify(attempts.slice(-100)));
}
