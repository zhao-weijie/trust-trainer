import { defangText } from "./defang";

export type OcrBox = {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  redacted: boolean;
  reason: "email" | "phone" | "account" | "url" | "possible_name" | "manual";
};

const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const phonePattern = /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}\b/;
const accountPattern = /\b(?:acct|account|card|otp|pin|ssn|nric|id)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i;
const urlPattern = /\b(https?:\/\/|www\.)[^\s<>"']+/i;
const namePattern = /\b(?:dear|hi|hello)\s+[A-Z][a-z]+\b/;

export function piiReason(text: string): OcrBox["reason"] | null {
  if (emailPattern.test(text)) return "email";
  if (phonePattern.test(text)) return "phone";
  if (accountPattern.test(text)) return "account";
  if (urlPattern.test(text)) return "url";
  if (namePattern.test(text)) return "possible_name";
  return null;
}

export function redactTextFromBoxes(text: string, boxes: OcrBox[]): string {
  let next = text;
  for (const box of boxes) {
    if (!box.redacted || !box.text.trim()) continue;
    const replacement = box.reason === "url" ? "[url redacted]" : `[${box.reason.replace("_", " ")} redacted]`;
    next = next.split(box.text).join(replacement);
  }
  return defangText(next);
}

export async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function fitImageSize(image: HTMLImageElement, maxSide = 1100) {
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  return {
    width: Math.round(image.naturalWidth * scale),
    height: Math.round(image.naturalHeight * scale),
    scale
  };
}

export function drawRedactionPreview(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  boxes: OcrBox[],
  activeId?: string
): void {
  const { width, height, scale } = fitImageSize(image);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);
  for (const box of boxes) {
    const x = box.x * scale;
    const y = box.y * scale;
    const w = box.width * scale;
    const h = box.height * scale;
    if (box.redacted) {
      ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
      ctx.fillRect(x, y, w, h);
    }
    ctx.strokeStyle = activeId === box.id ? "#2563eb" : box.redacted ? "#f97316" : "#16a34a";
    ctx.lineWidth = activeId === box.id ? 3 : 2;
    ctx.strokeRect(x, y, w, h);
  }
}

export function boxAtPoint(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  boxes: OcrBox[],
  clientX: number,
  clientY: number
): OcrBox | null {
  const rect = canvas.getBoundingClientRect();
  const { scale } = fitImageSize(image);
  const x = (clientX - rect.left) * (canvas.width / rect.width) / scale;
  const y = (clientY - rect.top) * (canvas.height / rect.height) / scale;
  return boxes.find((box) => x >= box.x && y >= box.y && x <= box.x + box.width && y <= box.y + box.height) ?? null;
}

export function bakeRedactions(image: HTMLImageElement, boxes: OcrBox[]): string {
  const canvas = document.createElement("canvas");
  drawRedactionPreview(canvas, image, boxes);
  return canvas.toDataURL("image/jpeg", 0.72);
}
