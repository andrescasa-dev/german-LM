/**
 * Adaptadores de transformación entre tipos específicos y base
 * Permite mantener flexibilidad específica mientras habilita operaciones genéricas
 */

import type {
  BaseExercise,
  BaseContext,
  BaseParagraph,
  BaseCloze,
} from "@/types/workshop-base";
import type {
  CentralScenario,
  NarrativeParagraph,
  NarrativeCloze,
} from "@/types/adjective";
import type {
  WarmupExercise,
  CentralExercise,
  NarrativeParagraph as WerdenNarrativeParagraph,
  NarrativeCloze as WerdenNarrativeCloze,
} from "@/types/werden";
import type {
  PreposicionTemporalExercise,
  PreposicionTemporalParagraph,
  PreposicionTemporalCloze,
} from "@/types/preposiciones-temporales";
import type {
  PreposicionRecorridoExercise,
  PreposicionRecorridoParagraph,
  PreposicionRecorridoCloze,
} from "@/types/preposiciones-recorrido-orientacion";

/**
 * Adaptador para ejercicios de adjetivos (CentralScenario)
 */
export function adaptAdjectiveScenarioToBase(
  scenario: CentralScenario
): BaseExercise {
  return {
    id: scenario.id,
    sentence: scenario.sentence,
    expectedAnswer: "", // Los ejercicios de adjetivos no tienen expectedAnswer predefinido
    context: {
      explanation: scenario.context.determiner?.type || "unknown",
      type: scenario.type,
      adjective: scenario.adjective,
      determiner: scenario.context.determiner,
      case: scenario.context.case,
      gender: scenario.context.gender,
      number: scenario.context.number,
      position: scenario.context.position,
    } as BaseContext,
  };
}

/**
 * Adaptador para párrafos narrativos de adjetivos
 */
export function adaptAdjectiveParagraphToBase(
  paragraph: NarrativeParagraph
): BaseParagraph {
  return {
    id: paragraph.id,
    text: paragraph.text,
    clozes: paragraph.clozes.map(adaptAdjectiveClozeToBase),
  };
}

/**
 * Adaptador para clozes de adjetivos
 */
export function adaptAdjectiveClozeToBase(cloze: NarrativeCloze): BaseCloze {
  return {
    id: cloze.id,
    expectedAnswer: "", // Los clozes de adjetivos no tienen expectedAnswer predefinido
    context: {
      explanation: "adjective_declension",
      adjective: cloze.adjective,
      determiner: cloze.context.determiner,
      case: cloze.context.case,
      gender: cloze.context.gender,
      number: cloze.context.number,
      position: cloze.context.position,
    } as BaseContext,
  };
}

/**
 * Adaptador para ejercicios werden (WarmupExercise)
 */
export function adaptWerdenWarmupToBase(
  exercise: WarmupExercise
): BaseExercise {
  return {
    id: exercise.id,
    sentence: exercise.sentence,
    expectedAnswer: exercise.expectedAnswer,
    context: {
      explanation: exercise.context.function,
      pronoun: exercise.context.pronoun,
      function: exercise.context.function,
      tense: exercise.context.tense,
      mainVerb: exercise.context.mainVerb,
      auxiliaryVerb: exercise.context.auxiliaryVerb,
      isInfinitive: exercise.context.isInfinitive,
    } as BaseContext,
  };
}

/**
 * Adaptador para ejercicios centrales werden
 */
export function adaptWerdenCentralToBase(
  exercise: CentralExercise
): BaseExercise {
  return {
    id: exercise.id,
    sentence: exercise.sentence,
    expectedAnswer: exercise.correctAnswer,
    context: {
      explanation: exercise.correctFunction,
      pronoun: exercise.context.pronoun,
      function: exercise.context.function,
      tense: exercise.context.tense,
      mainVerb: exercise.context.mainVerb,
      auxiliaryVerb: exercise.context.auxiliaryVerb,
      isInfinitive: exercise.context.isInfinitive,
      options: exercise.options,
      correctFunction: exercise.correctFunction,
    } as BaseContext,
  };
}

/**
 * Adaptador para párrafos narrativos werden
 */
export function adaptWerdenParagraphToBase(
  paragraph: WerdenNarrativeParagraph
): BaseParagraph {
  return {
    id: paragraph.id,
    text: paragraph.germanText,
    clozes: paragraph.clozes.map(adaptWerdenClozeToBase),
  };
}

/**
 * Adaptador para clozes werden
 */
export function adaptWerdenClozeToBase(cloze: WerdenNarrativeCloze): BaseCloze {
  return {
    id: cloze.id,
    expectedAnswer: cloze.expectedAnswer,
    context: {
      explanation: cloze.context.function,
      pronoun: cloze.context.pronoun,
      function: cloze.context.function,
      tense: cloze.context.tense,
      mainVerb: cloze.context.mainVerb,
      auxiliaryVerb: cloze.context.auxiliaryVerb,
      isInfinitive: cloze.context.isInfinitive,
    } as BaseContext,
  };
}

/**
 * Adaptador para ejercicios de preposiciones temporales
 */
export function adaptPreposicionesExerciseToBase(
  exercise: PreposicionTemporalExercise
): BaseExercise {
  return {
    id: exercise.id,
    sentence: exercise.sentence,
    expectedAnswer: exercise.expectedAnswer,
    context: {
      explanation: exercise.context.explanation,
      preposition: exercise.context.preposition,
      case: exercise.context.case,
      timeUnit: exercise.context.timeUnit,
    } as BaseContext,
  };
}

/**
 * Adaptador para párrafos de preposiciones temporales
 */
export function adaptPreposicionesParagraphToBase(
  paragraph: PreposicionTemporalParagraph
): BaseParagraph {
  return {
    id: paragraph.id,
    text: paragraph.germanText,
    clozes: paragraph.clozes.map(adaptPreposicionesClozeToBase),
  };
}

/**
 * Adaptador para clozes de preposiciones temporales
 */
export function adaptPreposicionesClozeToBase(
  cloze: PreposicionTemporalCloze
): BaseCloze {
  return {
    id: cloze.id,
    expectedAnswer: cloze.expectedAnswer,
    context: {
      explanation: cloze.context.explanation,
      preposition: cloze.context.preposition,
      case: cloze.context.case,
      timeUnit: cloze.context.timeUnit,
    } as BaseContext,
  };
}

/**
 * Función genérica para extraer contexto específico desde BaseContext
 */
export function extractSpecificContext<T>(
  baseContext: BaseContext,
  key: string
): T | undefined {
  return baseContext[key] as T | undefined;
}

/**
 * Función genérica para crear BaseContext desde contexto específico
 */
export function createBaseContext(
  specificContext: Record<string, unknown>
): BaseContext {
  return {
    explanation: (specificContext.explanation as string) || "unknown",
    ...specificContext,
  };
}

/**
 * Adaptador para ejercicios de preposiciones de recorrido y orientación
 */
export function adaptPreposicionesRecorridoExerciseToBase(
  exercise: PreposicionRecorridoExercise
): BaseExercise {
  return {
    id: exercise.id,
    sentence: exercise.sentence,
    expectedAnswer: exercise.expectedAnswer,
    context: {
      explanation: exercise.context.explanation,
      preposition: exercise.context.preposition,
      case: exercise.context.case,
      type: exercise.context.type,
      gender: exercise.context.gender,
    } as BaseContext,
  };
}

/**
 * Adaptador para párrafos de preposiciones de recorrido y orientación
 */
export function adaptPreposicionesRecorridoParagraphToBase(
  paragraph: PreposicionRecorridoParagraph
): BaseParagraph {
  return {
    id: paragraph.id,
    text: paragraph.germanText,
    clozes: paragraph.clozes.map(adaptPreposicionesRecorridoClozeToBase),
  };
}

/**
 * Adaptador para clozes de preposiciones de recorrido y orientación
 */
export function adaptPreposicionesRecorridoClozeToBase(
  cloze: PreposicionRecorridoCloze
): BaseCloze {
  return {
    id: cloze.id,
    expectedAnswer: cloze.expectedAnswer,
    context: {
      explanation: cloze.context.explanation,
      preposition: cloze.context.preposition,
      case: cloze.context.case,
      type: cloze.context.type,
      gender: cloze.context.gender,
    } as BaseContext,
  };
}

/**
 * Función helper para determinar el tipo de ejercicio desde el contexto
 */
export function getExerciseType(baseContext: BaseContext): string {
  if (baseContext.type) return baseContext.type as string; // adjetivos
  if (baseContext.function) return baseContext.function as string; // werden
  if (baseContext.preposition) return "preposition"; // preposiciones
  return "unknown";
}

/**
 * Función helper para obtener la respuesta esperada desde el contexto
 */
export function getExpectedAnswerFromContext(baseContext: BaseContext): string {
  if (baseContext.preposition) return baseContext.preposition as string; // preposiciones
  if (baseContext.expectedAnswer) return baseContext.expectedAnswer as string; // werden
  return ""; // adjetivos - se calcula dinámicamente
}
