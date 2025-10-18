/**
 * Configuración declarativa de ejercicios
 * Principio: Configuración sobre código
 * Este archivo demuestra cómo TODA la lógica de ejercicios puede ser declarativa
 */

import { createExerciseComponentConfig } from "@/lib/exercise-factory";
import {
  validateAdjectiveEnding,
  generateHint,
  getAdjectiveEnding,
} from "@/lib/adjective-rules";
import {
  validatePreposicionTemporal,
  generatePreposicionHint,
  getPreposicionAnswer,
} from "@/lib/preposiciones-rules";
import {
  getCentralScenariosAsync,
  getPreposicionesTemporalesCentralAsync,
} from "@/lib/workshop-loader";
import type { CentralScenario, AdjectiveContext } from "@/types/adjective";
import type { PreposicionTemporalExercise } from "@/types/preposiciones-temporales";
import type { BaseContext } from "@/types/workshop-base";

/**
 * Adaptador para convertir AdjectiveContext a BaseContext
 * Principio: Transformación funcional pura
 */
const adaptAdjectiveContextToBase = (
  context: AdjectiveContext
): BaseContext => ({
  explanation: "Contexto de adjetivo alemán", // Valor por defecto
  determiner: context.determiner,
  case: context.case,
  gender: context.gender,
  number: context.number,
  position: context.position,
});

/**
 * Adaptador para convertir PreposicionTemporalExercise["context"] a BaseContext
 */
const adaptPreposicionContextToBase = (
  context: PreposicionTemporalExercise["context"]
): BaseContext => ({
  explanation: context.explanation, // Usar la explanation existente
  preposition: context.preposition,
  case: context.case,
  timeUnit: context.timeUnit,
});

/**
 * Configuración del taller de adjetivos
 * TODO en un objeto declarativo
 */
export const adjectiveExerciseConfig = createExerciseComponentConfig<
  CentralScenario,
  BaseContext
>({
  workshopId: "adjetivo",
  sectionId: "exercise-akkusativ",
  title: "🔮 II. Ejercicio Central: Acusativo Masculino",
  description:
    "Consolidar la selección de terminaciones en el punto de mayor confusión",
  icon: "🔮",
  loader: getCentralScenariosAsync,
  validator: (answer: string, context: BaseContext) => {
    // Extraer el contexto específico del adjetivo usando conversión segura
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
  contextExtractor: (scenario) => adaptAdjectiveContextToBase(scenario.context),
  sentenceExtractor: (scenario) => scenario.sentence,
  placeholderExtractor: () => "e, en, er, es, em",
});

/**
 * Configuración del taller de preposiciones
 * EXACTAMENTE la misma estructura, solo datos diferentes
 */
export const preposicionesExerciseConfig = createExerciseComponentConfig<
  PreposicionTemporalExercise,
  BaseContext
>({
  workshopId: "preposiciones-temporales",
  sectionId: "preposiciones-central",
  title: "⏰ II. Ejercicio Central: Preposiciones Temporales",
  description: "Practica las preposiciones de tiempo en diferentes contextos",
  icon: "⏰",
  loader: getPreposicionesTemporalesCentralAsync,
  validator: (answer: string, context: BaseContext) => {
    const preposicionContext =
      context as PreposicionTemporalExercise["context"];
    return validatePreposicionTemporal(answer, preposicionContext);
  },
  hintGenerator: (context: BaseContext) => {
    const preposicionContext =
      context as PreposicionTemporalExercise["context"];
    return generatePreposicionHint(preposicionContext);
  },
  answerGetter: (context: BaseContext) => {
    const preposicionContext =
      context as PreposicionTemporalExercise["context"];
    return getPreposicionAnswer(preposicionContext);
  },
  contextExtractor: (exercise) =>
    adaptPreposicionContextToBase(exercise.context),
  sentenceExtractor: (exercise) => exercise.sentence,
  placeholderExtractor: () => "um, am, im, seit, nach, bis, von...",
});

/**
 * Array de todas las configuraciones
 * Permite iterar y crear componentes dinámicamente
 */
export const allExerciseConfigs = [
  adjectiveExerciseConfig,
  preposicionesExerciseConfig,
] as const;

/**
 * Type-safe getter de configuraciones
 */
export const getExerciseConfig = (workshopId: string) => {
  return allExerciseConfigs.find((config) => config.workshopId === workshopId);
};
