/**
 * Ejercicio de Adjetivos Refactorizado
 * Aplicando principios: DRY, Single Responsibility, Open/Closed, Paradigma Funcional
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
  validateAdjectiveEnding,
  generateHint,
  getAdjectiveEnding,
} from "@/lib/adjective-rules";
import type { CentralScenario, AdjectiveContext } from "@/types/adjective";
import type { BaseContext } from "@/types/workshop-base";
import { getCentralScenariosAsync } from "@/lib/workshop-loader";
import {
  createFeedbackHandler,
  createHintHandler,
} from "@/lib/feedback-handlers";
import { useState } from "react";

// Configuración pura y declarativa del taller
const SCENARIO_CONFIG = {
  titles: {
    "akk-weak": "Escenario 1: Declinación débil",
    "akk-mixed": "Escenario 2: Declinación mixta",
    "akk-strong": "Escenario 3: Declinación fuerte",
  },
  emojis: {
    "akk-weak": "🚗",
    "akk-mixed": "🚙",
    "akk-strong": "🚕",
  },
} as const;

// Funciones puras para extracción de datos
const extractContext = (scenario: CentralScenario): BaseContext => ({
  explanation: "Contexto de adjetivo alemán",
  determiner: scenario.context.determiner,
  case: scenario.context.case,
  gender: scenario.context.gender,
  number: scenario.context.number,
  position: scenario.context.position,
});
const extractSentence = (scenario: CentralScenario): string =>
  scenario.sentence;
const extractScenarioTitle = (scenario: CentralScenario): string =>
  SCENARIO_CONFIG.titles[scenario.id as keyof typeof SCENARIO_CONFIG.titles] ||
  scenario.id;
const extractScenarioEmoji = (scenario: CentralScenario): string =>
  SCENARIO_CONFIG.emojis[scenario.id as keyof typeof SCENARIO_CONFIG.emojis] ||
  "📝";

// Función pura para crear el loader
const createLoader = () => getCentralScenariosAsync;

// Handlers funcionales puros
const feedbackHandler = createFeedbackHandler();
const hintHandler = createHintHandler();

/**
 * Componente funcional puro
 * Toda la lógica compleja está en hooks y funciones puras
 */
export function ExerciseAkkusativMasculineRefactored() {
  const [showDemo, setShowDemo] = useState(true);

  // Hook funcional que encapsula toda la lógica
  const {
    exercises: scenarios,
    loading,
    answers,
    attempts,
    progress,
    handleSubmit,
    handleHint,
    handleFill,
    updateAnswer,
  } = useWorkshopExercises<CentralScenario, BaseContext>({
    workshopId: "adjetivo",
    sectionId: "exercise-akkusativ",
    loader: createLoader(),
    validator: (answer: string, context: BaseContext) => {
      const adjectiveContext = context as unknown as AdjectiveContext;
      return validateAdjectiveEnding(answer, adjectiveContext);
    },
    hintGenerator: (context: BaseContext) => {
      const adjectiveContext = context as unknown as AdjectiveContext;
      return generateHint(adjectiveContext);
    },
    answerGetter: (context: BaseContext) => {
      const adjectiveContext = context as unknown as AdjectiveContext;
      return getAdjectiveEnding(adjectiveContext);
    },
    feedbackHandler,
    contextExtractor: extractContext,
  });

  // Renderizado de loading - Componente puro
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🔮 II. Ejercicio Central: Acusativo Masculino</CardTitle>
          <CardDescription>
            Consolidar la selección de terminaciones en el punto de mayor
            confusión
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
        <CardTitle>🔮 II. Ejercicio Central: Acusativo Masculino</CardTitle>
        <CardDescription>
          Consolidar la selección de terminaciones en el punto de mayor
          confusión
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
        {/* Demostración - Componente condicional puro */}
        {showDemo && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3 text-blue-900 dark:text-blue-100">
              📚 Demostración: ¿Por qué cambia la terminación?
            </h3>
            <div className="space-y-3 text-sm">
              <p>
                <strong>Con artículo definido (débil):</strong> &ldquo;den neuen
                Wagen&rdquo; → -en
              </p>
              <p>
                <strong>Con artículo indefinido (mixto):</strong> &ldquo;einen
                neuen Wagen&rdquo; → -en
              </p>
              <p>
                <strong>Sin artículo (fuerte):</strong> &ldquo;neuen
                Wagen&rdquo; → -en
              </p>
            </div>
            <button
              onClick={() => setShowDemo(false)}
              className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ocultar demostración
            </button>
          </div>
        )}

        {/* Renderizado funcional de escenarios */}
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{extractScenarioEmoji(scenario)}</span>
              <h3 className="font-semibold text-lg">
                {extractScenarioTitle(scenario)}
              </h3>
            </div>

            {/* Componente reutilizable funcional */}
            <ExerciseRenderer
              exercise={scenario}
              answer={answers[scenario.id] || ""}
              onAnswerChange={(answer) => updateAnswer(scenario.id, answer)}
              onSubmit={() => {
                handleSubmit(scenario);
                // Composición: ejecutar handler adicional si es necesario
              }}
              onHint={() => {
                const hint = handleHint(scenario);
                hintHandler(hint);
              }}
              onFill={() => handleFill(scenario)}
              sentenceExtractor={extractSentence}
              placeholderExtractor={() => "e, en, er, es, em"}
            />

            {/* Metadata funcional */}
            {attempts[scenario.id] && (
              <div className="text-sm text-muted-foreground">
                Intentos: {attempts[scenario.id]}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
