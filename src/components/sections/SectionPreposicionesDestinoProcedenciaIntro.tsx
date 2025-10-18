"use client";

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
import type { PreposicionDestinoProcedenciaExercise } from "@/types/preposiciones-destino-procedencia";
import {
  showCorrectAnswer,
  showIncorrectAnswer,
  showHintToast,
} from "@/lib/toast-service";
import { getPreposicionesDestinoProcedenciaWarmupAsync } from "@/lib/workshop-loader";
import { useState, useEffect } from "react";

export function SectionPreposicionesDestinoProcedenciaIntro() {
  const { currentVariant } = useVariant();
  const [exercises, setExercises] = useState<
    PreposicionDestinoProcedenciaExercise[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Load exercises based on current variant
  useEffect(() => {
    const loadExercises = async () => {
      setLoading(true);
      try {
        const data = await getPreposicionesDestinoProcedenciaWarmupAsync(
          "preposiciones-destino-procedencia",
          currentVariant
        );
        setExercises(data);
      } catch (error) {
        console.error("Failed to load exercises:", error);
        // Fallback to variant 1
        const data = await getPreposicionesDestinoProcedenciaWarmupAsync(
          "preposiciones-destino-procedencia",
          1
        );
        setExercises(data);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [currentVariant]);

  const {
    progress,
    answers: userAnswers,
    recordAnswer,
    recordHintUsed,
    resetSection,
  } = useSectionState(
    "preposiciones-destino-procedencia-warmup",
    exercises.length
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

  const handleSubmit = (exercise: PreposicionDestinoProcedenciaExercise) => {
    const answer = answers[exercise.id] || "";
    const result = preposicionDestinoProcedenciaValidator.validate(
      answer,
      exercise.context
    );
    const currentAttempts = attempts[exercise.id] || 0;

    recordAnswer(exercise.id, answer, result.isCorrect, 0);
    setAttempts((prev) => ({ ...prev, [exercise.id]: currentAttempts + 1 }));

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

  const handleHint = (exercise: PreposicionDestinoProcedenciaExercise) => {
    const hint = preposicionDestinoProcedenciaValidator.generateHint(
      exercise.context
    );
    recordHintUsed();
    showHintToast(hint);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          🎯 I. Repaso & Diagnóstico: Preposiciones de Destino y Procedencia
        </CardTitle>
        <CardDescription>
          Identifica las preposiciones de destino y procedencia correctas en
          diferentes contextos
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
            {/* Demostración */}
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3 text-blue-900 dark:text-blue-100">
                📚 Guía rápida: Preposiciones de destino y procedencia (Dativo
                Fijo)
              </h3>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>aus (Dativo):</strong> Desde, de (procedencia)
                  <br />
                  <span className="text-muted-foreground">
                    → &quot;Wir kommen aus der Schweiz.&quot;
                  </span>
                </p>
                <p>
                  <strong>nach (Dativo):</strong> Hacia, a (destino con nombres
                  propios)
                  <br />
                  <span className="text-muted-foreground">
                    → &quot;Ich fahre nach Italien.&quot;
                  </span>
                </p>
                <p>
                  <strong>zu (Dativo):</strong> Hacia, a (destino con nombres
                  comunes)
                  <br />
                  <span className="text-muted-foreground">
                    → &quot;Sie geht zum Arzt.&quot;
                  </span>
                </p>
                <p>
                  <strong>bei (Dativo):</strong> En casa de (ubicación)
                  <br />
                  <span className="text-muted-foreground">
                    → &quot;Ich bin bei meinen Großeltern.&quot;
                  </span>
                </p>
                <p>
                  <strong>von (Dativo):</strong> De, desde (origen o posesión)
                  <br />
                  <span className="text-muted-foreground">
                    → &quot;Das ist die Tasche von meiner Schwester.&quot;
                  </span>
                </p>
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded">
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                    💡 Recordatorio importante:
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Estas preposiciones SIEMPRE rigen Dativo, independientemente
                    del verbo.
                  </p>
                </div>
              </div>
            </div>

            {/* Ejercicios */}
            <div className="space-y-6">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="border border-border rounded-lg p-6 space-y-4"
                >
                  <div className="bg-muted/50 rounded p-4">
                    <p className="text-lg font-mono">
                      {exercise.sentence.replace("____", "_____")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <label
                      htmlFor={exercise.id}
                      className="text-sm font-medium"
                    >
                      Preposición + artículo:
                    </label>
                    {(() => {
                      const correct = !!userAnswers.find(
                        (a: { questionId: string; isCorrect: boolean }) =>
                          a.questionId === exercise.id && a.isCorrect
                      );
                      const incorrect = !!userAnswers.find(
                        (a: { questionId: string; isCorrect: boolean }) =>
                          a.questionId === exercise.id && !a.isCorrect
                      );
                      return (
                        <>
                          <Input
                            id={exercise.id}
                            type="text"
                            maxLength={15}
                            className="w-40"
                            value={answers[exercise.id] || ""}
                            onChange={(e) =>
                              setAnswers((prev) => ({
                                ...prev,
                                [exercise.id]: e.target.value,
                              }))
                            }
                            aria-label={`Preposición para: ${exercise.sentence}`}
                            disabled={correct}
                          />
                          {correct && (
                            <span
                              className="text-green-600 dark:text-green-400 font-semibold"
                              aria-label="Respuesta correcta"
                            >
                              ✓
                            </span>
                          )}
                          {incorrect && !correct && (
                            <span
                              className="text-red-600 dark:text-red-400 font-semibold"
                              aria-label="Respuesta incorrecta"
                            >
                              ✗
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  <div className="flex flex-col md:flex-row gap-2">
                    <Button
                      onClick={() => handleSubmit(exercise)}
                      disabled={
                        !answers[exercise.id] ||
                        !!userAnswers.find(
                          (a: { questionId: string; isCorrect: boolean }) =>
                            a.questionId === exercise.id && a.isCorrect
                        )
                      }
                      className="w-full md:w-auto"
                    >
                      🪄 Verificar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleHint(exercise)}
                      className="w-full md:w-auto"
                    >
                      💡 Pista
                    </Button>
                    <Button
                      variant="secondary"
                      aria-label={`Rellenar preposición correcta para: ${exercise.sentence}`}
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [exercise.id]:
                            preposicionDestinoProcedenciaValidator.getCorrectAnswer(
                              exercise.context
                            ),
                        }))
                      }
                      className="w-full md:w-auto"
                    >
                      🪄 Rellenar
                    </Button>
                  </div>

                  {attempts[exercise.id] > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Intentos: {attempts[exercise.id]}
                    </p>
                  )}
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
                  ¡Repaso completado con {progress.score}%!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Has refrescado las preposiciones de destino y procedencia
                  básicas.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
