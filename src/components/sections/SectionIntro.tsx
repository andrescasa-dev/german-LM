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
    sentence: "Ich habe _____ alten Freund.",
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
    sentence: "_____ kaltes Wasser schmeckt gut.",
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
  const { progress, recordAnswer, recordHintUsed, resetSection } =
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

    toast.success(
      `Micro-sondeo completado: ${correct}/${SURVEY_QUESTIONS.length} correctas (${percentage}%)`,
      {
        description: "Ahora revisemos las reglas y practiquemos.",
      }
    );
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
      toast.success("¡Correcto! ✓", {
        description: result.explanation,
      });
    } else {
      toast.error("Incorrecto", {
        description: `${result.explanation}\nEjemplo: ${result.example}`,
      });
    }
  };

  const handleShowHint = (question: Question) => {
    const hint = generateHint(question.context);
    setShowHint(question.id);
    recordHintUsed();
    toast.info(hint);
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
            Progreso: {progress.correctAnswers}/{progress.totalQuestions}
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

        {/* Micro-sondeo */}
        {!surveyCompleted && (
          <div>
            <h3 className="font-semibold text-lg mb-4">Micro-sondeo inicial</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Completa las terminaciones de los adjetivos:
            </p>
            <div className="space-y-4">
              {SURVEY_QUESTIONS.map((q) => (
                <div key={q.id} className="flex items-center gap-3">
                  <label htmlFor={q.id} className="flex-1">
                    {q.sentence.replace("_____", `${q.adjective}___`)}
                  </label>
                  <Input
                    id={q.id}
                    type="text"
                    maxLength={3}
                    className="w-20"
                    value={surveyAnswers[q.id] || ""}
                    onChange={(e) =>
                      setSurveyAnswers((prev) => ({
                        ...prev,
                        [q.id]: e.target.value,
                      }))
                    }
                    aria-label={`Terminación para: ${q.sentence}`}
                  />
                </div>
              ))}
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
              {PRACTICE_QUESTIONS.map((q) => (
                <div key={q.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <label htmlFor={`practice-${q.id}`} className="flex-1">
                      {q.sentence.replace("_____", `${q.adjective}___`)}
                    </label>
                    <Input
                      id={`practice-${q.id}`}
                      type="text"
                      maxLength={3}
                      className="w-20"
                      value={practiceAnswers[q.id] || ""}
                      onChange={(e) =>
                        setPracticeAnswers((prev) => ({
                          ...prev,
                          [q.id]: e.target.value,
                        }))
                      }
                      aria-label={`Terminación para: ${q.sentence}`}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-2">
                    <Button
                      size="sm"
                      onClick={() => handlePracticeSubmit(q)}
                      disabled={!practiceAnswers[q.id]}
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
              ))}
            </div>
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
              ¡Sección completada con {progress.score}%!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
