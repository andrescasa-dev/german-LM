import type { PreposicionRecorridoExercise } from "@/types/preposiciones-recorrido-orientacion";
import { BaseWorkshopValidator } from "@/lib/validation-interface";
import type { BaseContext } from "@/types/workshop-base";

export interface PreposicionRecorridoValidationResult {
  isCorrect: boolean;
  explanation: string;
  example?: string;
  markerInfo?: string;
}

export function validatePreposicionRecorrido(
  answer: string,
  context: PreposicionRecorridoExercise["context"]
): PreposicionRecorridoValidationResult {
  const normalizedAnswer = answer.trim().toLowerCase();
  const expectedAnswer = getPreposicionRecorridoAnswer(context).toLowerCase();

  if (normalizedAnswer === expectedAnswer) {
    return {
      isCorrect: true,
      explanation: `¡Correcto! ${context.explanation}`,
      markerInfo: `Caso: ${context.case} | Tipo: ${context.type} | Género: ${context.gender}`,
    };
  }

  // Provide specific feedback based on the preposition type
  let explanation = `Incorrecto. La respuesta correcta es "${getPreposicionRecorridoAnswer(
    context
  )}". `;
  let example = "";

  switch (context.type) {
    case "recorrido":
      if (context.preposition === "durch") {
        explanation +=
          "'Durch' significa 'a través de' y siempre rige Acusativo.";
        example = `Ejemplo: durch den Park (a través del parque)`;
      } else if (context.preposition === "um") {
        explanation +=
          "'Um' significa 'alrededor de' y siempre rige Acusativo.";
        example = `Ejemplo: um die Stadt (alrededor de la ciudad)`;
      }
      break;
    case "local-especifico":
      if (context.preposition === "an") {
        explanation += "'Am...vorbei' significa 'pasar junto a' y rige Dativo.";
        example = `Ejemplo: an der Kirche vorbei (pasar junto a la iglesia)`;
      } else if (context.preposition === "bis zu") {
        explanation += "'Bis zu' significa 'hasta' y rige Dativo.";
        example = `Ejemplo: bis zum Bahnhof (hasta la estación)`;
      } else if (context.preposition === "gegenüber von") {
        explanation += "'Gegenüber von' significa 'enfrente de' y rige Dativo.";
        example = `Ejemplo: gegenüber von der Post (enfrente del correo)`;
      }
      break;
    default:
      explanation += context.explanation;
  }

  return {
    isCorrect: false,
    explanation,
    example,
    markerInfo: `Caso: ${context.case} | Tipo: ${context.type} | Género: ${context.gender}`,
  };
}

export function generatePreposicionRecorridoHint(
  context: PreposicionRecorridoExercise["context"]
): string {
  const type = context.type;
  const caseType = context.case;

  switch (type) {
    case "recorrido":
      if (context.preposition === "durch") {
        return "💡 Pista: 'Durch' (a través de) siempre rige Acusativo";
      } else if (context.preposition === "um") {
        return "💡 Pista: 'Um' (alrededor de) siempre rige Acusativo";
      }
      break;
    case "local-especifico":
      if (context.preposition === "an") {
        return "💡 Pista: 'Am...vorbei' (pasar junto a) rige Dativo";
      } else if (context.preposition === "bis zu") {
        return "💡 Pista: 'Bis zu' (hasta) rige Dativo";
      } else if (context.preposition === "gegenüber von") {
        return "💡 Pista: 'Gegenüber von' (enfrente de) rige Dativo";
      }
      break;
  }

  return `💡 Pista: Revisa el caso (${caseType}) y el tipo (${type})`;
}

export function getPreposicionRecorridoAnswer(
  context: PreposicionRecorridoExercise["context"]
): string {
  // Construir la respuesta basada en la preposición y el género
  const preposition = context.preposition;
  const gender = context.gender;
  const caseType = context.case;

  if (caseType === "acusativo") {
    switch (gender) {
      case "masculino":
        return `${preposition} den`;
      case "femenino":
        return `${preposition} die`;
      case "neutro":
        return `${preposition} das`;
      default:
        return preposition;
    }
  } else if (caseType === "dativo") {
    switch (gender) {
      case "masculino":
        if (preposition === "bis zu") return "bis zum";
        if (preposition === "gegenüber von") return "gegenüber vom";
        return `${preposition} dem`;
      case "femenino":
        if (preposition === "bis zu") return "bis zur";
        return `${preposition} der`;
      case "neutro":
        if (preposition === "an") return "am";
        return `${preposition} dem`;
      default:
        return preposition;
    }
  }

  return preposition;
}

/**
 * Validador de preposiciones de recorrido y orientación que implementa la interfaz común
 */
export class PreposicionesRecorridoValidator extends BaseWorkshopValidator<
  PreposicionRecorridoExercise["context"],
  PreposicionRecorridoValidationResult
> {
  validate(
    answer: string,
    context: PreposicionRecorridoExercise["context"]
  ): PreposicionRecorridoValidationResult {
    return validatePreposicionRecorrido(answer, context);
  }

  generateHint(context: PreposicionRecorridoExercise["context"]): string {
    return generatePreposicionRecorridoHint(context);
  }

  getCorrectAnswer(context: PreposicionRecorridoExercise["context"]): string {
    return getPreposicionRecorridoAnswer(context);
  }
}

/**
 * Instancia singleton del validador de preposiciones de recorrido y orientación
 */
export const preposicionesRecorridoValidator =
  new PreposicionesRecorridoValidator();

/**
 * Funciones de adaptación para usar con BaseContext
 */
export function validatePreposicionesRecorridoFromBase(
  answer: string,
  baseContext: BaseContext
): PreposicionRecorridoValidationResult {
  const context =
    baseContext as unknown as PreposicionRecorridoExercise["context"];
  return validatePreposicionRecorrido(answer, context);
}

export function generatePreposicionesRecorridoHintFromBase(
  baseContext: BaseContext
): string {
  const context =
    baseContext as unknown as PreposicionRecorridoExercise["context"];
  return generatePreposicionRecorridoHint(context);
}

export function getPreposicionesRecorridoAnswerFromBase(
  baseContext: BaseContext
): string {
  const context =
    baseContext as unknown as PreposicionRecorridoExercise["context"];
  return getPreposicionRecorridoAnswer(context);
}
