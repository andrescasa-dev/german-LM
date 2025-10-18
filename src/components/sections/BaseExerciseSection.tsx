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
  BaseExercise,
  BaseSectionProps,
  BaseContext,
} from "@/types/workshop-base";

interface BaseExerciseSectionProps<T extends BaseExercise>
  extends BaseSectionProps {
  loadExercises: (variant: number) => Promise<T[]>;
  renderExercise: (exercise: T, handlers: ExerciseHandlers<T>) => ReactNode;
  validateFn: (answer: string, context: BaseContext) => unknown;
  getHintFn: (context: BaseContext) => string;
  getAnswerFn: (context: BaseContext) => string;
  showDemo?: boolean;
  renderDemo?: () => ReactNode;
}

interface ExerciseHandlers<T extends BaseExercise> {
  onSubmit: (exercise: T) => unknown;
  onHint: (exercise: T) => string;
  onFill: (exercise: T) => void;
  userAnswer: string;
  setAnswer: (answer: string) => void;
}

/**
 * Componente base reutilizable para secciones de ejercicios
 * Encapsula la lógica común: carga de variantes, estado, progreso, etc.
 */
export function BaseExerciseSection<T extends BaseExercise>({
  sectionId,
  title,
  description,
  icon,
  workshopId,
  loadExercises,
  renderExercise,
  validateFn,
  getHintFn,
  getAnswerFn,
  showDemo = false,
  renderDemo,
}: BaseExerciseSectionProps<T>) {
  const { currentVariant } = useVariant();
  const [exercises, setExercises] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar ejercicios basado en la variante actual
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await loadExercises(currentVariant);
        setExercises(data);
      } catch (error) {
        console.error(`Failed to load ${workshopId} exercises:`, error);
        // Fallback a variante 1
        const data = await loadExercises(1);
        setExercises(data);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentVariant, loadExercises, workshopId]);

  const { progress, recordAnswer, recordHintUsed, resetSection } =
    useSectionState(sectionId, exercises.length);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showDemoSection, setShowDemoSection] = useState(showDemo);

  // Escuchar eventos de reset
  useEffect(() => {
    const handleReset = () => {
      setAnswers({});
      setShowDemoSection(showDemo);
      resetSection();
    };

    window.addEventListener("resetAllSections", handleReset);
    return () => window.removeEventListener("resetAllSections", handleReset);
  }, [resetSection, showDemo]);

  const handleSubmit = (exercise: T) => {
    const answer = answers[exercise.id] || "";
    const result = validateFn(answer, exercise.context);

    recordAnswer(
      exercise.id,
      answer,
      (result as { isCorrect: boolean }).isCorrect,
      0
    );

    return result;
  };

  const handleHint = (exercise: T) => {
    const hint = getHintFn(exercise.context);
    recordHintUsed();
    return hint;
  };

  const handleFill = (exercise: T) => {
    const correctAnswer = getAnswerFn(exercise.context);
    setAnswers((prev) => ({ ...prev, [exercise.id]: correctAnswer }));
  };

  const exerciseHandlers = {
    onSubmit: handleSubmit,
    onHint: handleHint,
    onFill: handleFill,
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
        {/* Sección de demostración */}
        {showDemoSection && renderDemo && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            {renderDemo()}
            <button
              onClick={() => setShowDemoSection(false)}
              className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ocultar demostración
            </button>
          </div>
        )}

        {/* Ejercicios */}
        <div className="space-y-6">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="border rounded-lg p-4">
              {renderExercise(exercise, {
                ...exerciseHandlers,
                userAnswer: answers[exercise.id] || "",
                setAnswer: (answer: string) =>
                  setAnswers((prev) => ({ ...prev, [exercise.id]: answer })),
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
