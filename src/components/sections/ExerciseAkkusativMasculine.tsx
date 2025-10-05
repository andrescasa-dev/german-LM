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
  validateAdjectiveEnding,
  generateHint,
  getAdjectiveEnding,
} from "@/lib/adjective-rules";
import type { AdjectiveContext } from "@/types/adjective";
import { toast } from "sonner";

interface Scenario {
  id: string;
  type: "weak" | "mixed" | "strong";
  title: string;
  sentence: string;
  adjective: string;
  context: AdjectiveContext;
  imageAlt: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "akk-weak",
    type: "weak",
    title: "Escenario 1: Declinación débil",
    sentence: "Ich sehe den _____ Wagen.",
    adjective: "neu",
    context: {
      determiner: {
        word: "den",
        type: "definite",
        case: "akkusativ",
        gender: "maskulin",
        number: "singular",
      },
      case: "akkusativ",
      gender: "maskulin",
      number: "singular",
    },
    imageAlt: "Un coche nuevo con artículo definido",
  },
  {
    id: "akk-mixed",
    type: "mixed",
    title: "Escenario 2: Declinación mixta",
    sentence: "Ich sehe einen _____ Wagen.",
    adjective: "neu",
    context: {
      determiner: {
        word: "einen",
        type: "indefinite",
        case: "akkusativ",
        gender: "maskulin",
        number: "singular",
      },
      case: "akkusativ",
      gender: "maskulin",
      number: "singular",
    },
    imageAlt: "Un coche nuevo con artículo indefinido",
  },
  {
    id: "akk-strong",
    type: "strong",
    title: "Escenario 3: Declinación fuerte",
    sentence: "Ich sehe _____ Wagen.",
    adjective: "neu",
    context: {
      determiner: null,
      case: "akkusativ",
      gender: "maskulin",
      number: "singular",
    },
    imageAlt: "Un coche nuevo sin artículo",
  },
];

export function ExerciseAkkusativMasculine() {
  const {
    progress,
    answers: userAnswers,
    recordAnswer,
    recordHintUsed,
    resetSection,
  } = useSectionState("exercise-akkusativ", SCENARIOS.length);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showDemo, setShowDemo] = useState(true);
  const [attempts, setAttempts] = useState<Record<string, number>>({});

  const handleSubmit = (scenario: Scenario) => {
    const answer = answers[scenario.id] || "";
    const result = validateAdjectiveEnding(answer, scenario.context);
    const currentAttempts = attempts[scenario.id] || 0;

    recordAnswer(scenario.id, answer, result.isCorrect, 0);
    setAttempts((prev) => ({ ...prev, [scenario.id]: currentAttempts + 1 }));

    if (result.isCorrect) {
      toast.success("¡Correcto! ✓", {
        description: `${result.explanation}\n${result.markerInfo}`,
        duration: 5000,
      });
    } else {
      toast.error("Incorrecto", {
        description: `${result.explanation}\nEjemplo correcto: ${result.example}\n\n${result.markerInfo}`,
        duration: 7000,
      });
    }
  };

  const handleHint = (scenario: Scenario) => {
    const hint = generateHint(scenario.context);
    recordHintUsed();
    toast.info(hint, {
      duration: 6000,
    });
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
              📚 Demostración: ¿Por qué cambia la terminación?
            </h3>
            <div className="space-y-3 text-sm">
              <p>
                <strong>Con artículo definido (débil):</strong> &ldquo;den neu
                <strong>en</strong> Wagen&rdquo;
                <br />
                <span className="text-muted-foreground">
                  → El artículo &ldquo;den&rdquo; ya marca acusativo masculino,
                  el adjetivo usa -en.
                </span>
              </p>
              <p>
                <strong>Con artículo indefinido (mixta):</strong> &ldquo;einen
                neu<strong>en</strong> Wagen&rdquo;
                <br />
                <span className="text-muted-foreground">
                  → &ldquo;einen&rdquo; marca el acusativo, el adjetivo usa -en.
                </span>
              </p>
              <p>
                <strong>Sin artículo (fuerte):</strong> &ldquo;neu
                <strong>en</strong> Wagen&rdquo;
                <br />
                <span className="text-muted-foreground">
                  → Sin artículo, el adjetivo debe marcar acusativo masculino
                  con -en.
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
            {SCENARIOS.map((scenario, index) => (
              <div
                key={scenario.id}
                className="border border-border rounded-lg p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{scenario.title}</h3>
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
                    {index === 0 ? "🚗" : index === 1 ? "🚙" : "🚕"}
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
                  <label htmlFor={scenario.id} className="text-sm font-medium">
                    Terminación del adjetivo &ldquo;{scenario.adjective}&rdquo;:
                  </label>
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
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                  <Button
                    onClick={() => handleSubmit(scenario)}
                    disabled={!answers[scenario.id]}
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
                          toast.info("💪 Intento extra disponible", {
                            description:
                              "Piensa en la regla: ¿quién lleva la marca fuerte aquí?",
                          });
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
          <Button variant="outline" onClick={resetSection}>
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
      </CardContent>
    </Card>
  );
}
