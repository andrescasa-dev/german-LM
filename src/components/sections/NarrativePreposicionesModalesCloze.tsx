"use client";

import { useState, useEffect, JSX } from "react";
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
import { useVariant } from "@/hooks/useVariant";
import { preposicionModalRelacionalValidator } from "@/lib/preposiciones-modales-rules";
import type {
  PreposicionModalRelacionalParagraph,
  PreposicionModalRelacionalCloze,
} from "@/types/preposiciones-modales-relaciones";
import {
  showCorrectAnswer,
  showIncorrectAnswer,
  showHintToast,
} from "@/lib/toast-service";
import { getPreposicionesModalesNarrativeAsync } from "@/lib/workshop-loader";

export function NarrativePreposicionesModalesCloze() {
  const { currentVariant } = useVariant();
  const [paragraphs, setParagraphs] = useState<
    PreposicionModalRelacionalParagraph[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Load paragraphs based on current variant
  useEffect(() => {
    const loadParagraphs = async () => {
      setLoading(true);
      try {
        const data = await getPreposicionesModalesNarrativeAsync(
          "preposiciones-modales-relaciones",
          currentVariant
        );
        setParagraphs(data);
      } catch (error) {
        console.error("Failed to load paragraphs:", error);
        // Fallback to variant 1
        const data = await getPreposicionesModalesNarrativeAsync(
          "preposiciones-modales-relaciones",
          1
        );
        setParagraphs(data);
      } finally {
        setLoading(false);
      }
    };

    loadParagraphs();
  }, [currentVariant]);

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
  } = useSectionState("preposiciones-modales-narrative", totalClozes);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});

  // Listen for section reset events
  useEffect(() => {
    const handleReset = () => {
      setAnswers({});
      setAttempts({});
      resetSection();
    };

    window.addEventListener("resetAllSections", handleReset);
    return () => window.removeEventListener("resetAllSections", handleReset);
  }, [resetSection]);

  const handleSubmit = (cloze: PreposicionModalRelacionalCloze) => {
    const answer = answers[cloze.id] || "";
    const result = preposicionModalRelacionalValidator.validate(
      answer,
      cloze.context
    );
    const currentAttempts = attempts[cloze.id] || 0;

    recordAnswer(cloze.id, answer, result.isCorrect, 0);
    setAttempts((prev) => ({ ...prev, [cloze.id]: currentAttempts + 1 }));

    if (result.isCorrect) {
      showCorrectAnswer(result.explanation, result.markerInfo);
    } else {
      showIncorrectAnswer(
        result.explanation,
        result.example,
        result.markerInfo
      );
    }
  };

  const handleHint = (cloze: PreposicionModalRelacionalCloze) => {
    const hint = preposicionModalRelacionalValidator.generateHint(
      cloze.context
    );
    recordHintUsed();
    showHintToast(hint);
  };

  const renderTextWithClozes = (
    paragraph: PreposicionModalRelacionalParagraph
  ) => {
    let text = paragraph.germanText;
    const clozeElements: JSX.Element[] = [];

    paragraph.clozes.forEach((cloze, index) => {
      const correct = !!userAnswers.find(
        (a: { questionId: string; isCorrect: boolean }) =>
          a.questionId === cloze.id && a.isCorrect
      );
      const incorrect = !!userAnswers.find(
        (a: { questionId: string; isCorrect: boolean }) =>
          a.questionId === cloze.id && !a.isCorrect
      );

      const inputElement = (
        <span key={cloze.id} className="inline-flex items-center gap-1">
          <Input
            type="text"
            maxLength={10}
            className="w-20 h-8 text-sm inline-block"
            value={answers[cloze.id] || ""}
            onChange={(e) =>
              setAnswers((prev) => ({
                ...prev,
                [cloze.id]: e.target.value,
              }))
            }
            disabled={correct}
            aria-label={`Preposición modal/relacional ${index + 1}`}
          />
          {correct && (
            <span
              className="text-green-600 dark:text-green-400 font-semibold text-sm"
              aria-label="Respuesta correcta"
            >
              ✓
            </span>
          )}
          {incorrect && !correct && (
            <span
              className="text-red-600 dark:text-red-400 font-semibold text-sm"
              aria-label="Respuesta incorrecta"
            >
              ✗
            </span>
          )}
        </span>
      );

      clozeElements.push(inputElement);
    });

    // Replace ____ (1), ____ (2), etc. with the input elements
    let elementIndex = 0;
    text = text.replace(/____\s*\(\d+\)/g, () => {
      elementIndex++;
      return `__CLOZE_${elementIndex - 1}__`;
    });

    // Split text and insert elements
    const parts = text.split(/__CLOZE_\d+__/);
    const result: (string | JSX.Element)[] = [];

    for (let i = 0; i < parts.length; i++) {
      if (parts[i]) {
        result.push(parts[i]);
      }
      if (i < clozeElements.length) {
        result.push(clozeElements[i]);
      }
    }

    return result;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          📖 III. Relato Contextualizado: Una fiesta sorpresa
        </CardTitle>
        <CardDescription>
          Completa el relato con las preposiciones modales y relacionales
          correctas
        </CardDescription>
        <Progress value={progress.score} className="mt-4" />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>
            Respuestas: {progress.correctAnswers}/{progress.totalQuestions}
          </span>
          <span>Pistas usadas: {progress.hintsUsed}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Cargando variante...</div>
          </div>
        ) : (
          <>
            {/* Párrafos */}
            <div className="space-y-8">
              {paragraphs.map((paragraph) => (
                <div
                  key={paragraph.id}
                  className="border border-border rounded-lg p-6 space-y-6"
                >
                  <div className="bg-muted/50 rounded p-4">
                    <p className="text-lg leading-relaxed">
                      {renderTextWithClozes(paragraph)}
                    </p>
                  </div>

                  {/* Botones para cada cloze */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paragraph.clozes.map((cloze, clozeIndex) => (
                      <div
                        key={cloze.id}
                        className="flex flex-col gap-2 p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            Espacio {clozeIndex + 1}:
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {cloze.context.meaning} | {cloze.context.case}
                          </span>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSubmit(cloze)}
                            disabled={
                              !answers[cloze.id] ||
                              !!userAnswers.find(
                                (a: {
                                  questionId: string;
                                  isCorrect: boolean;
                                }) => a.questionId === cloze.id && a.isCorrect
                              )
                            }
                            className="w-full md:w-auto"
                          >
                            🪄 Verificar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleHint(cloze)}
                            className="w-full md:w-auto"
                          >
                            💡 Pista
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            aria-label={`Rellenar preposición correcta para espacio ${
                              clozeIndex + 1
                            }`}
                            onClick={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                [cloze.id]:
                                  preposicionModalRelacionalValidator.getCorrectAnswer(
                                    cloze.context
                                  ),
                              }))
                            }
                            className="w-full md:w-auto"
                          >
                            🪄 Rellenar
                          </Button>
                        </div>

                        {attempts[cloze.id] > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Intentos: {attempts[cloze.id]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Botón de reset */}
            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setAnswers({});
                  setAttempts({});
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
                  Has aplicado las preposiciones modales y relacionales en
                  contexto narrativo.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
