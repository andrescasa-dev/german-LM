"use client";

import { useState, useEffect } from "react";
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
import { preposicionDestinoProcedenciaValidator } from "@/lib/preposiciones-destino-procedencia-rules";
import type {
  PreposicionDestinoProcedenciaParagraph,
  PreposicionDestinoProcedenciaCloze,
} from "@/types/preposiciones-destino-procedencia";
import {
  showCorrectAnswer,
  showIncorrectAnswer,
  showHintToast,
} from "@/lib/toast-service";
import { getPreposicionesDestinoProcedenciaNarrativeAsync } from "@/lib/workshop-loader";

export function NarrativePreposicionesDestinoProcedenciaCloze() {
  const { currentVariant } = useVariant();
  const [paragraphs, setParagraphs] = useState<
    PreposicionDestinoProcedenciaParagraph[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Load paragraphs based on current variant
  useEffect(() => {
    const loadParagraphs = async () => {
      setLoading(true);
      try {
        const data = await getPreposicionesDestinoProcedenciaNarrativeAsync(
          "preposiciones-destino-procedencia",
          currentVariant
        );
        setParagraphs(data);
      } catch (error) {
        console.error("Failed to load paragraphs:", error);
        // Fallback to variant 1
        const data = await getPreposicionesDestinoProcedenciaNarrativeAsync(
          "preposiciones-destino-procedencia",
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
  } = useSectionState(
    "preposiciones-destino-procedencia-narrative",
    totalClozes
  );

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

  const handleSubmit = (cloze: PreposicionDestinoProcedenciaCloze) => {
    const answer = answers[cloze.id] || "";
    const result = preposicionDestinoProcedenciaValidator.validate(
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

  const handleHint = (cloze: PreposicionDestinoProcedenciaCloze) => {
    const hint = preposicionDestinoProcedenciaValidator.generateHint(
      cloze.context
    );
    recordHintUsed();
    showHintToast(hint);
  };

  const renderTextWithClozes = (
    paragraph: PreposicionDestinoProcedenciaParagraph
  ) => {
    const parts = paragraph.germanText.split(/(\{(\d+)\})/);
    return parts.map((part, index) => {
      if (part.match(/^\{(\d+)\}$/)) {
        const clozeIndex = parseInt(part.slice(1, -1));
        const cloze = paragraph.clozes[clozeIndex];
        if (!cloze) return part;

        const correct = !!userAnswers.find(
          (a: { questionId: string; isCorrect: boolean }) =>
            a.questionId === cloze.id && a.isCorrect
        );
        const incorrect = !!userAnswers.find(
          (a: { questionId: string; isCorrect: boolean }) =>
            a.questionId === cloze.id && !a.isCorrect
        );

        return (
          <span key={index} className="inline-block mx-1">
            <Input
              type="text"
              maxLength={15}
              className="w-32 inline-block"
              value={answers[cloze.id] || ""}
              onChange={(e) =>
                setAnswers((prev) => ({
                  ...prev,
                  [cloze.id]: e.target.value,
                }))
              }
              disabled={correct}
              aria-label={`Preposición para cloze ${clozeIndex + 1}`}
            />
            {correct && (
              <span
                className="text-green-600 dark:text-green-400 font-semibold ml-1"
                aria-label="Respuesta correcta"
              >
                ✓
              </span>
            )}
            {incorrect && !correct && (
              <span
                className="text-red-600 dark:text-red-400 font-semibold ml-1"
                aria-label="Respuesta incorrecta"
              >
                ✗
              </span>
            )}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          📖 III. Relato Contextualizado: Viaje por Alemania
        </CardTitle>
        <CardDescription>
          Completa el relato usando las preposiciones de destino y procedencia
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
            {/* Relato */}
            <div className="space-y-6">
              {paragraphs.map((paragraph) => (
                <div
                  key={paragraph.id}
                  className="border border-border rounded-lg p-6 space-y-4"
                >
                  <div className="bg-muted/50 rounded p-4">
                    <p className="text-lg leading-relaxed">
                      {renderTextWithClozes(paragraph)}
                    </p>
                  </div>

                  {/* Controles para cada cloze */}
                  <div className="space-y-3">
                    {paragraph.clozes.map((cloze, clozeIndex) => {
                      const correct = !!userAnswers.find(
                        (a: { questionId: string; isCorrect: boolean }) =>
                          a.questionId === cloze.id && a.isCorrect
                      );
                      return (
                        <div
                          key={cloze.id}
                          className="flex items-center gap-3 p-3 bg-muted/30 rounded"
                        >
                          <span className="text-sm font-medium min-w-[120px]">
                            Hueco {clozeIndex + 1}:
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleSubmit(cloze)}
                              disabled={!answers[cloze.id] || correct}
                              size="sm"
                            >
                              🪄 Verificar
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleHint(cloze)}
                              size="sm"
                            >
                              💡 Pista
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() =>
                                setAnswers((prev) => ({
                                  ...prev,
                                  [cloze.id]:
                                    preposicionDestinoProcedenciaValidator.getCorrectAnswer(
                                      cloze.context
                                    ),
                                }))
                              }
                              size="sm"
                            >
                              🪄 Rellenar
                            </Button>
                          </div>
                          {attempts[cloze.id] > 0 && (
                            <span className="text-sm text-muted-foreground">
                              Intentos: {attempts[cloze.id]}
                            </span>
                          )}
                        </div>
                      );
                    })}
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
                  Has aplicado correctamente las preposiciones de destino y
                  procedencia en un contexto narrativo.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
