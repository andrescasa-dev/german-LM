import { BaseWorkshopValidator } from "@/lib/validation-interface";
import type { BaseContext, BaseValidationResult } from "@/types/workshop-base";

/**
 * Contexto específico para preposiciones de destino y procedencia
 */
export interface PreposicionDestinoProcedenciaContext extends BaseContext {
  preposition: string;
  case: string;
  gender: string;
  type: string; // "destino" | "procedencia" | "ubicacion" | "modo" | "tiempo" | "posesion" | "instrumento" | "local"
  explanation: string;
}

/**
 * Resultado de validación específico para preposiciones de destino y procedencia
 */
export interface PreposicionDestinoProcedenciaValidationResult
  extends BaseValidationResult {
  isCorrect: boolean;
  explanation: string;
  example?: string;
  markerInfo?: string;
}

/**
 * Validador para preposiciones de destino y procedencia
 */
export class PreposicionDestinoProcedenciaValidator extends BaseWorkshopValidator<
  PreposicionDestinoProcedenciaContext,
  PreposicionDestinoProcedenciaValidationResult
> {
  validate(
    answer: string,
    context: PreposicionDestinoProcedenciaContext
  ): PreposicionDestinoProcedenciaValidationResult {
    const normalizedAnswer = this.normalizeAnswer(answer);
    const expectedAnswer = this.normalizeAnswer(context.preposition);

    if (normalizedAnswer === expectedAnswer) {
      return this.createCorrectResult(
        `¡Correcto! "${context.preposition}" rige ${context.case}. ${context.explanation}`,
        `Preposición: ${context.preposition} | Caso: ${context.case} | Tipo: ${context.type}`
      );
    }

    // Proporcionar pistas específicas según la respuesta incorrecta
    let hint = "";
    if (normalizedAnswer === "aus" && expectedAnswer !== "aus") {
      hint =
        "Recuerda: 'aus' indica procedencia y rige Dativo, pero aquí necesitas una preposición diferente.";
    } else if (normalizedAnswer === "nach" && expectedAnswer !== "nach") {
      hint =
        "Recuerda: 'nach' indica destino con nombres propios y rige Dativo, pero aquí necesitas una preposición diferente.";
    } else if (normalizedAnswer === "zu" && expectedAnswer !== "zu") {
      hint =
        "Recuerda: 'zu' indica destino con nombres comunes y rige Dativo, pero aquí necesitas una preposición diferente.";
    } else if (normalizedAnswer === "bei" && expectedAnswer !== "bei") {
      hint =
        "Recuerda: 'bei' indica ubicación en casa de alguien y rige Dativo, pero aquí necesitas una preposición diferente.";
    } else if (normalizedAnswer === "von" && expectedAnswer !== "von") {
      hint =
        "Recuerda: 'von' indica origen o posesión y rige Dativo, pero aquí necesitas una preposición diferente.";
    } else if (normalizedAnswer === "mit" && expectedAnswer !== "mit") {
      hint =
        "Recuerda: 'mit' indica compañía o instrumento y rige Dativo, pero aquí necesitas una preposición diferente.";
    } else if (normalizedAnswer === "seit" && expectedAnswer !== "seit") {
      hint =
        "Recuerda: 'seit' indica duración desde el pasado y rige Dativo, pero aquí necesitas una preposición diferente.";
    } else {
      hint = `La respuesta correcta es "${context.preposition}" que rige ${context.case}. ${context.explanation}`;
    }

    return this.createIncorrectResult(
      `Incorrecto. ${hint}`,
      `Ejemplo: La preposición "${context.preposition}" rige ${context.case} y se usa para ${context.type}.`,
      `Preposición esperada: ${context.preposition} | Caso: ${context.case} | Tipo: ${context.type}`
    );
  }

  generateHint(context: PreposicionDestinoProcedenciaContext): string {
    const hints = [
      `Pista: Esta preposición rige ${context.case}.`,
      `Pista: Se usa para ${context.type}.`,
      `Pista: La preposición es "${context.preposition}".`,
      `Pista: ${context.explanation}`,
    ];

    return hints[Math.floor(Math.random() * hints.length)];
  }

  getCorrectAnswer(context: PreposicionDestinoProcedenciaContext): string {
    return context.preposition;
  }
}

export const preposicionDestinoProcedenciaValidator =
  new PreposicionDestinoProcedenciaValidator();
