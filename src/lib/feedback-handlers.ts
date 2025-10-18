/**
 * Funciones puras para manejo de feedback
 * Principios: Funciones puras, Composición, Single Responsibility
 */

import {
  showCorrectAnswer,
  showIncorrectAnswer,
  showHintToast,
} from "@/lib/toast-service";

// Tipos funcionales puros
interface ValidationResult {
  isCorrect: boolean;
  explanation: string;
  example?: string;
  markerInfo?: string;
}

/**
 * Función pura de orden superior que crea un handler de feedback
 * Principio: Composición funcional
 */
export const createFeedbackHandler =
  () =>
  (result: ValidationResult): void => {
    if (result.isCorrect) {
      showCorrectAnswer(result.explanation, result.markerInfo);
    } else {
      showIncorrectAnswer(
        result.explanation,
        result.example,
        result.markerInfo
      );
    }
  };

/**
 * Función pura para mostrar hints
 * Single Responsibility: solo maneja hints
 */
export const createHintHandler =
  () =>
  (hint: string): void => {
    showHintToast(hint);
  };

/**
 * Composición funcional: combinar múltiples handlers
 */
export const composeHandlers =
  <T>(...handlers: Array<(value: T) => void>) =>
  (value: T): void => {
    handlers.forEach((handler) => handler(value));
  };

/**
 * Función pura para transformar resultados de validación
 * Principio: Transformaciones inmutables
 */
export const enhanceValidationResult = (
  result: ValidationResult,
  additionalInfo: Partial<ValidationResult>
): ValidationResult => ({
  ...result,
  ...additionalInfo,
});

/**
 * Curry funcional para handlers parametrizados
 */
export const createParameterizedHandler =
  <TResult>(handler: (result: TResult) => void) =>
  (result: TResult) =>
    handler(result);
