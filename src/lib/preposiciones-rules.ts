import type { PreposicionTemporalExercise, PreposicionTemporalCloze } from "@/types/preposiciones-temporales";

export interface PreposicionValidationResult {
  isCorrect: boolean;
  explanation: string;
  example?: string;
  markerInfo?: string;
}

export function validatePreposicionTemporal(
  answer: string,
  context: PreposicionTemporalExercise["context"]
): PreposicionValidationResult {
  const normalizedAnswer = answer.trim().toLowerCase();
  const expectedAnswer = context.preposition.toLowerCase();

  if (normalizedAnswer === expectedAnswer) {
    return {
      isCorrect: true,
      explanation: `¡Correcto! ${context.explanation}`,
      markerInfo: `Caso: ${context.case} | Unidad temporal: ${context.timeUnit}`,
    };
  }

  // Provide specific feedback based on the expected preposition
  let explanation = `Incorrecto. La respuesta correcta es "${context.preposition}". `;
  let example = "";

  switch (context.preposition.toLowerCase()) {
    case "um":
      explanation += "Para indicar horas específicas se usa 'um'.";
      example = "Ejemplo: um 8 Uhr (a las 8)";
      break;
    case "am":
      explanation += "Para días de la semana, momentos del día y fechas se usa 'am'.";
      example = "Ejemplo: am Montag (el lunes), am Morgen (por la mañana)";
      break;
    case "im":
      explanation += "Para meses y estaciones se usa 'im'.";
      example = "Ejemplo: im Mai (en mayo), im Sommer (en verano)";
      break;
    case "seit":
      explanation += "Para indicar duración desde el pasado se usa 'seit'.";
      example = "Ejemplo: seit drei Jahren (desde hace tres años)";
      break;
    case "nach":
      explanation += "Para indicar secuencia temporal se usa 'nach'.";
      example = "Ejemplo: nach dem Unterricht (después de la clase)";
      break;
    case "bis":
      explanation += "Para indicar límite temporal se usa 'bis'.";
      example = "Ejemplo: bis Freitag (hasta el viernes)";
      break;
    case "von":
      explanation += "Para indicar inicio de período se usa 'von'.";
      example = "Ejemplo: von 9 bis 17 Uhr (de 9 a 17 horas)";
      break;
    default:
      explanation += context.explanation;
  }

  return {
    isCorrect: false,
    explanation,
    example,
    markerInfo: `Caso: ${context.case} | Unidad temporal: ${context.timeUnit}`,
  };
}

export function generatePreposicionHint(context: PreposicionTemporalExercise["context"]): string {
  const timeUnit = context.timeUnit;
  
  switch (timeUnit) {
    case "hora":
      return "💡 Pista: Para horas específicas siempre usa 'um'";
    case "dia-semana":
    case "momento-dia":
    case "fecha":
    case "festividad-dia":
      return "💡 Pista: Para días, momentos del día y fechas usa 'am'";
    case "mes":
    case "estacion":
      return "💡 Pista: Para meses y estaciones usa 'im'";
    case "duracion":
      return "💡 Pista: Para duración desde el pasado usa 'seit'";
    case "secuencia":
      return "💡 Pista: Para secuencia temporal usa 'nach'";
    case "limite":
      return "💡 Pista: Para límite temporal usa 'bis'";
    case "inicio-periodo":
      return "💡 Pista: Para inicio de período usa 'von'";
    case "periodo-completo":
      return "💡 Pista: Para período completo usa 'von... bis'";
    default:
      return `💡 Pista: Revisa el tipo de unidad temporal: ${timeUnit}`;
  }
}

export function getPreposicionAnswer(context: PreposicionTemporalExercise["context"]): string {
  return context.preposition;
}

