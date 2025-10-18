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
import {
  validateAdjectiveEnding,
  generateHint,
  getAdjectiveEnding,
} from "@/lib/adjective-rules";
import type { CentralScenario } from "@/types/adjective";
import {
  showCorrectAnswer,
  showIncorrectAnswer,
  showHintToast,
  showExtraAttempt,
} from "@/lib/toast-service";
import { getCentralScenariosAsync } from "@/lib/workshop-loader";

// Hardcoded titles and emojis for scenarios (UI content stays in component)
const SCENARIO_TITLES: Record<string, string> = {
  "akk-weak": "Escenario 1: Declinación débil",
  "akk-mixed": "Escenario 2: Declinación mixta",
  "akk-strong": "Escenario 3: Declinación fuerte",
};

const SCENARIO_EMOJIS: Record<string, string> = {
  "akk-weak": "🚗",
  "akk-mixed": "🚙",
  "akk-strong": "🚕",
};

export function ExerciseAkkusativMasculine() {
  const { currentVariant } = useVariant();
  const [scenarios, setScenarios] = useState<CentralScenario[]>([]);
  const [loading, setLoading] = useState(true);

  // Load scenarios based on current variant
  useEffect(() => {
    const loadScenarios = async () => {
      setLoading(true);
      try {
        const data = await getCentralScenariosAsync("adjetivo", currentVariant);
        setScenarios(data);
      } catch (error) {
        console.error("Failed to load scenarios:", error);
        // Fallback to default scenarios
        const data = await getCentralScenariosAsync("adjetivo", 1);
        setScenarios(data);
      } finally {
        setLoading(false);
      }
    };

    loadScenarios();
  }, [currentVariant]);

  const {
    progress,
    answers: userAnswers,
    recordAnswer,
    recordHintUsed,
    resetSection,
  } = useSectionState("exercise-akkusativ", scenarios.length);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showDemo, setShowDemo] = useState(true);
  const [attempts, setAttempts] = useState<Record<string, number>>({});

  const handleSubmit = (scenario: CentralScenario) => {
    const answer = answers[scenario.id] || "";
    const result = validateAdjectiveEnding(answer, scenario.context);
    const currentAttempts = attempts[scenario.id] || 0;

    recordAnswer(scenario.id, answer, result.isCorrect, 0);
    setAttempts((prev) => ({ ...prev, [scenario.id]: currentAttempts + 1 }));

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

  const handleHint = (scenario: CentralScenario) => {
    const hint = generateHint(scenario.context);
    recordHintUsed();
    showHintToast(hint);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔮 II. Ejercicio Central: Acusativo Masculino</CardTitle>
        <CardDescription>
          Consolidar la selección de terminaciones en el punto de mayor
          confusión
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
            {showDemo && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-blue-900 dark:text-blue-100">
                  📚 Demostración: ¿Por qué cambia la terminación?
                </h3>
                <div className="space-y-3 text-sm">
                  <p>
                    <strong>Con artículo definido (débil):</strong> &ldquo;den
                    neu
                    <strong>en</strong> Wagen&rdquo;
                    <br />
                    <span className="text-muted-foreground">
                      → El artículo &ldquo;den&rdquo; ya marca acusativo
                      masculino, el adjetivo usa -en.
                    </span>
                  </p>
                  <p>
                    <strong>Con artículo indefinido (mixta):</strong>{" "}
                    &ldquo;einen neu<strong>en</strong> Wagen&rdquo;
                    <br />
                    <span className="text-muted-foreground">
                      → &ldquo;einen&rdquo; marca el acusativo, el adjetivo usa
                      -en.
                    </span>
                  </p>
                  <p>
                    <strong>Sin artículo (fuerte):</strong> &ldquo;neu
                    <strong>en</strong> Wagen&rdquo;
                    <br />
                    <span className="text-muted-foreground">
                      → Sin artículo, el adjetivo debe marcar acusativo
                      masculino con -en.
                    </span>
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

            {/* Escenarios */}
            {!showDemo && (
              <div className="space-y-6">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="border border-border rounded-lg p-6 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {SCENARIO_TITLES[scenario.id]}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Tipo:{" "}
                          {scenario.type === "weak"
                            ? "Débil"
                            : scenario.type === "mixed"
                            ? "Mixta"
                            : "Fuerte"}
                        </p>
                      </div>
                      <div className="text-4xl">
                        {SCENARIO_EMOJIS[scenario.id]}
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded p-4">
                      <p className="text-lg font-mono">
                        {scenario.sentence.replace(
                          "_____",
                          `${scenario.adjective}___`
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <label
                        htmlFor={scenario.id}
                        className="text-sm font-medium"
                      >
                        Terminación del adjetivo &ldquo;{scenario.adjective}
                        &rdquo;:
                      </label>
                      {(() => {
                        const correct = !!userAnswers.find(
                          (a: { questionId: string; isCorrect: boolean }) =>
                            a.questionId === scenario.id && a.isCorrect
                        );
                        return (
                          <>
                            <Input
                              id={scenario.id}
                              type="text"
                              maxLength={3}
                              className="w-24"
                              value={answers[scenario.id] || ""}
                              onChange={(e) =>
                                setAnswers((prev) => ({
                                  ...prev,
                                  [scenario.id]: e.target.value,
                                }))
                              }
                              aria-label={`Terminación para: ${scenario.sentence}`}
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
                          </>
                        );
                      })()}
                    </div>

                    <div className="flex flex-col md:flex-row gap-2">
                      <Button
                        onClick={() => handleSubmit(scenario)}
                        disabled={
                          !answers[scenario.id] ||
                          !!userAnswers.find(
                            (a: { questionId: string; isCorrect: boolean }) =>
                              a.questionId === scenario.id && a.isCorrect
                          )
                        }
                        className="w-full md:w-auto"
                      >
                        🪄 Verificar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleHint(scenario)}
                        className="w-full md:w-auto"
                      >
                        💡 Pista
                      </Button>
                      <Button
                        variant="secondary"
                        aria-label={`Rellenar terminación correcta para: ${scenario.sentence}`}
                        onClick={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [scenario.id]: getAdjectiveEnding(scenario.context),
                          }))
                        }
                        className="w-full md:w-auto"
                      >
                        🪄 Rellenar
                      </Button>
                      {attempts[scenario.id] > 0 &&
                        !userAnswers.find(
                          (a: { questionId: string; isCorrect: boolean }) =>
                            a.questionId === scenario.id && a.isCorrect
                        ) && (
                          <Button
                            variant="secondary"
                            onClick={() => {
                              // Intento extra con variante léxica
                              showExtraAttempt();
                            }}
                            className="w-full md:w-auto"
                          >
                            🪄 Intento extra
                          </Button>
                        )}
                    </div>

                    {attempts[scenario.id] > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Intentos: {attempts[scenario.id]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Botón de reset */}
            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setAnswers({});
                  setAttempts({});
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
                  Has dominado el acusativo masculino en sus tres formas.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
