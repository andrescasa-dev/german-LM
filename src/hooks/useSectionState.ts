"use client";

import { useState, useEffect, useCallback } from "react";
import type { SectionProgress, UserAnswer } from "@/types/adjective";

/**
 * Hook para gestionar el estado aislado de cada sección con persistencia opcional
 */
export function useSectionState(sectionId: string, totalQuestions: number) {
  const storageKey = `german-lm-section-${sectionId}`;

  // Estado de la sección
  const [progress, setProgress] = useState<SectionProgress>(() => ({
    sectionId,
    attempts: 0,
    correctAnswers: 0,
    totalQuestions,
    hintsUsed: 0,
    completed: false,
    score: 0,
    // Determinístico entre SSR y CSR para evitar mismatch
    lastUpdated: new Date(0),
  }));

  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<string>("");

  // Persistir en sessionStorage cuando cambia el progreso
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(storageKey, JSON.stringify(progress));
    }
  }, [progress, storageKey]);

  // Cargar desde sessionStorage tras montar (evita mismatch de hidratación)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem(storageKey);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      setProgress({
        ...parsed,
        lastUpdated: new Date(parsed.lastUpdated ?? 0),
      });
    } catch {
      // Ignorar errores y mantener valores por defecto
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
