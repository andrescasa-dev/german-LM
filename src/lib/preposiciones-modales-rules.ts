import { BaseWorkshopValidator } from "@/lib/validation-interface";
import type { BaseContext, BaseValidationResult } from "@/types/workshop-base";

/**
 * Contexto específico para preposiciones modales y relacionales
 */
export interface PreposicionModalRelacionalContext extends BaseContext {
  preposition: string;
  case: string;
  meaning: string;
  explanation: string;
}

/**
 * Resultado de validación específico para preposiciones modales y relacionales
 */
export interface PreposicionModalRelacionalValidationResult
  extends BaseValidationResult {
  isCorrect: boolean;
  explanation: string;
  example?: string;
  markerInfo?: string;
}

/**
 * Validador para preposiciones modales y relacionales
 */
export class PreposicionModalRelacionalValidator extends BaseWorkshopValidator<
  PreposicionModalRelacionalContext,
  PreposicionModalRelacionalValidationResult
> {
  validate(
    answer: string,
    context: PreposicionModalRelacionalContext
  ): PreposicionModalRelacionalValidationResult {
    const normalizedAnswer = this.normalizeAnswer(answer);
    const expectedAnswer = this.normalizeAnswer(context.preposition);

    if (normalizedAnswer === expectedAnswer) {
      return this.createCorrectResult(
        `¡Correcto! "${context.preposition}" rige ${context.case}. ${context.explanation}`,
        `Preposición: ${context.preposition} | Caso: ${context.case}`
      );
    }

    // Proporcionar pistas específicas según la respuesta incorrecta
    let hint = "";
    if (normalizedAnswer === "mit" && expectedAnswer !== "mit") {
      hint =
        "Recuerda: 'mit' rige Dativo, pero aquí necesitas una preposición que rige Acusativo.";
    } else if (normalizedAnswer === "ohne" && expectedAnswer !== "ohne") {
      hint =
        "Recuerda: 'ohne' rige Acusativo, pero aquí necesitas una preposición diferente.";
    } else if (normalizedAnswer === "für" && expectedAnswer !== "für") {
      hint =
        "Recuerda: 'für' rige Acusativo, pero aquí necesitas una preposición diferente.";
    } else if (normalizedAnswer === "gegen" && expectedAnswer !== "gegen") {
      hint =
        "Recuerda: 'gegen' rige Acusativo, pero aquí necesitas una preposición diferente.";
    } else {
      hint = `La respuesta correcta es "${context.preposition}" que rige ${context.case}. ${context.explanation}`;
    }

    return this.createIncorrectResult(
      `Incorrecto. ${hint}`,
      `Ejemplo: La preposición "${context.preposition}" rige ${context.case} y significa "${context.meaning}".`,
      `Preposición esperada: ${context.preposition} | Caso: ${context.case}`
    );
  }

  generateHint(context: PreposicionModalRelacionalContext): string {
    const hints = [
      `Pista: Esta preposición rige ${context.case}.`,
      `Pista: Significa "${context.meaning}".`,
      `Pista: La preposición es "${context.preposition}".`,
    ];

    return hints[Math.floor(Math.random() * hints.length)];
  }

  getCorrectAnswer(context: PreposicionModalRelacionalContext): string {
    return context.preposition;
  }
}

export const preposicionModalRelacionalValidator =
  new PreposicionModalRelacionalValidator();
