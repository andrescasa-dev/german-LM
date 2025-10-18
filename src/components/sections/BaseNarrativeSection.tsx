"use client";

import { useState, useEffect, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSectionState } from "@/hooks/useSectionState";
import { useVariant } from "@/hooks/useVariant";
import type {
  BaseParagraph,
  BaseSectionProps,
  BaseContext,
} from "@/types/workshop-base";

interface BaseNarrativeSectionProps<T extends BaseParagraph>
  extends BaseSectionProps {
  loadParagraphs: (variant: number) => Promise<T[]>;
  renderParagraph: (paragraph: T, handlers: ParagraphHandlers<T>) => ReactNode;
  validateFn: (answer: string, context: BaseContext) => unknown;
  getHintFn: (context: BaseContext) => string;
  getAnswerFn: (context: BaseContext) => string;
}

interface ParagraphHandlers<T extends BaseParagraph> {
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  verifiedParagraphs: Set<string>;
  handleVerifyParagraph: (paragraph: T) => void;
  handleHintParagraph: (paragraph: T) => void;
  handleKeyDownInput: (
    event: React.KeyboardEvent<HTMLInputElement>,
    onSubmit: () => void
  ) => void;
  validateFn: (answer: string, context: BaseContext) => unknown;
  getHintFn: (context: BaseContext) => string;
  getAnswerFn: (context: BaseContext) => string;
}

/**
 * Componente base reutilizable para secciones narrativas
 * Encapsula la lógica común: carga de párrafos, estado de respuestas, verificación
 */
export function BaseNarrativeSection<T extends BaseParagraph>({
  sectionId,
  title,
  description,
  icon,
  workshopId,
  loadParagraphs,
  renderParagraph,
  validateFn,
  getHintFn,
  getAnswerFn,
}: BaseNarrativeSectionProps<T>) {
  const { currentVariant } = useVariant();
  const [paragraphs, setParagraphs] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar párrafos basado en la variante actual
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await loadParagraphs(currentVariant);
        setParagraphs(data);
      } catch (error) {
        console.error(`Failed to load ${workshopId} paragraphs:`, error);
        // Fallback a variante 1
        const data = await loadParagraphs(1);
        setParagraphs(data);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentVariant, loadParagraphs, workshopId]);

  const totalClozes = paragraphs.reduce(
    (sum, para) => sum + para.clozes.length,
    0
  );

  const { progress, recordAnswer, recordHintUsed, resetSection } =
    useSectionState(sectionId, totalClozes);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [verifiedParagraphs, setVerifiedParagraphs] = useState<Set<string>>(
    new Set()
  );

  // Escuchar eventos de reset
  useEffect(() => {
    const handleReset = () => {
      setAnswers({});
      setVerifiedParagraphs(new Set());
      resetSection();
    };

    window.addEventListener("resetAllSections", handleReset);
    return () => window.removeEventListener("resetAllSections", handleReset);
  }, [resetSection]);

  const handleKeyDownInput = (
    event: React.KeyboardEvent<HTMLInputElement>,
    onSubmit: () => void
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  };

  const handleVerifyParagraph = (paragraph: T) => {
    paragraph.clozes.forEach((cloze) => {
      const answer = answers[cloze.id] || "";
      const result = validateFn(answer, cloze.context);
      recordAnswer(
        cloze.id,
        answer,
        (result as { isCorrect: boolean }).isCorrect,
        0
      );
    });

    setVerifiedParagraphs((prev) => new Set([...prev, paragraph.id]));
  };

  const handleHintParagraph = (paragraph: T) => {
    paragraph.clozes.forEach((cloze) => {
      const hint = getHintFn(cloze.context);
      recordHintUsed();
      // Aquí podrías mostrar el hint en un toast o modal
      console.log(`Hint for ${cloze.id}: ${hint}`);
    });
  };

  const paragraphHandlers = {
    answers,
    setAnswers,
    verifiedParagraphs,
    handleVerifyParagraph,
    handleHintParagraph,
    handleKeyDownInput,
    validateFn,
    getHintFn,
    getAnswerFn,
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {icon} {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Cargando variante...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {icon} {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <Progress value={progress.score} className="mt-4" />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>
            Respuestas: {progress.correctAnswers}/{progress.totalQuestions}
          </span>
          <span>Pistas usadas: {progress.hintsUsed}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {paragraphs.map((paragraph) => (
          <div key={paragraph.id} className="space-y-4">
            {renderParagraph(paragraph, paragraphHandlers)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
