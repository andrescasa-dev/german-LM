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
import {
  validateAdjectiveEnding,
  generateHint,
  getAdjectiveEnding,
} from "@/lib/adjective-rules";
import type { AdjectiveContext } from "@/types/adjective";
import {
  showSurveyCompleted,
  showCorrectAnswer,
  showIncorrectAnswer,
  showHintToast,
} from "@/lib/toast-service";

interface Question {
  id: string;
  sentence: string;
  adjective: string;
  context: AdjectiveContext;
}

const SURVEY_QUESTIONS: Question[] = [
  {
    id: "survey-1",
    sentence: "Ich sehe _____ neuen Wagen.",
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
  },
  {
    id: "survey-2",
    sentence: "Das ist _____ neues Auto.",
    adjective: "neu",
    context: {
      determiner: {
        word: "ein",
        type: "indefinite",
        case: "nominativ",
        gender: "neutrum",
        number: "singular",
      },
      case: "nominativ",
      gender: "neutrum",
      number: "singular",
    },
  },
];

const PRACTICE_QUESTIONS: Question[] = [
  {
    id: "practice-1",
    sentence: "Der _____ Mann kommt.",
    adjective: "alt",
    context: {
      determiner: {
        word: "der",
        type: "definite",
        case: "nominativ",
        gender: "maskulin",
        number: "singular",
      },
      case: "nominativ",
      gender: "maskulin",
      number: "singular",
    },
  },
  {
    id: "practice-2",
    sentence: "Ich habe _____ Freund.",
    adjective: "alt",
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
  },
  {
    id: "practice-3",
    sentence: "_____ Wasser schmeckt gut.",
    adjective: "kalt",
    context: {
      determiner: null,
      case: "nominativ",
      gender: "neutrum",
      number: "singular",
    },
  },
  {
    id: "practice-4",
    sentence: "Die _____ Kinder spielen.",
    adjective: "klein",
    context: {
      determiner: {
        word: "die",
        type: "definite",
        case: "nominativ",
        gender: "maskulin",
        number: "plural",
      },
      case: "nominativ",
      gender: "maskulin",
      number: "plural",
    },
  },
];

export function SectionIntro() {
  const { progress, answers, recordAnswer, recordHintUsed, resetSection } =
    useSectionState(
      "section-intro",
      SURVEY_QUESTIONS.length + PRACTICE_QUESTIONS.length
    );

  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string>>(
    {}
  );
  const [practiceAnswers, setPracticeAnswers] = useState<
    Record<string, string>
  >({});
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [showHint, setShowHint] = useState<string | null>(null);

  // Listen for section reset events
  useEffect(() => {
    const handleReset = () => {
      setSurveyAnswers({});
      setPracticeAnswers({});
      setSurveyCompleted(false);
      setShowHint(null);
      resetSection();
    };

    window.addEventListener("resetAllSections", handleReset);
    return () => window.removeEventListener("resetAllSections", handleReset);
  }, [resetSection]);

  const handleSurveySubmit = () => {
    let correct = 0;
    SURVEY_QUESTIONS.forEach((q) => {
      const answer = surveyAnswers[q.id] || "";
      const result = validateAdjectiveEnding(answer, q.context);
      if (result.isCorrect) correct++;
      recordAnswer(q.id, answer, result.isCorrect, 0);
    });

    setSurveyCompleted(true);
    const percentage = Math.round((correct / SURVEY_QUESTIONS.length) * 100);

    showSurveyCompleted(correct, SURVEY_QUESTIONS.length, percentage);
  };

  const handlePracticeSubmit = (question: Question) => {
    const answer = practiceAnswers[question.id] || "";
    const result = validateAdjectiveEnding(answer, question.context);

    recordAnswer(
      question.id,
      answer,
      result.isCorrect,
      showHint === question.id ? 1 : 0
    );

    if (result.isCorrect) {
      showCorrectAnswer(result.explanation);
    } else {
      showIncorrectAnswer(result.explanation, result.example);
    }
  };

  const handleShowHint = (question: Question) => {
    const hint = generateHint(question.context);
    setShowHint(question.id);
    recordHintUsed();
    showHintToast(hint);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔮 I. Repaso de los Tipos de Declinación</CardTitle>
        <CardDescription>
          En síntesis: calentamiento + mini‑clase guiada + práctica corta para
          asegurar que identificas el marcador (der/ein/—) y aplicas la
          terminación correcta antes del ejercicio central. Cómo interactuar:
          escribe la terminación del adjetivo en los campos y verifica cada
          ítem; puedes pedir una pista. Criterio de aprobación: al menos 2 de 3
          correctas en el micro‑sondeo y práctica completada.
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
        {/* Tabla de reglas */}
        <div>
          <h3 className="font-semibold text-lg mb-4">
            ¿Quién lleva la marca fuerte?
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-left">Tipo</th>
                  <th className="border border-border p-3 text-left">
                    Determinante
                  </th>
                  <th className="border border-border p-3 text-left">
                    Quién marca
                  </th>
                  <th className="border border-border p-3 text-left">
                    Ejemplo
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3 font-medium">
                    Débil
                  </td>
                  <td className="border border-border p-3">der, die, das</td>
                  <td className="border border-border p-3">
                    El artículo definido
                  </td>
                  <td className="border border-border p-3 font-mono">
                    der neu<strong>e</strong> Wagen
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">
                    Mixta
                  </td>
                  <td className="border border-border p-3">
                    ein, kein, mein...
                  </td>
                  <td className="border border-border p-3">
                    Compartida (depende del caso)
                  </td>
                  <td className="border border-border p-3 font-mono">
                    ein neu<strong>er</strong> Wagen
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">
                    Fuerte
                  </td>
                  <td className="border border-border p-3">(sin artículo)</td>
                  <td className="border border-border p-3">
                    El adjetivo marca todo
                  </td>
                  <td className="border border-border p-3 font-mono">
                    neu<strong>er</strong> Wagen
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Ejemplo ilustrativo (no puntúa) */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Ejemplo</h4>
          <p className="text-sm text-muted-foreground mb-2">
            Observa cómo se completa la terminación directamente en la oración:
          </p>
          <p className="text-base leading-relaxed">
            {"Der "}
            <span className="inline-flex items-baseline gap-2 align-baseline">
              <span className="font-mono">alt</span>
              <Input
                type="text"
                maxLength={3}
                disabled
                value="e"
                className="inline-block align-baseline w-16 min-w-[6rem] shrink-0"
                aria-label="Ejemplo de terminación para alt"
              />
            </span>
            {" Mann kommt."}
          </p>
        </div>

        {/* Micro-sondeo */}
        {!surveyCompleted && (
          <div>
            <h3 className="font-semibold text-lg mb-4">Micro-sondeo inicial</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Completa las terminaciones de los adjetivos:
            </p>
            <div className="space-y-4">
              {SURVEY_QUESTIONS.map((q) => {
                const parts = q.sentence.split("_____");
                const before = parts[0] ?? "";
                const after = parts[1] ?? "";
                const correct = !!answers.find(
                  (a) => a.questionId === q.id && a.isCorrect
                );
                return (
                  <div key={q.id} className="text-base leading-relaxed">
                    <label htmlFor={q.id} className="sr-only">
                      Terminación para: {q.sentence}
                    </label>
                    <p>
                      {before}
                      <span className="inline-flex items-baseline gap-2 align-baseline">
                        <span className="font-mono">{q.adjective}</span>
                        <Input
                          id={q.id}
                          type="text"
                          maxLength={3}
                          className="inline-block align-baseline w-28 md:w-32 min-w-[8rem] shrink-0"
                          value={surveyAnswers[q.id] || ""}
                          onChange={(e) =>
                            setSurveyAnswers((prev) => ({
                              ...prev,
                              [q.id]: e.target.value,
                            }))
                          }
                          aria-label={`Terminación para: ${q.sentence}`}
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
                      </span>
                      {after}
                    </p>
                  </div>
                );
              })}
            </div>
            <Button onClick={handleSurveySubmit} className="mt-4">
              🪄 Enviar micro-sondeo
            </Button>
          </div>
        )}

        {/* Práctica controlada */}
        {surveyCompleted && (
          <div>
            <h3 className="font-semibold text-lg mb-4">Práctica controlada</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Identifica el marcador y selecciona la terminación correcta:
            </p>
            <div className="space-y-6">
              {PRACTICE_QUESTIONS.map((q) => {
                const parts = q.sentence.split("_____");
                const before = parts[0] ?? "";
                const after = parts[1] ?? "";
                const correct = !!answers.find(
                  (a) => a.questionId === q.id && a.isCorrect
                );
                return (
                  <div
                    key={q.id}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="mb-3 text-base leading-relaxed">
                      <label htmlFor={`practice-${q.id}`} className="sr-only">
                        Terminación para: {q.sentence}
                      </label>
                      <p>
                        {before}
                        <span className="inline-flex items-baseline gap-2 align-baseline">
                          <span className="font-mono">{q.adjective}</span>
                          <Input
                            id={`practice-${q.id}`}
                            type="text"
                            maxLength={3}
                            className="inline-block align-baseline w-28 md:w-32 min-w-[8rem] shrink-0"
                            value={practiceAnswers[q.id] || ""}
                            onChange={(e) =>
                              setPracticeAnswers((prev) => ({
                                ...prev,
                                [q.id]: e.target.value,
                              }))
                            }
                            aria-label={`Terminación para: ${q.sentence}`}
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
                        </span>
                        {after}
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                      <Button
                        size="sm"
                        onClick={() => handlePracticeSubmit(q)}
                        disabled={!practiceAnswers[q.id] || correct}
                        className="w-full md:w-auto"
                      >
                        🪄 Verificar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShowHint(q)}
                        className="w-full md:w-auto"
                      >
                        💡 Pista
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        aria-label={`Rellenar terminación correcta para: ${q.sentence}`}
                        onClick={() =>
                          setPracticeAnswers((prev) => ({
                            ...prev,
                            [q.id]: getAdjectiveEnding(q.context),
                          }))
                        }
                        className="w-full md:w-auto"
                      >
                        Rellenar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Botón de reset */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              setSurveyAnswers({});
              setPracticeAnswers({});
              setSurveyCompleted(false);
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
