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
import { Button } from "@/components/ui/button";
import { useSectionState } from "@/hooks/useSectionState";
import type {
  BaseExercise,
  BaseSectionProps,
  BaseContext,
} from "@/types/workshop-base";

interface BaseIntroSectionProps<T extends BaseExercise>
  extends BaseSectionProps {
  surveyQuestions: T[];
  practiceQuestions: T[];
  renderQuestion: (question: T, handlers: QuestionHandlers) => ReactNode;
  validateFn: (answer: string, context: BaseContext) => unknown;
  getHintFn: (context: BaseContext) => string;
  getAnswerFn: (context: BaseContext) => string;
  showSurvey?: boolean;
  showPractice?: boolean;
}

interface QuestionHandlers {
  onSubmit: (question: T) => unknown;
  onHint: (question: T) => string;
  onFill: (question: T) => void;
  userAnswer: (questionId: string) => string;
  setAnswer: (questionId: string, answer: string) => void;
}

/**
 * Componente base reutilizable para secciones de repaso/diagnóstico
 * Encapsula la lógica común: encuesta inicial, preguntas de práctica, feedback
 */
export function BaseIntroSection<T extends BaseExercise>({
  sectionId,
  title,
  description,
  icon,
  surveyQuestions,
  practiceQuestions,
  renderQuestion,
  validateFn,
  getHintFn,
  getAnswerFn,
  showSurvey = true,
  showPractice = true,
}: BaseIntroSectionProps<T>) {
  const totalQuestions = surveyQuestions.length + practiceQuestions.length;

  const {
    progress,
    recordAnswer,
    recordHintUsed,
    resetSection,
    displayFeedback,
  } = useSectionState(sectionId, totalQuestions);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  // Escuchar eventos de reset
  useEffect(() => {
    const handleReset = () => {
      setAnswers({});
      setCurrentPhase("survey");
      setSurveyCompleted(false);
      resetSection();
    };

    window.addEventListener("resetAllSections", handleReset);
    return () => window.removeEventListener("resetAllSections", handleReset);
  }, [resetSection]);

  const handleSubmit = (question: T) => {
    const answer = answers[question.id] || "";
    const result = validateFn(answer, question.context);

    recordAnswer(question.id, answer, result.isCorrect, 0);

    if (result.isCorrect) {
      displayFeedback(`¡Correcto! ${result.explanation}`);
    } else {
      displayFeedback(`Incorrecto. ${result.explanation}`);
    }

    return result;
  };

  const handleHint = (question: T) => {
    const hint = getHintFn(question.context);
    recordHintUsed();
    displayFeedback(hint);
    return hint;
  };

  const handleFill = (question: T) => {
    const correctAnswer = getAnswerFn(question.context);
    setAnswers((prev) => ({ ...prev, [question.id]: correctAnswer }));
  };

  const handleSurveyComplete = () => {
    setSurveyCompleted(true);
    displayFeedback(
      "¡Encuesta completada! Ahora practiquemos con algunos ejercicios."
    );
  };

  const questionHandlers = {
    onSubmit: handleSubmit,
    onHint: handleHint,
    onFill: handleFill,
    userAnswer: (questionId: string) => answers[questionId] || "",
    setAnswer: (questionId: string, answer: string) =>
      setAnswers((prev) => ({ ...prev, [questionId]: answer })),
  };

  const surveyAnswers = surveyQuestions.filter((q) => answers[q.id]);
  const practiceAnswers = practiceQuestions.filter((q) => answers[q.id]);
  const surveyComplete = surveyAnswers.length === surveyQuestions.length;
  const practiceComplete = practiceAnswers.length === practiceQuestions.length;

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
        {/* Encuesta inicial */}
        {showSurvey && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                📋 Encuesta de Diagnóstico
              </h3>
              {surveyComplete && !surveyCompleted && (
                <Button onClick={handleSurveyComplete} size="sm">
                  Completar Encuesta
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {surveyQuestions.map((question) => (
                <div key={question.id} className="border rounded-lg p-4">
                  {renderQuestion(question, questionHandlers)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preguntas de práctica */}
        {showPractice && (surveyCompleted || !showSurvey) && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">🎯 Ejercicios de Práctica</h3>

            <div className="space-y-4">
              {practiceQuestions.map((question) => (
                <div key={question.id} className="border rounded-lg p-4">
                  {renderQuestion(question, questionHandlers)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumen de progreso */}
        {(surveyComplete || practiceComplete) && (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              ✅ Progreso Completado
            </h4>
            <div className="text-sm text-green-800 dark:text-green-200">
              <p>
                Encuesta: {surveyAnswers.length}/{surveyQuestions.length}{" "}
                completadas
              </p>
              <p>
                Práctica: {practiceAnswers.length}/{practiceQuestions.length}{" "}
                completadas
              </p>
              <p>Puntuación general: {progress.score}%</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
