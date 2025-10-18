/**
 * Hook funcional reutilizable para gestión de ejercicios de talleres
 * Principios: DRY, Single Responsibility, Composición funcional
 */

import { useState, useEffect, useCallback } from "react";
import { useSectionState } from "@/hooks/useSectionState";
import { useVariant } from "@/hooks/useVariant";
import type { BaseContext } from "@/types/workshop-base";

// Tipos funcionales puros
type LoaderFn<T> = (workshopId: string, variant: number) => Promise<T[]>;
type ValidatorFn<TContext> = (
  answer: string,
  context: TContext
) => {
  isCorrect: boolean;
  explanation: string;
  example?: string;
  markerInfo?: string;
};
type HintFn<TContext> = (context: TContext) => string;
type AnswerFn<TContext> = (context: TContext) => string;
type FeedbackFn = (result: {
  isCorrect: boolean;
  explanation: string;
  example?: string;
  markerInfo?: string;
}) => void;

interface UseWorkshopExercisesConfig<T, TContext> {
  workshopId: string;
  sectionId: string;
  loader: LoaderFn<T>;
  validator: ValidatorFn<TContext>;
  hintGenerator: HintFn<TContext>;
  answerGetter: AnswerFn<TContext>;
  feedbackHandler: FeedbackFn;
  contextExtractor: (exercise: T) => TContext;
}

/**
 * Hook funcional que encapsula toda la lógica de ejercicios
 * Siguiendo el principio de composición funcional
 */
export function useWorkshopExercises<
  T extends { id: string },
  TContext extends BaseContext
>({
  workshopId,
  sectionId,
  loader,
  validator,
  hintGenerator,
  answerGetter,
  feedbackHandler,
  contextExtractor,
}: UseWorkshopExercisesConfig<T, TContext>) {
  const { currentVariant } = useVariant();
  const [exercises, setExercises] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});

  const { progress, recordAnswer, recordHintUsed, resetSection } =
    useSectionState(sectionId, exercises.length);

  // Función pura para cargar ejercicios con manejo de errores
  const loadExercises = useCallback(
    async (variant: number) => {
      setLoading(true);
      try {
        const data = await loader(workshopId, variant);
        setExercises(data);
      } catch (error) {
        console.error(`Failed to load ${workshopId} exercises:`, error);
        // Fallback funcional: intenta variante 1
        try {
          const fallbackData = await loader(workshopId, 1);
          setExercises(fallbackData);
        } catch {
          setExercises([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [workshopId, loader]
  );

  // Efecto de carga con cleanup funcional
  useEffect(() => {
    loadExercises(currentVariant);
  }, [currentVariant, loadExercises]);

  // Función pura para reset de estado
  const resetState = useCallback(() => {
    setAnswers({});
    setAttempts({});
    resetSection();
  }, [resetSection]);

  // Listener funcional para eventos de reset
  useEffect(() => {
    window.addEventListener("resetAllSections", resetState);
    return () => window.removeEventListener("resetAllSections", resetState);
  }, [resetState]);

  // Handler funcional puro para submit
  const handleSubmit = useCallback(
    (exercise: T) => {
      const answer = answers[exercise.id] || "";
      const context = contextExtractor(exercise);
      const result = validator(answer, context);
      const currentAttempts = attempts[exercise.id] || 0;

      // Inmutabilidad: crear nuevos objetos en lugar de mutar
      recordAnswer(exercise.id, answer, result.isCorrect, 0);
      setAttempts((prev) => ({ ...prev, [exercise.id]: currentAttempts + 1 }));

      feedbackHandler(result);

      return result;
    },
    [
      answers,
      attempts,
      validator,
      contextExtractor,
      recordAnswer,
      feedbackHandler,
    ]
  );

  // Handler funcional puro para hints
  const handleHint = useCallback(
    (exercise: T) => {
      const context = contextExtractor(exercise);
      const hint = hintGenerator(context);
      recordHintUsed();
      return hint;
    },
    [hintGenerator, contextExtractor, recordHintUsed]
  );

  // Handler funcional puro para auto-fill
  const handleFill = useCallback(
    (exercise: T) => {
      const context = contextExtractor(exercise);
      const correctAnswer = answerGetter(context);
      // Inmutabilidad: crear nuevo objeto
      setAnswers((prev) => ({ ...prev, [exercise.id]: correctAnswer }));
      return correctAnswer;
    },
    [answerGetter, contextExtractor]
  );

  // Función pura para actualizar respuesta
  const updateAnswer = useCallback((exerciseId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [exerciseId]: answer }));
  }, []);

  // Composición funcional: retornar API pura
  return {
    // Estado
    exercises,
    loading,
    answers,
    attempts,
    progress,

    // Acciones funcionales puras
    handleSubmit,
    handleHint,
    handleFill,
    updateAnswer,
    resetState,
  } as const;
}
