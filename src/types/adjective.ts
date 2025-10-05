/**
 * Tipos para el sistema de declinación del adjetivo alemán
 */

export type Case = "nominativ" | "akkusativ" | "dativ" | "genitiv";
export type Gender = "maskulin" | "feminin" | "neutrum";
export type Number = "singular" | "plural";

export type DeclensionType = "weak" | "mixed" | "strong";

export type ArticleType =
  | "definite" // der, die, das
  | "indefinite" // ein, eine
  | "possessive" // mein, dein, sein, etc.
  | "kein" // kein, keine
  | "none"; // sin artículo

/**
 * Determinante con su tipo
 */
export interface Determiner {
  word: string;
  type: ArticleType;
  case: Case;
  gender: Gender;
  number: Number;
}

/**
 * Contexto completo para determinar la terminación del adjetivo
 */
export interface AdjectiveContext {
  determiner: Determiner | null;
  case: Case;
  gender: Gender;
  number: Number;
  position?: "attributive" | "predicative"; // atributivo (antes del sustantivo) o predicativo
}

/**
 * Resultado de la validación de una respuesta
 */
export interface ValidationResult {
  isCorrect: boolean;
  expectedEnding: string;
  declensionType: DeclensionType;
  explanation: string;
  example: string;
  markerInfo: string; // Información sobre quién lleva la marca fuerte
}

/**
 * Estado de progreso de una sección
 */
export interface SectionProgress {
  sectionId: string;
  attempts: number;
  correctAnswers: number;
  totalQuestions: number;
  hintsUsed: number;
  completed: boolean;
  score: number; // porcentaje 0-100
  lastUpdated: Date;
}

/**
 * Respuesta del usuario
 */
export interface UserAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  attempts: number;
  hintsUsed: number;
  timestamp: Date;
}
