/**
 * Factory funcional para crear componentes de ejercicios
 * Principios: DRY extremo, Open/Closed, Composición funcional
 * Este archivo demuestra cómo eliminar casi TODO el código duplicado
 */

import type { ComponentType } from "react";
import type { BaseContext } from "@/types/workshop-base";

// Tipos funcionales puros
export interface ExerciseConfig<T, TContext extends BaseContext> {
  workshopId: string;
  sectionId: string;
  title: string;
  description: string;
  icon: string;
  loader: (workshopId: string, variant: number) => Promise<T[]>;
  validator: (
    answer: string,
    context: TContext
  ) => {
    isCorrect: boolean;
    explanation: string;
    example?: string;
    markerInfo?: string;
  };
  hintGenerator: (context: TContext) => string;
  answerGetter: (context: TContext) => string;
  contextExtractor: (exercise: T) => TContext;
  sentenceExtractor: (exercise: T) => string;
  placeholderExtractor?: (exercise: T) => string;
  renderDemo?: () => React.ReactNode;
  renderExerciseMetadata?: (exercise: T, attempts?: number) => React.ReactNode;
}

/**
 * Función de orden superior que crea componentes de ejercicios
 * Elimina TODO el código duplicado mediante composición funcional
 *
 * USO:
 * const AdjectiveExercise = createExerciseComponent({
 *   workshopId: "adjetivo",
 *   sectionId: "exercise-akkusativ",
 *   title: "...",
 *   loader: getCentralScenariosAsync,
 *   validator: validateAdjectiveEnding,
 *   ...
 * });
 */
export function createExerciseComponentConfig<
  T extends { id: string },
  TContext extends BaseContext
>(config: ExerciseConfig<T, TContext>) {
  return config;
}

/**
 * Función pura para crear extractores por defecto
 * Principio: Valores por defecto funcionales
 */
export const createDefaultExtractors = <
  T extends { id: string; sentence: string }
>() => ({
  sentenceExtractor: (exercise: T) => exercise.sentence,
  placeholderExtractor: () => "Escribe tu respuesta...",
  contextExtractor: (exercise: T & { context: any }) => exercise.context,
});

/**
 * Composición funcional: combinar configuraciones
 * Principio: Composición sobre herencia
 */
export const composeConfigs = <T, TContext extends BaseContext>(
  baseConfig: Partial<ExerciseConfig<T, TContext>>,
  specificConfig: Partial<ExerciseConfig<T, TContext>>
): Partial<ExerciseConfig<T, TContext>> => ({
  ...baseConfig,
  ...specificConfig,
});

/**
 * HOF para crear loaders con fallback automático
 * Principio: Manejo de errores funcional
 */
export const createSafeLoader =
  <T>(loader: (workshopId: string, variant: number) => Promise<T[]>) =>
  async (workshopId: string, variant: number): Promise<T[]> => {
    try {
      return await loader(workshopId, variant);
    } catch (error) {
      console.error(`Failed to load ${workshopId} variant ${variant}:`, error);
      // Fallback funcional recursivo
      if (variant !== 1) {
        return createSafeLoader(loader)(workshopId, 1);
      }
      return [];
    }
  };

/**
 * Pipe funcional para transformar configuraciones
 * Permite composición elegante
 */
export const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T =>
    fns.reduce((acc, fn) => fn(acc), value);

/**
 * Función pura para validar configuración
 * Principio: Fail fast funcional
 */
export const validateConfig = <T, TContext extends BaseContext>(
  config: ExerciseConfig<T, TContext>
): boolean => {
  const required = [
    "workshopId",
    "sectionId",
    "title",
    "loader",
    "validator",
    "hintGenerator",
    "answerGetter",
    "contextExtractor",
    "sentenceExtractor",
  ];

  return required.every(
    (key) => key in config && config[key as keyof typeof config] !== undefined
  );
};
