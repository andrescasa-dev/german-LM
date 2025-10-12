"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSectionState } from "@/hooks/useSectionState";
import {
  showCorrectAnswer,
  showHintToast,
  showIncorrectAnswer,
} from "@/lib/toast-service";
import { generateWerdenHint, validateWerdenForm } from "@/lib/werden-rules";
import { getCentralExercises } from "@/lib/workshop-loader";
import { useState } from "react";

export function ExerciseWerdenCentral() {
  const exercises = getCentralExercises("werden");
  const { progress, answers, recordAnswer, recordHintUsed, resetSection } =
    useSectionState("werden-central", exercises.length);

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [functionAnswers, setFunctionAnswers] = useState<
    Record<string, string>
  >({});
  const [showDemo, setShowDemo] = useState(true);

  const handleSubmit = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    const selectedAnswer = selectedAnswers[exerciseId] || "";
    const functionAnswer = functionAnswers[exerciseId] || "";

    // Validar la respuesta seleccionada
    const isAnswerCorrect = selectedAnswer === exercise.correctAnswer;
    const isFunctionCorrect = functionAnswer === exercise.correctFunction;

    // Para el tracking, consideramos correcto si ambas respuestas son correctas
    const isCorrect = isAnswerCorrect && isFunctionCorrect;

    recordAnswer(
      exerciseId,
      `${selectedAnswer}|${functionAnswer}`,
      isCorrect,
      0
    );

    if (isCorrect) {
      showCorrectAnswer(
        `Respuesta: ${exercise.correctAnswer}\nFunción: ${getFunctionLabel(
          exercise.correctFunction
        )}`
      );
    } else {
      let errorMessage = "";

      if (!isAnswerCorrect) {
        // Generar explicación educativa para la respuesta incorrecta
        const validation = validateWerdenForm(selectedAnswer, exercise.context);
        errorMessage += `❌ Respuesta incorrecta: "${selectedAnswer}"\n`;
        errorMessage += `💡 ${validation.explanation}\n`;

        if (validation.commonError) {
          errorMessage += `⚠️ ${validation.commonError}\n`;
        }
      }

      if (!isFunctionCorrect) {
        errorMessage += `\n❌ Función incorrecta: "${getFunctionLabel(
          functionAnswer
        )}"\n`;
        errorMessage += `💡 Para este contexto, la función correcta es: ${getFunctionLabel(
          exercise.correctFunction
        )}\n`;

        // Agregar explicación específica de la función
        const functionExplanation = getFunctionExplanation(
          exercise.context.function
        );
        if (functionExplanation) {
          errorMessage += `📚 ${functionExplanation}\n`;
        }
      }

      showIncorrectAnswer(errorMessage);
    }
  };

  const handleShowHint = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    const hint = generateWerdenHint(exercise.context);
    recordHintUsed();
    showHintToast(`Pista para ejercicio ${exerciseId}: ${hint}`);
  };

  const getFunctionLabel = (functionCode: string): string => {
    switch (functionCode) {
      case "VP":
        return "Verbo Pleno";
      case "F":
        return "Futuro";
      case "P":
        return "Pasiva";
      case "P/F":
        return "Futuro Pasivo";
      default:
        return functionCode;
    }
  };

  const getFunctionExplanation = (functionType: string): string => {
    switch (functionType) {
      case "verbo-pleno":
        return "Verbo Pleno: werden indica cambio de estado, profesión o características. Se conjuga normalmente.";
      case "futuro":
        return "Futuro: werden + infinitivo al final. Indica acciones futuras.";
      case "pasiva":
        return "Pasiva: werden + participio pasado. Indica que el sujeto recibe la acción.";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔮 II. Ejercicio Central</CardTitle>
        <CardDescription>
          Practica los tres usos principales de werden al nivel A2/B1.
          Identifica el contexto y completa la estructura correctamente.
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
        {/* Demostración */}
        {showDemo && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3 text-blue-900 dark:text-blue-100">
              📚 Instrucciones
            </h3>
            <div className="space-y-3 text-sm">
              <p>
                <strong>1. Elige la opción correcta</strong> para completar la
                oración.
              </p>
              <p>
                <strong>2. Identifica la función</strong> de werden: VP (Verbo
                Pleno), F (Futuro), o P (Pasiva).
              </p>
              <p>
                <strong>3. Verifica ambas respuestas</strong> para obtener
                puntos.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDemo(false)}
              className="mt-4"
            >
              🪄 Entendido, comenzar ejercicio
            </Button>
          </div>
        )}

        {/* Ejercicios */}
        {!showDemo && (
          <div className="space-y-6">
            {exercises.map((exercise, index) => {
              const correct = !!answers.find(
                (a) => a.questionId === exercise.id && a.isCorrect
              );

              return (
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
                        Completa la oración y identifica la función
                      </p>
                    </div>
                    <div className="text-4xl">
                      {index === 0
                        ? "⚡"
                        : index === 1
                        ? "🔮"
                        : index === 2
                        ? "✨"
                        : index === 3
                        ? "🌟"
                        : index === 4
                        ? "💫"
                        : "⭐"}
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded p-4">
                    <p className="text-lg font-mono">{exercise.sentence}</p>
                  </div>

                  {/* Opciones múltiples */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Elige la opción correcta:
                    </label>
                    <div className="space-y-2">
                      {exercise.options.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`answer-${exercise.id}`}
                            value={option}
                            checked={selectedAnswers[exercise.id] === option}
                            onChange={(e) =>
                              setSelectedAnswers((prev) => ({
                                ...prev,
                                [exercise.id]: e.target.value,
                              }))
                            }
                            disabled={correct}
                            className="text-primary"
                          />
                          <span className="text-sm">
                            {String.fromCharCode(97 + optionIndex)}) {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Identificar función */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Identifica la función de werden:
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`function-${exercise.id}`}
                          value="VP"
                          checked={functionAnswers[exercise.id] === "VP"}
                          onChange={(e) =>
                            setFunctionAnswers((prev) => ({
                              ...prev,
                              [exercise.id]: e.target.value,
                            }))
                          }
                          disabled={correct}
                          className="text-primary"
                        />
                        <span className="text-sm">VP (Verbo Pleno)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`function-${exercise.id}`}
                          value="F"
                          checked={functionAnswers[exercise.id] === "F"}
                          onChange={(e) =>
                            setFunctionAnswers((prev) => ({
                              ...prev,
                              [exercise.id]: e.target.value,
                            }))
                          }
                          disabled={correct}
                          className="text-primary"
                        />
                        <span className="text-sm">F (Futuro)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`function-${exercise.id}`}
                          value="P"
                          checked={functionAnswers[exercise.id] === "P"}
                          onChange={(e) =>
                            setFunctionAnswers((prev) => ({
                              ...prev,
                              [exercise.id]: e.target.value,
                            }))
                          }
                          disabled={correct}
                          className="text-primary"
                        />
                        <span className="text-sm">P (Pasiva)</span>
                      </label>
                      {exercise.correctFunction === "P/F" && (
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`function-${exercise.id}`}
                            value="P/F"
                            checked={functionAnswers[exercise.id] === "P/F"}
                            onChange={(e) =>
                              setFunctionAnswers((prev) => ({
                                ...prev,
                                [exercise.id]: e.target.value,
                              }))
                            }
                            disabled={correct}
                            className="text-primary"
                          />
                          <span className="text-sm">P/F (Futuro Pasivo)</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {correct && (
                    <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                      <span>✓</span>
                      <span>Ejercicio completado correctamente</span>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-2">
                    <Button
                      onClick={() => handleSubmit(exercise.id)}
                      disabled={
                        !selectedAnswers[exercise.id] ||
                        !functionAnswers[exercise.id] ||
                        correct
                      }
                      className="w-full md:w-auto"
                    >
                      🪄 Verificar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleShowHint(exercise.id)}
                      className="w-full md:w-auto"
                    >
                      💡 Pista
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Botón de reset */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedAnswers({});
              setFunctionAnswers({});
              setShowDemo(true);
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
              Has dominado los tres usos principales de werden.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
