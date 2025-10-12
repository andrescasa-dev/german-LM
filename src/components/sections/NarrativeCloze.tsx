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
import {
  showParagraphCorrect,
  showParagraphWithErrors,
  showParagraphHints,
} from "@/lib/toast-service";

interface ClozeItem {
  id: string;
  adjective: string;
  context: AdjectiveContext;
}

interface Paragraph {
  id: string;
  title: string;
  text: string;
  clozes: ClozeItem[];
  emoji: string;
}

const NARRATIVE: Paragraph[] = [
  {
    id: "para-1",
    title: "Llegada a la cabaña",
    emoji: "🏔️",
    text: "Der Entdecker erreicht eine {alte} Hütte. In der {dunklen} Nacht sieht er ein {schwaches} Licht.",
    clozes: [
      {
        id: "cloze-1",
        adjective: "alt",
        context: {
          determiner: {
            word: "eine",
            type: "indefinite",
            case: "akkusativ",
            gender: "feminin",
            number: "singular",
          },
          case: "akkusativ",
          gender: "feminin",
          number: "singular",
        },
      },
      {
        id: "cloze-2",
        adjective: "dunkel",
        context: {
          determiner: {
            word: "der",
            type: "definite",
            case: "dativ",
            gender: "feminin",
            number: "singular",
          },
          case: "dativ",
          gender: "feminin",
          number: "singular",
        },
      },
      {
        id: "cloze-3",
        adjective: "schwach",
        context: {
          determiner: {
            word: "ein",
            type: "indefinite",
            case: "akkusativ",
            gender: "neutrum",
            number: "singular",
          },
          case: "akkusativ",
          gender: "neutrum",
          number: "singular",
        },
      },
    ],
  },
  {
    id: "para-2",
    title: "Interior de la cabaña",
    emoji: "🪵",
    text: "Er findet {warme} Decken und {frisches} Brot. Auf dem {kleinen} Tisch liegt ein {alter} Brief.",
    clozes: [
      {
        id: "cloze-4",
        adjective: "warm",
        context: {
          determiner: null,
          case: "akkusativ",
          gender: "feminin",
          number: "plural",
        },
      },
      {
        id: "cloze-5",
        adjective: "frisch",
        context: {
          determiner: null,
          case: "akkusativ",
          gender: "neutrum",
          number: "singular",
        },
      },
      {
        id: "cloze-6",
        adjective: "klein",
        context: {
          determiner: {
            word: "dem",
            type: "definite",
            case: "dativ",
            gender: "maskulin",
            number: "singular",
          },
          case: "dativ",
          gender: "maskulin",
          number: "singular",
        },
      },
      {
        id: "cloze-7",
        adjective: "alt",
        context: {
          determiner: {
            word: "ein",
            type: "indefinite",
            case: "nominativ",
            gender: "maskulin",
            number: "singular",
          },
          case: "nominativ",
          gender: "maskulin",
          number: "singular",
        },
      },
    ],
  },
  {
    id: "para-3",
    title: "Suministros",
    emoji: "🎒",
    text: "Der Brief erwähnt {wichtige} Vorräte: {gutes} Wasser, {trockenes} Holz und einen {warmen} Schlafsack.",
    clozes: [
      {
        id: "cloze-8",
        adjective: "wichtig",
        context: {
          determiner: null,
          case: "akkusativ",
          gender: "maskulin",
          number: "plural",
        },
      },
      {
        id: "cloze-9",
        adjective: "gut",
        context: {
          determiner: null,
          case: "akkusativ",
          gender: "neutrum",
          number: "singular",
        },
      },
      {
        id: "cloze-10",
        adjective: "trocken",
        context: {
          determiner: null,
          case: "akkusativ",
          gender: "neutrum",
          number: "singular",
        },
      },
      {
        id: "cloze-11",
        adjective: "warm",
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
    ],
  },
];

const TOTAL_CLOZES = NARRATIVE.reduce(
  (sum, para) => sum + para.clozes.length,
  0
);

export function NarrativeCloze() {
  const {
    progress,
    answers: userAnswers,
    recordAnswer,
    recordHintUsed,
    resetSection,
  } = useSectionState("narrative-cloze", TOTAL_CLOZES);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [verifiedParagraphs, setVerifiedParagraphs] = useState<Set<string>>(
    new Set()
  );

  const handleKeyDownInput = (
    e: React.KeyboardEvent<HTMLInputElement>,
    paragraph: Paragraph
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!paragraph.clozes.some((c) => !answers[c.id])) return;
      // If not all filled, move focus to next empty input
      const next = paragraph.clozes.find((c) => !(answers[c.id] || "").trim());
      const el = document.querySelector<HTMLInputElement>(
        `input[data-cloze="${next?.id}"]`
      );
      el?.focus();
    }
  };

  const handleVerifyParagraph = (paragraph: Paragraph) => {
    let correctCount = 0;
    const results: string[] = [];

    paragraph.clozes.forEach((cloze) => {
      const answer = answers[cloze.id] || "";
      const result = validateAdjectiveEnding(answer, cloze.context);

      recordAnswer(cloze.id, answer, result.isCorrect, 0);

      if (result.isCorrect) {
        correctCount++;
      } else {
        results.push(
          `❌ <strong>${cloze.adjective}</strong>: ${result.explanation}`
        );
      }
    });

    const allCorrect = correctCount === paragraph.clozes.length;
    if (allCorrect) {
      setVerifiedParagraphs((prev) => new Set([...prev, paragraph.id]));
      showParagraphCorrect(
        paragraph.title,
        correctCount,
        paragraph.clozes.length
      );
    } else {
      showParagraphWithErrors(paragraph.title, results);
    }
  };

  const handleHintForParagraph = (paragraph: Paragraph) => {
    const hints = paragraph.clozes.map((cloze) => {
      const hint = generateHint(cloze.context);
      return `💡 <strong>${cloze.adjective}</strong>: ${hint}`;
    });

    recordHintUsed();
    showParagraphHints(paragraph.title, hints);
  };

  const handleFillParagraph = (paragraph: Paragraph) => {
    setAnswers((prev) => {
      const next = { ...prev };
      paragraph.clozes.forEach((cloze) => {
        const ending = getAdjectiveEnding(cloze.context);
        next[cloze.id] = ending;
      });
      return next;
    });
  };

  const renderParagraphText = (paragraph: Paragraph) => {
    const nodes: React.ReactNode[] = [];
    const regex = /\{([^}]+)\}/g;
    let lastIndex = 0;
    let clozeIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(paragraph.text)) !== null) {
      if (match.index > lastIndex) {
        nodes.push(
          <span key={`t-${paragraph.id}-${lastIndex}`}>
            {paragraph.text.slice(lastIndex, match.index)}
          </span>
        );
      }

      const cloze = paragraph.clozes[clozeIndex];
      const clozeId = cloze?.id ?? `${paragraph.id}-auto-${clozeIndex}`;
      nodes.push(
        <span
          key={`c-${paragraph.id}-${clozeId}`}
          className="inline-flex items-center mx-1"
        >
          <span className="font-mono text-sm mr-1">{cloze?.adjective}</span>
          {(() => {
            const correct = !!userAnswers.find(
              (a) => a.questionId === clozeId && a.isCorrect
            );
            return (
              <>
                <Input
                  type="text"
                  maxLength={3}
                  className="w-16 h-8 inline-flex"
                  value={answers[clozeId] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [clozeId]: e.target.value,
                    }))
                  }
                  disabled={verifiedParagraphs.has(paragraph.id) || correct}
                  aria-label={`Terminación para ${cloze?.adjective}`}
                  data-cloze={clozeId}
                  onKeyDown={(e) => handleKeyDownInput(e, paragraph)}
                />
                {correct && (
                  <span
                    className="text-green-600 dark:text-green-400 font-semibold ml-1"
                    aria-label="Respuesta correcta"
                  >
                    ✓
                  </span>
                )}
              </>
            );
          })()}
        </span>
      );

      clozeIndex++;
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < paragraph.text.length) {
      nodes.push(
        <span key={`t-${paragraph.id}-end`}>
          {paragraph.text.slice(lastIndex)}
        </span>
      );
    }

    return nodes;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔮 III. Relato Contextualizado</CardTitle>
        <CardDescription>
          Aplicar débil/mixta/fuerte en contexto narrativo con mezcla de casos
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
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">
            📖 Diario del Explorador
          </h3>
          <p className="text-sm text-muted-foreground">
            Completa las terminaciones de los adjetivos en este relato. Presta
            atención a las preposiciones y artículos que indican el caso.
          </p>
        </div>

        {NARRATIVE.map((paragraph) => (
          <div
            key={paragraph.id}
            className="border border-border rounded-lg p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{paragraph.emoji}</span>
              <h3 className="font-semibold text-lg">{paragraph.title}</h3>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 leading-relaxed">
              <p className="text-base">{renderParagraphText(paragraph)}</p>
            </div>

            {!verifiedParagraphs.has(paragraph.id) && (
              <div className="flex flex-col md:flex-row gap-2">
                <Button
                  onClick={() => handleVerifyParagraph(paragraph)}
                  disabled={paragraph.clozes.some((c) => !answers[c.id])}
                  className="w-full md:w-auto"
                >
                  🪄 Verificar párrafo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleHintForParagraph(paragraph)}
                  className="w-full md:w-auto"
                >
                  💡 Pistas
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleFillParagraph(paragraph)}
                  aria-label={`Rellenar todas las terminaciones del párrafo ${paragraph.title}`}
                  className="w-full md:w-auto"
                >
                  🪄 Rellenar
                </Button>
              </div>
            )}

            {verifiedParagraphs.has(paragraph.id) && (
              <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                <span>✓</span>
                <span>Párrafo verificado</span>
              </div>
            )}
          </div>
        ))}

        {/* Producción opcional */}
        {verifiedParagraphs.size === NARRATIVE.length && (
          <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3 text-purple-900 dark:text-purple-100">
              ✍️ Producción opcional
            </h3>
            <p className="text-sm mb-4">
              Reescribe estas oraciones cambiando el artículo para forzar una
              regla distinta:
            </p>
            <div className="space-y-3 text-sm">
              <p>
                1. &ldquo;Der Entdecker sieht <strong>einen alten</strong>{" "}
                Brief&rdquo;
                <br />
                <span className="text-muted-foreground">
                  → Reescribe sin artículo (declinación fuerte)
                </span>
              </p>
              <p>
                2. &ldquo;Er findet <strong>warme</strong> Decken&rdquo;
                <br />
                <span className="text-muted-foreground">
                  → Reescribe con artículo definido (declinación débil)
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Botón de reset */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              setAnswers({});
              setVerifiedParagraphs(new Set());
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
              Has aplicado las reglas en contexto narrativo con éxito.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
