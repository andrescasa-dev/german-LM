"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useSectionState } from "@/hooks/useSectionState";
import {
  validateWerdenForm,
  generateWerdenHint,
  getExpectedAnswer,
} from "@/lib/werden-rules";
import { getNarrativeExercises } from "@/lib/workshop-loader";
import type { NarrativeParagraph } from "@/types/werden";
import {
  showParagraphCorrect,
  showParagraphWithErrors,
  showParagraphHints,
} from "@/lib/toast-service";

export function NarrativeWerdenCloze() {
  const paragraphs = getNarrativeExercises("werden");
  const totalClozes = paragraphs.reduce(
    (sum, para) => sum + para.clozes.length,
    0
  );

  const {
    progress,
    answers: userAnswers,
    recordAnswer,
    recordHintUsed,
    resetSection,
  } = useSectionState("werden-narrative", totalClozes);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [verifiedParagraphs, setVerifiedParagraphs] = useState<Set<string>>(
    new Set()
  );

  const handleKeyDownInput = (
    e: React.KeyboardEvent<HTMLInputElement>,
    paragraphId: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const paragraph = paragraphs.find((p) => p.id === paragraphId);
      if (!paragraph) return;

      if (!paragraph.clozes.some((c) => !answers[c.id])) return;
      // If not all filled, move focus to next empty input
      const next = paragraph.clozes.find((c) => !(answers[c.id] || "").trim());
      const el = document.querySelector<HTMLInputElement>(
        `input[data-cloze="${next?.id}"]`
      );
      el?.focus();
    }
  };

  const handleVerifyParagraph = (paragraphId: string) => {
    const paragraph = paragraphs.find((p) => p.id === paragraphId);
    if (!paragraph) return;

    let correctCount = 0;
    const results: string[] = [];

    paragraph.clozes.forEach((cloze) => {
      const answer = answers[cloze.id] || "";
      const result = validateWerdenForm(answer, cloze.context);

      recordAnswer(cloze.id, answer, result.isCorrect, 0);

      if (result.isCorrect) {
        correctCount++;
      } else {
        results.push(`❌ ${cloze.expectedAnswer}: ${result.explanation}`);
      }
    });

    const allCorrect = correctCount === paragraph.clozes.length;
    if (allCorrect) {
      setVerifiedParagraphs((prev) => new Set([...prev, paragraphId]));
      showParagraphCorrect(paragraph.id, correctCount, paragraph.clozes.length);
    } else {
      showParagraphWithErrors(paragraph.id, results);
    }
  };

  const handleHintForParagraph = (paragraphId: string) => {
    const paragraph = paragraphs.find((p) => p.id === paragraphId);
    if (!paragraph) return;

    const hints = paragraph.clozes.map((cloze) => {
      const hint = generateWerdenHint(cloze.context);
      return `• ${cloze.expectedAnswer}: ${hint}`;
    });

    recordHintUsed();
    showParagraphHints(paragraph.id, hints);
  };

  const handleFillParagraph = (paragraphId: string) => {
    const paragraph = paragraphs.find((p) => p.id === paragraphId);
    if (!paragraph) return;

    setAnswers((prev) => {
      const next = { ...prev };
      paragraph.clozes.forEach((cloze) => {
        const correctAnswer = getExpectedAnswer(cloze.context);
        next[cloze.id] = correctAnswer;
      });
      return next;
    });
  };

  const renderParagraphText = (paragraph: NarrativeParagraph) => {
    const nodes: React.ReactNode[] = [];
    const regex = /\{(\d+)\}/g;
    let lastIndex = 0;
    let clozeIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(paragraph.germanText)) !== null) {
      if (match.index > lastIndex) {
        nodes.push(
          <span key={`t-${paragraph.id}-${lastIndex}`}>
            {paragraph.germanText.slice(lastIndex, match.index)}
          </span>
        );
      }

      const cloze = paragraph.clozes[clozeIndex];
      const clozeId = cloze?.id ?? `${paragraph.id}-auto-${clozeIndex}`;
      nodes.push(
        <span
          key={`c-${paragraph.id}-${clozeId}`}
          className="inline-flex items-center mx-1"
        >
          {(() => {
            const correct = !!userAnswers.find(
              (a) => a.questionId === clozeId && a.isCorrect
            );
            return (
              <>
                <Input
                  type="text"
                  maxLength={15}
                  className="w-20 h-8 inline-flex"
                  value={answers[clozeId] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [clozeId]: e.target.value,
                    }))
                  }
                  disabled={verifiedParagraphs.has(paragraph.id) || correct}
                  aria-label={`Completar: ${cloze?.expectedAnswer}`}
                  data-cloze={clozeId}
                  onKeyDown={(e) => handleKeyDownInput(e, paragraph.id)}
                />
                {correct && (
                  <span
                    className="text-green-600 dark:text-green-400 font-semibold ml-1"
                    aria-label="Respuesta correcta"
                  >
                    ✓
                  </span>
                )}
              </>
            );
          })()}
        </span>
      );

      clozeIndex++;
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < paragraph.germanText.length) {
      nodes.push(
        <span key={`t-${paragraph.id}-end`}>
          {paragraph.germanText.slice(lastIndex)}
        </span>
      );
    }

    return nodes;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔮 III. Relato Contextualizado</CardTitle>
        <CardDescription>
          Julia está planeando un gran cambio. Lee su relato sobre su futuro y
          completa los espacios usando la forma correcta de werden.
        </CardDescription>
        <Progress value={progress.score} className="mt-4" />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>
            Progreso: {progress.correctAnswers}/{progress.totalQuestions}
          </span>
          <span>Pistas usadas: {progress.hintsUsed}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">
            📖 El Futuro de Julia
          </h3>
          <p className="text-sm text-muted-foreground">
            Completa los espacios en el relato. Presta atención al contexto para
            determinar si werden actúa como verbo pleno, futuro o pasiva.
          </p>
        </div>

        {paragraphs.map((paragraph, index) => (
          <div
            key={paragraph.id}
            className="border border-border rounded-lg p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {index === 0 ? "👩‍🎓" : index === 1 ? "📚" : "💬"}
              </span>
              <h3 className="font-semibold text-lg">
                {index === 0
                  ? "Nuevos planes"
                  : index === 1
                  ? "Desafíos"
                  : "Conversación"}
              </h3>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 leading-relaxed">
              <p className="text-base">{renderParagraphText(paragraph)}</p>
            </div>

            {!verifiedParagraphs.has(paragraph.id) && (
              <div className="flex flex-col md:flex-row gap-2">
                <Button
                  onClick={() => handleVerifyParagraph(paragraph.id)}
                  disabled={paragraph.clozes.some((c) => !answers[c.id])}
                  className="w-full md:w-auto"
                >
                  🪄 Verificar párrafo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleHintForParagraph(paragraph.id)}
                  className="w-full md:w-auto"
                >
                  💡 Pistas
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleFillParagraph(paragraph.id)}
                  aria-label={`Rellenar todas las respuestas del párrafo`}
                  className="w-full md:w-auto"
                >
                  🪄 Rellenar
                </Button>
              </div>
            )}

            {verifiedParagraphs.has(paragraph.id) && (
              <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                <span>✓</span>
                <span>Párrafo verificado</span>
              </div>
            )}
          </div>
        ))}

        {/* Producción opcional */}
        {verifiedParagraphs.size === paragraphs.length && (
          <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3 text-purple-900 dark:text-purple-100">
              ✍️ Producción opcional
            </h3>
            <p className="text-sm mb-4">
              Reescribe estas oraciones cambiando el contexto para forzar una
              función distinta de werden:
            </p>
            <div className="space-y-3 text-sm">
              <p>
                1. &ldquo;Julia <strong>wird</strong> eine neue Karriere{" "}
                <strong>starten</strong>&rdquo;
                <br />
                <span className="text-muted-foreground">
                  → Reescribe como verbo pleno (sin infinitivo)
                </span>
              </p>
              <p>
                2. &ldquo;Das Studium <strong>wird</strong> schwer&rdquo;
                <br />
                <span className="text-muted-foreground">
                  → Reescribe en futuro (con infinitivo)
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Botón de reset */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              setAnswers({});
              setVerifiedParagraphs(new Set());
              resetSection();
            }}
          >
            Reiniciar sección
          </Button>
        </div>

        {/* Medalla si completado */}
        {progress.completed && (
          <div
            className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="text-4xl mb-2">🏅</div>
            <p className="font-semibold text-green-900 dark:text-green-100">
              ¡Relato completado con {progress.score}%!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Has aplicado werden en contexto narrativo con éxito.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
