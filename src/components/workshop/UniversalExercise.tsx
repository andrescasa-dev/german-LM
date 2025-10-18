/**
 * Componente Universal de Ejercicios
 * Principios: DRY extremo, Open/Closed, Single Responsibility
 * Este componente puede renderizar CUALQUIER tipo de ejercicio mediante configuración
 */

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useWorkshopExercises } from "@/hooks/useWorkshopExercises";
import { ExerciseRenderer } from "@/components/workshop/ExerciseRenderer";
import {
  createFeedbackHandler,
  createHintHandler,
} from "@/lib/feedback-handlers";
import type { ExerciseConfig } from "@/lib/exercise-factory";
import type { BaseContext } from "@/types/workshop-base";

// Handlers funcionales puros - singleton
const feedbackHandler = createFeedbackHandler();
const hintHandler = createHintHandler();

interface UniversalExerciseProps<
  T extends { id: string },
  TContext extends BaseContext
> {
  config: ExerciseConfig<T, TContext>;
}

/**
 * Componente universal completamente funcional
 * NO tiene lógica específica de ningún taller
 * TODO se configura mediante props
 *
 * Esto significa que NUNCA necesitamos crear otro componente de ejercicio
 * Solo necesitamos crear una nueva configuración
 */
export function UniversalExercise<
  T extends { id: string },
  TContext extends BaseContext
>({ config }: UniversalExerciseProps<T, TContext>) {
  // Hook funcional reutilizable con toda la lógica
  const {
    exercises,
    loading,
    answers,
    attempts,
    progress,
    handleSubmit,
    handleHint,
    handleFill,
    updateAnswer,
  } = useWorkshopExercises<T, TContext>({
    workshopId: config.workshopId,
    sectionId: config.sectionId,
    loader: config.loader,
    validator: config.validator,
    hintGenerator: config.hintGenerator,
    answerGetter: config.answerGetter,
    feedbackHandler,
    contextExtractor: config.contextExtractor,
  });

  // Renderizado condicional puro - loading
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {config.icon} {config.title}
          </CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Cargando variante...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Renderizado principal - componente funcional puro
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {config.icon} {config.title}
        </CardTitle>
        <CardDescription>{config.description}</CardDescription>
        <Progress value={progress.score} className="mt-4" />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>
            Respuestas: {progress.correctAnswers}/{progress.totalQuestions}
          </span>
          <span>Pistas usadas: {progress.hintsUsed}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Demo opcional - composición funcional */}
        {config.renderDemo && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            {config.renderDemo()}
          </div>
        )}

        {/* Renderizado funcional de ejercicios - map puro */}
        {exercises.map((exercise) => (
          <div key={exercise.id} className="border rounded-lg p-6 space-y-4">
            {/* Componente reutilizable funcional */}
            <ExerciseRenderer
              exercise={exercise}
              answer={answers[exercise.id] || ""}
              onAnswerChange={(answer) => updateAnswer(exercise.id, answer)}
              onSubmit={() => handleSubmit(exercise)}
              onHint={() => {
                const hint = handleHint(exercise);
                hintHandler(hint);
              }}
              onFill={() => handleFill(exercise)}
              sentenceExtractor={config.sentenceExtractor}
              placeholderExtractor={config.placeholderExtractor}
            />

            {/* Metadata opcional - composición */}
            {config.renderExerciseMetadata
              ? config.renderExerciseMetadata(exercise, attempts[exercise.id])
              : attempts[exercise.id] && (
                  <div className="text-sm text-muted-foreground">
                    Intentos: {attempts[exercise.id]}
                  </div>
                )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
