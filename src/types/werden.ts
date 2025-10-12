export type WerdenFunction = "verbo-pleno" | "futuro" | "pasiva";
export type Tense = "prasens" | "perfekt" | "futur";
export type Pronoun =
  | "ich"
  | "du"
  | "er"
  | "sie"
  | "es"
  | "wir"
  | "ihr"
  | "sie-formal"
  | "sie-plural";

export interface WerdenContext {
  pronoun: Pronoun;
  function: WerdenFunction;
  tense: Tense;
  mainVerb?: string; // para casos como "wird... gehen" en futuro
  auxiliaryVerb?: string; // para casos como "wird... werden" en pasiva futura
  isInfinitive?: boolean; // para distinguir entre conjugación y infinitivo
}

export interface WerdenValidationResult {
  isCorrect: boolean;
  explanation: string;
  hint: string;
  example: string;
  functionType: WerdenFunction;
  commonError?: string;
  markerInfo?: string;
}

export interface WerdenExercise {
  id: string;
  sentence: string;
  context: WerdenContext;
  options?: string[]; // para múltiple opción
  expectedAnswer?: string; // para ejercicios de input
  correctFunction?: string; // para ejercicios que piden identificar función
}

export interface WarmupExercise {
  id: string;
  sentence: string;
  expectedAnswer: string;
  context: WerdenContext;
}

export interface CentralExercise {
  id: string;
  sentence: string;
  options: string[];
  correctAnswer: string;
  correctFunction: string;
  context: WerdenContext;
}

export interface NarrativeCloze {
  id: string;
  expectedAnswer: string;
  context: WerdenContext;
}

export interface NarrativeParagraph {
  id: string;
  germanText: string;
  clozes: NarrativeCloze[];
}
