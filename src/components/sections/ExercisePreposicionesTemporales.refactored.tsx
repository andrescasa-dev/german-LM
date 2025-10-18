/**
 * Ejercicio de Preposiciones Refactorizado
 * Aplicando principios: DRY, Single Responsibility, Open/Closed, Paradigma Funcional
 * NOTA: Reutiliza el 90% del código con el taller de adjetivos
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
  validatePreposicionTemporal,
  generatePreposicionHint,
  getPreposicionAnswer,
} from "@/lib/preposiciones-rules";
import type { PreposicionTemporalExercise } from "@/types/preposiciones-temporales";
import { getPreposicionesTemporalesCentralAsync } from "@/lib/workshop-loader";
import {
  createFeedbackHandler,
  createHintHandler,
} from "@/lib/feedback-handlers";

// Funciones puras para extracción de datos - Single Responsibility
const extractContext = (exercise: PreposicionTemporalExercise) =>
  exercise.context;
const extractSentence = (exercise: PreposicionTemporalExercise) =>
  exercise.sentence;
const extractPlaceholder = () => "um, am, im, seit, nach, bis, von...";

// Función pura para crear el loader
const createLoader = () => getPreposicionesTemporalesCentralAsync;

// Handlers funcionales puros - Composición
const feedbackHandler = createFeedbackHandler();
const hintHandler = createHintHandler();

/**
 * Componente funcional puro
 * NOTA: Este componente es casi idéntico al de adjetivos, demostrando
 * la reutilización exitosa mediante composición funcional
 */
export function ExercisePreposicionesTemporalesRefactored() {
  // Hook funcional reutilizable - DRY principle
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
  } = useWorkshopExercises({
    workshopId: "preposiciones-temporales",
    sectionId: "preposiciones-central",
    loader: createLoader(),
    validator: validatePreposicionTemporal,
    hintGenerator: generatePreposicionHint,
    answerGetter: getPreposicionAnswer,
    feedbackHandler,
    contextExtractor: extractContext,
  });

  // Renderizado de loading - Componente puro reutilizable
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            ⏰ II. Ejercicio Central: Preposiciones Temporales
          </CardTitle>
          <CardDescription>
            Practica las preposiciones de tiempo en diferentes contextos
          </CardDescription>
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
          ⏰ II. Ejercicio Central: Preposiciones Temporales
        </CardTitle>
        <CardDescription>
          Practica las preposiciones de tiempo en diferentes contextos
        </CardDescription>
        <Progress value={progress.score} className="mt-4" />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>
            Respuestas: {progress.correctAnswers}/{progress.totalQuestions}
          </span>
          <span>Pistas usadas: {progress.hintsUsed}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Renderizado funcional de ejercicios - Código 100% reutilizado */}
        {exercises.map((exercise) => (
          <div key={exercise.id} className="border rounded-lg p-6 space-y-4">
            {/* Componente reutilizable funcional - Open/Closed principle */}
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
              sentenceExtractor={extractSentence}
              placeholderExtractor={extractPlaceholder}
            />

            {/* Metadata funcional - Composición */}
            {attempts[exercise.id] && (
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
