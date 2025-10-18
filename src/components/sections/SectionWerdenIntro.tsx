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
import { getWarmupExercises } from "@/lib/workshop-loader";
import {
  showCorrectAnswer,
  showIncorrectAnswer,
  showHintToast,
} from "@/lib/toast-service";

export function SectionWerdenIntro() {
  const exercises = getWarmupExercises("werden");
  const { progress, answers, recordAnswer, recordHintUsed, resetSection } =
    useSectionState("werden-intro", exercises.length);

  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showHint, setShowHint] = useState<string | null>(null);

  const handleSubmit = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    const answer = userAnswers[exerciseId] || "";
    const result = validateWerdenForm(answer, exercise.context);

    recordAnswer(
      exerciseId,
      answer,
      result.isCorrect,
      showHint === exerciseId ? 1 : 0
    );

    if (result.isCorrect) {
      showCorrectAnswer(result.explanation);
    } else {
      showIncorrectAnswer(result.explanation, result.example);
    }
  };

  const handleShowHint = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    const hint = generateWerdenHint(exercise.context);
    setShowHint(exerciseId);
    recordHintUsed();
    showHintToast(hint);
  };

  const handleFillAnswer = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    const correctAnswer = getExpectedAnswer(exercise.context);
    setUserAnswers((prev) => ({
      ...prev,
      [exerciseId]: correctAnswer,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔮 I. Repaso y Diagnóstico</CardTitle>
        <CardDescription>
          En esta sección, revisaremos las funciones clave de werden y
          practicaremos su conjugación básica en presente, esencial para el
          nivel A2.
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
        {/* Tabla de funciones clave */}
        <div>
          <h3 className="font-semibold text-lg mb-4">
            Funciones clave del verbo Werden
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-left">
                    Función
                  </th>
                  <th className="border border-border p-3 text-left">
                    Significado
                  </th>
                  <th className="border border-border p-3 text-left">
                    Estructura
                  </th>
                  <th className="border border-border p-3 text-left">
                    Ejemplo
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3 font-medium">
                    Verbo Principal
                  </td>
                  <td className="border border-border p-3">
                    Llegar a ser, convertirse en
                  </td>
                  <td className="border border-border p-3">
                    Sujeto + werden (conjugado)
                  </td>
                  <td className="border border-border p-3 font-mono">
                    Du <strong>wirst</strong> Lehrerin
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">
                    Futuro I
                  </td>
                  <td className="border border-border p-3">Tiempo futuro</td>
                  <td className="border border-border p-3">
                    Sujeto + werden + infinitivo
                  </td>
                  <td className="border border-border p-3 font-mono">
                    Ich <strong>werde</strong> morgen Hans{" "}
                    <strong>treffen</strong>
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">
                    Voz Pasiva
                  </td>
                  <td className="border border-border p-3">
                    Enfocar en la acción
                  </td>
                  <td className="border border-border p-3">
                    Sujeto + werden + participio
                  </td>
                  <td className="border border-border p-3 font-mono">
                    Das Buch <strong>wird gelesen</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla de conjugación */}
        <div>
          <h3 className="font-semibold text-lg mb-4">
            Conjugación en Presente (Präsens Indikativ)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-left">
                    Pronombre
                  </th>
                  <th className="border border-border p-3 text-left">
                    Conjugación
                  </th>
                  <th className="border border-border p-3 text-left">
                    Significado
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3 font-medium">ich</td>
                  <td className="border border-border p-3 font-mono">
                    <strong>werde</strong>
                  </td>
                  <td className="border border-border p-3">yo llegaré a ser</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">du</td>
                  <td className="border border-border p-3 font-mono">
                    <strong>wirst</strong>
                  </td>
                  <td className="border border-border p-3">
                    tú llegarás a ser
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">
                    er/sie/es
                  </td>
                  <td className="border border-border p-3 font-mono">
                    <strong>wird</strong>
                  </td>
                  <td className="border border-border p-3">
                    él/ella/ello llegará a ser
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">wir</td>
                  <td className="border border-border p-3 font-mono">
                    <strong>werden</strong>
                  </td>
                  <td className="border border-border p-3">
                    nosotros llegaremos a ser
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">ihr</td>
                  <td className="border border-border p-3 font-mono">
                    <strong>werdet</strong>
                  </td>
                  <td className="border border-border p-3">
                    vosotros llegaréis a ser
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">
                    sie/Sie
                  </td>
                  <td className="border border-border p-3 font-mono">
                    <strong>werden</strong>
                  </td>
                  <td className="border border-border p-3">
                    ellos/ustedes llegarán a ser
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Ejercicios de calentamiento */}
        <div>
          <h3 className="font-semibold text-lg mb-4">
            Ejercicios de Calentamiento
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Completa la frase conjugando werden en presente, en su función de
            &ldquo;convertirse en&rdquo; o &ldquo;cambio de estado&rdquo;.
          </p>
          <div className="space-y-6">
            {exercises.map((exercise) => {
              const parts = exercise.sentence.split("___");
              const before = parts[0] ?? "";
              const after = parts[1] ?? "";
              const correct = !!answers.find(
                (a) => a.questionId === exercise.id && a.isCorrect
              );

              return (
                <div
                  key={exercise.id}
                  className="border border-border rounded-lg p-4"
                >
                  <div className="mb-3 text-base leading-relaxed">
                    <label htmlFor={exercise.id} className="sr-only">
                      Conjugación para: {exercise.sentence}
                    </label>
                    <p>
                      {before}
                      <span className="inline-flex items-baseline gap-2 align-baseline">
                        <Input
                          id={exercise.id}
                          type="text"
                          maxLength={10}
                          className="inline-block align-baseline w-32 min-w-[8rem] shrink-0"
                          value={userAnswers[exercise.id] || ""}
                          onChange={(e) =>
                            setUserAnswers((prev) => ({
                              ...prev,
                              [exercise.id]: e.target.value,
                            }))
                          }
                          aria-label={`Conjugación para: ${exercise.sentence}`}
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
                        {!correct &&
                          answers.find((a) => a.questionId === exercise.id) && (
                            <span
                              className="text-red-600 dark:text-red-400 font-semibold"
                              aria-label="Respuesta incorrecta"
                            >
                              ✗
                            </span>
                          )}
                      </span>
                      {after}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSubmit(exercise.id)}
                      disabled={!userAnswers[exercise.id] || correct}
                      className="w-full md:w-auto"
                    >
                      🪄 Verificar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShowHint(exercise.id)}
                      className="w-full md:w-auto"
                    >
                      💡 Pista
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label={`Rellenar conjugación correcta para: ${exercise.sentence}`}
                      onClick={() => handleFillAnswer(exercise.id)}
                      className="w-full md:w-auto"
                    >
                      🪄 Rellenar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón de reset */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              setUserAnswers({});
              setShowHint(null);
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
              ¡Sección completada con {progress.score}%!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Has dominado la conjugación básica de werden.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
