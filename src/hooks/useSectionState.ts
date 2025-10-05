"use client";

import { useState, useEffect, useCallback } from "react";
import type { SectionProgress, UserAnswer } from "@/types/adjective";

/**
 * Hook para gestionar el estado aislado de cada sección con persistencia opcional
 */
export function useSectionState(sectionId: string, totalQuestions: number) {
  const storageKey = `german-lm-section-${sectionId}`;

  // Estado de la sección
  const [progress, setProgress] = useState<SectionProgress>(() => {
    // Intentar cargar desde sessionStorage
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return {
            ...parsed,
            lastUpdated: new Date(parsed.lastUpdated),
          };
        } catch {
          // Si falla el parsing, usar valores por defecto
        }
      }
    }

    return {
      sectionId,
      attempts: 0,
      correctAnswers: 0,
      totalQuestions,
      hintsUsed: 0,
      completed: false,
      score: 0,
      lastUpdated: new Date(),
    };
  });

  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<string>("");

  // Persistir en sessionStorage cuando cambia el progreso
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(storageKey, JSON.stringify(progress));
    }
  }, [progress, storageKey]);

  // Registrar una respuesta
  const recordAnswer = useCallback(
    (
      questionId: string,
      answer: string,
      isCorrect: boolean,
      hintsUsed: number
    ) => {
      const newAnswer: UserAnswer = {
        questionId,
        answer,
        isCorrect,
        attempts: 1,
        hintsUsed,
        timestamp: new Date(),
      };

      setAnswers((prev) => {
        const existing = prev.find((a) => a.questionId === questionId);
        if (existing) {
          // Actualizar respuesta existente
          return prev.map((a) =>
            a.questionId === questionId
              ? { ...newAnswer, attempts: a.attempts + 1 }
              : a
          );
        }
        return [...prev, newAnswer];
      });

      setProgress((prev) => {
        const newCorrectAnswers = isCorrect
          ? prev.correctAnswers + 1
          : prev.correctAnswers;
        const newScore = Math.round((newCorrectAnswers / totalQuestions) * 100);
        const newCompleted = newScore >= 80;

        return {
          ...prev,
          attempts: prev.attempts + 1,
          correctAnswers: newCorrectAnswers,
          completed: newCompleted,
          score: newScore,
          lastUpdated: new Date(),
        };
      });
    },
    [totalQuestions]
  );

  // Registrar uso de una pista
  const recordHintUsed = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      lastUpdated: new Date(),
    }));
  }, []);

  // Resetear la sección
  const resetSection = useCallback(() => {
    const resetProgress: SectionProgress = {
      sectionId,
      attempts: 0,
      correctAnswers: 0,
      totalQuestions,
      hintsUsed: 0,
      completed: false,
      score: 0,
      lastUpdated: new Date(),
    };

    setProgress(resetProgress);
    setAnswers([]);
    setShowFeedback(false);
    setCurrentFeedback("");

    if (typeof window !== "undefined") {
      sessionStorage.removeItem(storageKey);
    }
  }, [sectionId, totalQuestions, storageKey]);

  // Mostrar feedback
  const displayFeedback = useCallback((message: string) => {
    setCurrentFeedback(message);
    setShowFeedback(true);
  }, []);

  // Ocultar feedback
  const hideFeedback = useCallback(() => {
    setShowFeedback(false);
  }, []);

  return {
    progress,
    answers,
    showFeedback,
    currentFeedback,
    recordAnswer,
    recordHintUsed,
    resetSection,
    displayFeedback,
    hideFeedback,
  };
}
