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
import type { PreposicionDestinoProcedenciaExercise } from "@/types/preposiciones-destino-procedencia";
import {
  showCorrectAnswer,
  showIncorrectAnswer,
  showHintToast,
} from "@/lib/toast-service";
import { getPreposicionesDestinoProcedenciaCentralAsync } from "@/lib/workshop-loader";

export function ExercisePreposicionesDestinoProcedencia() {
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
        const data = await getPreposicionesDestinoProcedenciaCentralAsync(
          "preposiciones-destino-procedencia",
          currentVariant
        );
        setExercises(data);
      } catch (error) {
        console.error("Failed to load exercises:", error);
        // Fallback to variant 1
        const data = await getPreposicionesDestinoProcedenciaCentralAsync(
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
    "preposiciones-destino-procedencia-central",
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

  const getIconForType = (type: string) => {
    switch (type) {
      case "destino":
        return "🎯";
      case "procedencia":
        return "📍";
      case "ubicacion":
        return "🏠";
      case "modo":
        return "👥";
      case "tiempo":
        return "⏰";
      case "posesion":
        return "👤";
      case "instrumento":
        return "🚌";
      case "local":
        return "🗺️";
      default:
        return "🔗";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          🔮 II. Ejercicio Central: Preposiciones de Destino y Procedencia
        </CardTitle>
        <CardDescription>
          Practica las preposiciones de destino y procedencia en contextos
          variados
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
            {/* Ejercicios */}
            <div className="space-y-6">
              {exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className="border border-border rounded-lg p-6 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Ejercicio {index + 1}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tipo: {exercise.context.type} | Caso:{" "}
                        {exercise.context.case} | Género:{" "}
                        {exercise.context.gender}
                      </p>
                    </div>
                    <div className="text-4xl">
                      {getIconForType(exercise.context.type)}
                    </div>
                  </div>

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
                  ¡Ejercicio completado con {progress.score}%!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Has dominado las preposiciones de destino y procedencia en
                  diferentes contextos.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
