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
import {
  validatePreposicionTemporal,
  generatePreposicionHint,
  getPreposicionAnswer,
} from "@/lib/preposiciones-rules";
import type { PreposicionTemporalExercise } from "@/types/preposiciones-temporales";
import {
  showCorrectAnswer,
  showIncorrectAnswer,
  showHintToast,
} from "@/lib/toast-service";
import { getPreposicionesTemporalesWarmupAsync } from "@/lib/workshop-loader";
import { useState, useEffect } from "react";

export function SectionPreposicionesIntro() {
  const { currentVariant } = useVariant();
  const [exercises, setExercises] = useState<PreposicionTemporalExercise[]>([]);
  const [loading, setLoading] = useState(true);

  // Load exercises based on current variant
  useEffect(() => {
    const loadExercises = async () => {
      setLoading(true);
      try {
        const data = await getPreposicionesTemporalesWarmupAsync(
          "preposiciones-temporales",
          currentVariant
        );
        setExercises(data);
      } catch (error) {
        console.error("Failed to load exercises:", error);
        // Fallback to variant 1
        const data = await getPreposicionesTemporalesWarmupAsync(
          "preposiciones-temporales",
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
  } = useSectionState("preposiciones-warmup", exercises.length);

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

  const handleSubmit = (exercise: PreposicionTemporalExercise) => {
    const answer = answers[exercise.id] || "";
    const result = validatePreposicionTemporal(answer, exercise.context);
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

  const handleHint = (exercise: PreposicionTemporalExercise) => {
    const hint = generatePreposicionHint(exercise.context);
    recordHintUsed();
    showHintToast(hint);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          🎯 I. Repaso & Diagnóstico: Preposiciones Temporales
        </CardTitle>
        <CardDescription>
          Identifica las preposiciones temporales correctas en diferentes
          contextos
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
                📚 Guía rápida: Preposiciones temporales
              </h3>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>um:</strong> Para horas específicas
                  <br />
                  <span className="text-muted-foreground">
                    → &quot;um 8 Uhr&quot; (a las 8)
                  </span>
                </p>
                <p>
                  <strong>am:</strong> Para días, momentos del día, fechas
                  <br />
                  <span className="text-muted-foreground">
                    → &quot;am Montag&quot; (el lunes), &quot;am Morgen&quot;
                    (por la mañana)
                  </span>
                </p>
                <p>
                  <strong>im:</strong> Para meses y estaciones
                  <br />
                  <span className="text-muted-foreground">
                    → &quot;im Mai&quot; (en mayo), &quot;im Sommer&quot; (en
                    verano)
                  </span>
                </p>
                <p>
                  <strong>seit:</strong> Para duración desde el pasado
                  <br />
                  <span className="text-muted-foreground">
                    → &quot;seit drei Jahren&quot; (desde hace tres años)
                  </span>
                </p>
                <p>
                  <strong>nach:</strong> Para secuencia temporal
                  <br />
                  <span className="text-muted-foreground">
                    → &quot;nach dem Unterricht&quot; (después de la clase)
                  </span>
                </p>
                <p>
                  <strong>bis:</strong> Para límite temporal
                  <br />
                  <span className="text-muted-foreground">
                    → &quot;bis Freitag&quot; (hasta el viernes)
                  </span>
                </p>
                <p>
                  <strong>von... bis:</strong> Para período completo
                  <br />
                  <span className="text-muted-foreground">
                    → &quot;von 9 bis 17 Uhr&quot; (de 9 a 17 horas)
                  </span>
                </p>
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
                      Preposición temporal:
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
                            maxLength={10}
                            className="w-32"
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
                          [exercise.id]: getPreposicionAnswer(exercise.context),
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
                  Has refrescado las preposiciones temporales básicas.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
