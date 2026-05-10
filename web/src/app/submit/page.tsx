"use client";

import { useMutation } from "convex/react";
import { Camera, Check, RotateCcw, ShieldCheck, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { convexApi } from "@/lib/apiRefs";
import { classifySubmission, type SubmissionResult } from "@/lib/drill";
import {
  bakeRedactions,
  boxAtPoint,
  drawRedactionPreview,
  loadImage,
  piiReason,
  redactTextFromBoxes,
  type OcrBox
} from "@/lib/redaction";

type Phase = "upload" | "review" | "baked" | "submitted";

type SubmissionResponse = {
  submission_id: string;
  draft_id: string;
  result: SubmissionResult;
};

function resultLabel(result: SubmissionResult) {
  if (result === "confirmed_scam") return "confirmed scam";
  if (result === "suspected_scam") return "suspected scam";
  return "legitimate";
}

function resultTone(result: SubmissionResult) {
  if (result === "confirmed_scam") return "destructive" as const;
  if (result === "suspected_scam") return "secondary" as const;
  return "outline" as const;
}

export default function SubmitPage() {
  const submitScreenshot = useMutation(convexApi.app.submitScreenshot);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<Phase>("upload");
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [boxes, setBoxes] = useState<OcrBox[]>([]);
  const [activeBoxId, setActiveBoxId] = useState("");
  const [bakedImage, setBakedImage] = useState("");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submission, setSubmission] = useState<SubmissionResponse | null>(null);
  const redactedText = useMemo(() => redactTextFromBoxes(ocrText, boxes), [ocrText, boxes]);
  const result = useMemo(() => classifySubmission(redactedText), [redactedText]);
  const redactedCount = boxes.filter((box) => box.redacted).length;

  useEffect(() => {
    if (!image || !canvasRef.current) return;
    drawRedactionPreview(canvasRef.current, image, boxes, activeBoxId);
  }, [activeBoxId, boxes, image]);

  async function handleFile(file: File) {
    setBusy(true);
    setError("");
    setProgress(12);
    setSubmission(null);
    setBakedImage("");
    try {
      const nextImage = await loadImage(file);
      setImage(nextImage);
      setProgress(28);
      const tesseract = await import("tesseract.js");
      const response = await tesseract.recognize(file, "eng", {
        logger: (message) => {
          if (message.status === "recognizing text") setProgress(30 + Math.round(message.progress * 55));
        }
      });
      const text = response.data.text.trim();
      const words = ((response.data as unknown as { words?: Array<{ text?: string; bbox?: { x0: number; y0: number; x1: number; y1: number } }> }).words ?? [])
        .map((word, index): OcrBox | null => {
          const wordText = (word.text ?? "").trim();
          const reason = piiReason(wordText);
          if (!wordText || !word.bbox || !reason) return null;
          return {
            id: `box-${index}`,
            text: wordText,
            x: word.bbox.x0,
            y: word.bbox.y0,
            width: Math.max(4, word.bbox.x1 - word.bbox.x0),
            height: Math.max(4, word.bbox.y1 - word.bbox.y0),
            redacted: true,
            reason
          };
        })
        .filter(Boolean) as OcrBox[];
      setOcrText(text);
      setBoxes(words);
      setPhase("review");
      setProgress(100);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not read text from that screenshot.");
      setPhase("upload");
    } finally {
      setBusy(false);
    }
  }

  function toggleBox(id: string) {
    setActiveBoxId(id);
    setBoxes((current) => current.map((box) => (box.id === id ? { ...box, redacted: !box.redacted } : box)));
  }

  function bake() {
    if (!image) return;
    setBakedImage(bakeRedactions(image, boxes));
    setPhase("baked");
  }

  async function submit() {
    if (!bakedImage) return;
    setBusy(true);
    setError("");
    try {
      const response = (await submitScreenshot({
        baked_image_data_url: bakedImage,
        ocr_text: ocrText,
        redacted_text: redactedText,
        defanged_text: redactedText,
        result,
        redaction_boxes: boxes.map((box) => ({
          text: box.text,
          reason: box.reason,
          redacted: box.redacted
        }))
      })) as SubmissionResponse;
      setSubmission(response);
      setPhase("submitted");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Submission failed.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setPhase("upload");
    setImage(null);
    setOcrText("");
    setBoxes([]);
    setActiveBoxId("");
    setBakedImage("");
    setProgress(0);
    setError("");
    setSubmission(null);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:py-10">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Trust Trainer</p>
          <h1 className="text-2xl font-semibold tracking-tight">Screenshot safety intake</h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/drill">Drill</Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>
              {phase === "upload" && "Upload one screenshot"}
              {phase === "review" && "Review redactions"}
              {phase === "baked" && "Send baked artifact"}
              {phase === "submitted" && "Submitted"}
            </CardTitle>
            <Badge variant={phase === "submitted" && submission ? resultTone(submission.result) : "secondary"}>
              {phase === "submitted" && submission ? resultLabel(submission.result) : phase}
            </Badge>
          </div>
          <CardDescription>
            {phase === "upload" && "Use the screenshot path only. Raw text paste is intentionally gone."}
            {phase === "review" && "Tap a redaction box only if it should remain visible, such as a scammer sender address."}
            {phase === "baked" && "The image below is the irreversible redacted version that will be submitted."}
            {phase === "submitted" && "The case is queued for human review. Submit another if you have one."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {phase === "upload" && (
            <div className="space-y-4">
              <Label htmlFor="screenshot">Suspicious screenshot</Label>
              <Input
                accept="image/*"
                capture="environment"
                disabled={busy}
                id="screenshot"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleFile(file);
                }}
                type="file"
              />
              {busy && <Progress value={progress} />}
              <Button className="w-full" disabled>
                <Upload className="h-4 w-4" /> Choose screenshot above
              </Button>
            </div>
          )}

          {phase === "review" && (
            <div className="space-y-4">
              <canvas
                className="w-full rounded-lg border bg-muted"
                onClick={(event) => {
                  if (!canvasRef.current || !image) return;
                  const box = boxAtPoint(canvasRef.current, image, boxes, event.clientX, event.clientY);
                  if (box) toggleBox(box.id);
                }}
                ref={canvasRef}
              />
              <div className="rounded-lg border p-3 text-sm">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-medium">OCR text after redaction</span>
                  <Badge variant="outline">{redactedCount} boxes hidden</Badge>
                </div>
                <p className="whitespace-pre-wrap text-muted-foreground">{redactedText || "No text detected."}</p>
              </div>
              <Button className="w-full" disabled={!image || busy} onClick={bake}>
                <ShieldCheck className="h-4 w-4" /> Bake redactions
              </Button>
            </div>
          )}

          {phase === "baked" && (
            <div className="space-y-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Baked redacted submission" className="w-full rounded-lg border bg-muted" src={bakedImage} />
              <Alert>
                <Camera className="h-4 w-4" />
                <AlertTitle>Raw screenshot stays local</AlertTitle>
                <AlertDescription>Only this baked image and redacted OCR text are submitted.</AlertDescription>
              </Alert>
              <Button className="w-full" disabled={busy} onClick={() => void submit()}>
                <Check className="h-4 w-4" /> Send for review
              </Button>
            </div>
          )}

          {phase === "submitted" && submission && (
            <div className="space-y-4">
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>{resultLabel(submission.result)}</AlertTitle>
                <AlertDescription>Submission `{submission.submission_id}` is queued for human review.</AlertDescription>
              </Alert>
              <Button className="w-full" onClick={reset}>
                <RotateCcw className="h-4 w-4" /> Submit another
              </Button>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Blocked</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
