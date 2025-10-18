"use client";

import { useState, useCallback } from "react";
import type {
  BaseExercise,
  BaseContext,
  ExerciseHandlers,
} from "@/types/workshop-base";
import { isEmptyAnswer } from "@/lib/exercise-utils";

interface UseExerciseValidationProps<T extends BaseExercise> {
  exercises: T[];
  validateFn: (answer: string, context: BaseContext) => unknown;
  getHintFn: (context: BaseContext) => string;
  getAnswerFn: (context: BaseContext) => string;
  recordAnswer: (
    questionId: string,
    answer: string,
    isCorrect: boolean,
    hintsUsed: number
  ) => void;
  recordHintUsed: () => void;
}

/**
 * Hook genérico que abstrae la lógica de validación común para ejercicios
 */
export function useExerciseValidation<T extends BaseExercise>({
  exercises,
  validateFn,
  getHintFn,
  getAnswerFn,
  recordAnswer,
  recordHintUsed,
}: UseExerciseValidationProps<T>) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});

  /**
   * Maneja el envío de una respuesta
   */
  const handleSubmit = useCallback(
    (exercise: T) => {
      const answer = answers[exercise.id] || "";
      const result = validateFn(answer, exercise.context);
      const currentAttempts = attempts[exercise.id] || 0;

      recordAnswer(
        exercise.id,
        answer,
        (result as { isCorrect: boolean }).isCorrect,
        0
      );
      setAttempts((prev) => ({ ...prev, [exercise.id]: currentAttempts + 1 }));

      return result;
    },
    [answers, attempts, validateFn, recordAnswer]
  );

  /**
   * Maneja la solicitud de una pista
   */
  const handleHint = useCallback(
    (exercise: T) => {
      const hint = getHintFn(exercise.context);
      recordHintUsed();
      return hint;
    },
    [getHintFn, recordHintUsed]
  );

  /**
   * Maneja el rellenado automático de la respuesta correcta
   */
  const handleFill = useCallback(
    (exercise: T) => {
      const correctAnswer = getAnswerFn(exercise.context);
      setAnswers((prev) => ({ ...prev, [exercise.id]: correctAnswer }));
    },
    [getAnswerFn]
  );

  /**
   * Actualiza la respuesta del usuario
   */
  const updateAnswer = useCallback((exerciseId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [exerciseId]: answer }));
  }, []);

  /**
   * Resetea todas las respuestas
   */
  const resetAnswers = useCallback(() => {
    setAnswers({});
    setAttempts({});
  }, []);

  /**
   * Obtiene los handlers para un ejercicio específico
   */
  const getExerciseHandlers = useCallback(
    (exercise: T): ExerciseHandlers => ({
      onSubmit: () => handleSubmit(exercise),
      onHint: () => handleHint(exercise),
      onFill: () => handleFill(exercise),
    }),
    [handleSubmit, handleHint, handleFill]
  );

  /**
   * Verifica si una respuesta está vacía
   */
  const isAnswerEmpty = useCallback(
    (exerciseId: string) => {
      const answer = answers[exerciseId] || "";
      return isEmptyAnswer(answer);
    },
    [answers]
  );

  /**
   * Obtiene estadísticas de progreso
   */
  const getProgressStats = useCallback(() => {
    const totalExercises = exercises.length;
    const answeredExercises = Object.keys(answers).length;
    const correctAnswers = exercises.filter((exercise) => {
      const answer = answers[exercise.id];
      if (!answer) return false;
      const result = validateFn(answer, exercise.context);
      return (result as { isCorrect: boolean }).isCorrect;
    }).length;

    return {
      totalExercises,
      answeredExercises,
      correctAnswers,
      completionRate:
        totalExercises > 0
          ? Math.round((answeredExercises / totalExercises) * 100)
          : 0,
      accuracy:
        answeredExercises > 0
          ? Math.round((correctAnswers / answeredExercises) * 100)
          : 0,
    };
  }, [exercises, answers, validateFn]);

  return {
    answers,
    attempts,
    handleSubmit,
    handleHint,
    handleFill,
    updateAnswer,
    resetAnswers,
    getExerciseHandlers,
    isAnswerEmpty,
    getProgressStats,
  };
}
