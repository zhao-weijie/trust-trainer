"use client";

import { useQuery } from "convex/react";
import { ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { convexApi } from "@/lib/apiRefs";
import { fallbackDrills, type AnswerChoice, type ApprovedDrill } from "@/lib/drill";
import { saveAttempt } from "@/lib/localAttempts";

function riskVariant(risk: string) {
  return risk === "high" ? "destructive" : risk === "medium" ? "secondary" : "outline";
}

export default function DrillPage() {
  const approved = useQuery(convexApi.app.listApprovedDrills) as ApprovedDrill[] | undefined;
  const drills = useMemo(() => (approved && approved.length > 0 ? approved : fallbackDrills), [approved]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<AnswerChoice["id"] | null>(null);
  const drill = drills[index % drills.length];
  const answered = selected !== null;
  const correct = selected === drill.quiz.correct_answer;

  function answer(choiceId: AnswerChoice["id"]) {
    if (answered) return;
    setSelected(choiceId);
    saveAttempt({
      drill_id: drill.id,
      selected_answer: choiceId,
      is_correct: choiceId === drill.quiz.correct_answer,
      created_at: new Date().toISOString()
    });
  }

  function next() {
    setSelected(null);
    setIndex((current) => current + 1);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:py-10">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Trust Trainer</p>
          <h1 className="text-2xl font-semibold tracking-tight">Family safety drill</h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/submit">Submit</Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>What is the safest action?</CardTitle>
            <Badge variant={riskVariant(drill.quiz.risk_level)}>{drill.quiz.risk_level}</Badge>
          </div>
          <CardDescription>{drill.quiz.threat_type}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="whitespace-pre-wrap text-sm leading-6">{drill.quiz.scenario}</p>
          </div>

          {!answered && (
            <div className="grid gap-3">
              {drill.quiz.answer_choices.map((choice) => (
                <Button
                  className="h-auto justify-start whitespace-normal py-4 text-left"
                  key={choice.id}
                  onClick={() => answer(choice.id)}
                  variant="outline"
                >
                  <span className="mr-2 font-mono text-xs">{choice.id}</span>
                  {choice.text}
                </Button>
              ))}
            </div>
          )}

          {answered && (
            <div className="space-y-4">
              <Alert variant={correct ? "default" : "destructive"}>
                {correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                <AlertTitle>{correct ? "Correct action" : "Risky choice"}</AlertTitle>
                <AlertDescription>{drill.quiz.explanation}</AlertDescription>
              </Alert>

              <div className="overflow-hidden rounded-lg border">
                {drill.generated_asset_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="Generated safety infographic" className="w-full bg-muted" src={drill.generated_asset_url} />
                ) : (
                  <div className="grid gap-3 bg-muted p-5">
                    <p className="text-sm font-semibold">Warning signs</p>
                    <div className="grid gap-2">
                      {drill.quiz.red_flags.map((flag) => (
                        <div className="rounded-md bg-background px-3 py-2 text-sm" key={flag}>
                          {flag}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-lg border p-4">
                <p className="mb-2 text-sm font-medium">Safest action</p>
                <p className="text-sm text-muted-foreground">{drill.quiz.safest_action}</p>
              </div>

              <Button className="w-full" onClick={next}>
                Next drill <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
