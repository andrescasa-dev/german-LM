/**
 * Tipos base comunes para todos los talleres
 * Define interfaces genéricas que todos los talleres deben implementar
 */

/**
 * Ejercicio base con estructura mínima común
 */
export interface BaseExercise {
  id: string;
  sentence: string;
  expectedAnswer: string;
  context: BaseContext;
}

/**
 * Contexto genérico para validación de ejercicios
 */
export interface BaseContext {
  explanation: string;
  [key: string]: unknown; // Permite campos específicos del taller
}

/**
 * Párrafo narrativo base
 */
export interface BaseParagraph {
  id: string;
  text: string;
  clozes: BaseCloze[];
}

/**
 * Cloze individual base
 */
export interface BaseCloze {
  id: string;
  expectedAnswer: string;
  context: BaseContext;
}

/**
 * Resultado de validación estándar
 */
export interface BaseValidationResult {
  isCorrect: boolean;
  explanation: string;
  example?: string;
  markerInfo?: string;
  hint?: string;
}

/**
 * Configuración de taller
 */
export interface WorkshopConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  level: string;
  hasVariants: boolean;
  variantCount?: number;
  sections: {
    intro: string;
    central: string;
    narrative: string;
    resources: string;
  };
}

/**
 * Handlers comunes para ejercicios
 */
export interface ExerciseHandlers {
  onSubmit: (exerciseId: string, answer: string) => void;
  onHint: (exerciseId: string) => void;
  onFill: (exerciseId: string, answer: string) => void;
}

/**
 * Props base para componentes de sección
 */
export interface BaseSectionProps {
  sectionId: string;
  title: string;
  description: string;
  icon: string;
  workshopId: string;
}

/**
 * Props para componentes de ejercicio
 */
export interface BaseExerciseProps<T extends BaseExercise> {
  exercise: T;
  handlers: ExerciseHandlers;
  userAnswer?: string;
  isCorrect?: boolean;
  showFeedback?: boolean;
}

/**
 * Estado de progreso común
 */
export interface BaseProgress {
  sectionId: string;
  attempts: number;
  correctAnswers: number;
  totalQuestions: number;
  hintsUsed: number;
  completed: boolean;
  score: number;
  lastUpdated: Date;
}

/**
 * Respuesta del usuario común
 */
export interface BaseUserAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  attempts: number;
  hintsUsed: number;
  timestamp: Date;
}
