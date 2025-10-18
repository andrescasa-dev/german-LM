/**
 * Tipos específicos para loaders y utilidades de workshop
 * Complementa workshop-variants.ts con tipos para la implementación
 *
 * NOTA: Si es necesario agregar nuevos tipos específicos de talleres,
 * estos deben ser definidos primero en sus archivos correspondientes
 * (ej: werden.ts, adjective.ts, preposiciones-temporales.ts) y luego
 * importados aquí para su uso en la implementación.
 */

import type {
  WorkshopId,
  AnyWorkshopVariant,
  AnyExercise,
  AnyExerciseContext,
  AnyValidationResult,
  AnyNarrativeParagraph,
} from "./workshop-variants";

// Importar tipos específicos de talleres individuales
import type {
  WerdenFunction,
  Tense,
  Pronoun,
  WerdenContext,
  WerdenValidationResult,
  WerdenExercise,
  WarmupExercise,
  CentralExercise,
  NarrativeParagraph,
} from "./werden";

// ============================================================================
// TIPOS ESPECÍFICOS PARA TALLER DE WERDEN
// ============================================================================

/**
 * Variante completa de taller de werden
 */
export interface WerdenWorkshopVariant {
  workshopId: "werden";
  sections: {
    warmup: WarmupExercise[];
    central: CentralExercise[];
    narrative: NarrativeParagraph[];
  };
}

/**
 * Secciones de un taller de werden
 */
export interface WerdenWorkshopSections {
  warmup: WarmupExercise[];
  central: CentralExercise[];
  narrative: NarrativeParagraph[];
}

// ============================================================================
// TIPOS PARA WORKSHOP LOADER
// ============================================================================

/**
 * Definición de un taller en el registry
 */
export interface WorkshopDefinition {
  id: WorkshopId;
  hasVariants: boolean;
  variantCount: number;
  loaderFn: WorkshopVariantLoader<AnyWorkshopVariant>;
  vocabularyLoaderFn?: WorkshopVocabularyLoader;
}

/**
 * Loader genérico para variantes de workshop
 */
export type WorkshopVariantLoader<T extends AnyWorkshopVariant> = (
  workshopId: WorkshopId,
  variant: number
) => Promise<T>;

/**
 * Loader específico para vocabulario
 */
export type WorkshopVocabularyLoader = (
  workshopId: WorkshopId,
  variant: number
) => Promise<Record<string, unknown[]>>;

/**
 * Registry de talleres
 */
export type WorkshopRegistry = Record<WorkshopId, WorkshopDefinition>;

// ============================================================================
// UNION TYPES ACTUALIZADOS CON NUEVOS TALLERES
// ============================================================================

/**
 * Unión de todas las variantes de talleres incluyendo werden
 */
export type AnyWorkshopVariantExtended =
  | AnyWorkshopVariant
  | WerdenWorkshopVariant;

/**
 * Unión de todos los tipos de ejercicios incluyendo werden
 */
export type AnyExerciseExtended =
  | AnyExercise
  | WerdenExercise
  | WarmupExercise
  | CentralExercise;

/**
 * Unión de todos los tipos de contextos incluyendo werden
 */
export type AnyExerciseContextExtended = AnyExerciseContext | WerdenContext;

/**
 * Unión de todos los resultados de validación incluyendo werden
 */
export type AnyValidationResultExtended =
  | AnyValidationResult
  | WerdenValidationResult;

/**
 * Unión de todos los tipos de párrafos narrativos incluyendo werden
 */
export type AnyNarrativeParagraphExtended =
  | AnyNarrativeParagraph
  | NarrativeParagraph;

// ============================================================================
// TIPOS PARA ADAPTADORES
// ============================================================================

/**
 * Función adaptadora para convertir ejercicios específicos a base
 */
export type ExerciseAdapter<T extends AnyExercise> = (exercise: T) => {
  id: string;
  sentence: string;
  expectedAnswer: string;
  context: AnyExerciseContext;
};

/**
 * Función adaptadora para convertir contextos específicos a base
 */
export type ContextAdapter<T extends AnyExerciseContext> = (
  context: T
) => AnyExerciseContext;

/**
 * Función adaptadora para extraer contexto específico desde base
 */
export type ContextExtractor<T extends AnyExerciseContext> = (
  baseContext: AnyExerciseContext
) => T;

// ============================================================================
// ADAPTADORES ESPECÍFICOS PARA WERDEN
// ============================================================================

/**
 * Adaptador específico para ejercicios de werden
 */
export type WerdenExerciseAdapter = (exercise: WerdenExercise) => {
  id: string;
  sentence: string;
  expectedAnswer: string;
  context: WerdenContext;
};

/**
 * Adaptador específico para ejercicios de warmup de werden
 */
export type WerdenWarmupAdapter = (exercise: WarmupExercise) => {
  id: string;
  sentence: string;
  expectedAnswer: string;
  context: WerdenContext;
};

/**
 * Adaptador específico para ejercicios centrales de werden
 */
export type WerdenCentralAdapter = (exercise: CentralExercise) => {
  id: string;
  sentence: string;
  expectedAnswer: string;
  context: WerdenContext;
};

// ============================================================================
// TIPOS PARA VALIDADORES
// ============================================================================

/**
 * Función de validación genérica
 */
export type ValidationFunction<T extends AnyExerciseContext> = (
  answer: string,
  context: T
) => AnyValidationResult;

/**
 * Función generadora de hints
 */
export type HintGenerator<T extends AnyExerciseContext> = (
  context: T
) => string;

/**
 * Función para obtener respuesta correcta
 */
export type AnswerGetter<T extends AnyExerciseContext> = (context: T) => string;

/**
 * Interfaz común para validadores de workshop
 */
export interface WorkshopValidator<T extends AnyExerciseContext> {
  validate: ValidationFunction<T>;
  generateHint: HintGenerator<T>;
  getCorrectAnswer: AnswerGetter<T>;
}

// ============================================================================
// VALIDADORES ESPECÍFICOS PARA WERDEN
// ============================================================================

/**
 * Validador específico para ejercicios de werden
 */
export interface WerdenValidator {
  validate: (answer: string, context: WerdenContext) => WerdenValidationResult;
  generateHint: (context: WerdenContext) => string;
  getCorrectAnswer: (context: WerdenContext) => string;

  // Métodos específicos para werden
  validateFunction: (
    functionType: WerdenFunction,
    context: WerdenContext
  ) => boolean;
  validateTense: (tense: Tense, context: WerdenContext) => boolean;
  validatePronoun: (pronoun: Pronoun, context: WerdenContext) => boolean;
}

// ============================================================================
// TIPOS PARA COMPONENTES GENÉRICOS
// ============================================================================

/**
 * Props para componentes de ejercicios genéricos
 */
export interface GenericExerciseProps<T extends AnyExercise> {
  exercise: T;
  answer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onHint: () => void;
  onFill: () => void;
  disabled?: boolean;
  showAttempts?: boolean;
  attempts?: number;
}

/**
 * Props para secciones de ejercicios genéricas
 */
export interface GenericExerciseSectionProps<T extends AnyExercise> {
  sectionId: string;
  title: string;
  description: string;
  icon: string;
  workshopId: WorkshopId;
  loadExercises: (variant: number) => Promise<T[]>;
  renderExercise: (
    exercise: T,
    handlers: ExerciseHandlers<T>
  ) => React.ReactNode;
  validateFn: ValidationFunction<AnyExerciseContext>;
  getHintFn: HintGenerator<AnyExerciseContext>;
  getAnswerFn: AnswerGetter<AnyExerciseContext>;
  showDemo?: boolean;
  renderDemo?: () => React.ReactNode;
}

/**
 * Handlers para ejercicios
 */
export interface ExerciseHandlers<T extends AnyExercise> {
  onSubmit: (exercise: T) => AnyValidationResult;
  onHint: (exercise: T) => string;
  onFill: (exercise: T) => void;
  userAnswer: string;
  setAnswer: (answer: string) => void;
}

// ============================================================================
// COMPONENTES ESPECÍFICOS PARA WERDEN
// ============================================================================

/**
 * Props específicas para componentes de ejercicios de werden
 */
export interface WerdenExerciseProps {
  exercise: WerdenExercise;
  answer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onHint: () => void;
  onFill: () => void;
  disabled?: boolean;
  showAttempts?: boolean;
  attempts?: number;
  showFunctionOptions?: boolean;
  showTenseOptions?: boolean;
  showPronounOptions?: boolean;
}

/**
 * Props específicas para ejercicios de warmup de werden
 */
export interface WerdenWarmupProps {
  exercise: WarmupExercise;
  answer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onHint: () => void;
  onFill: () => void;
  disabled?: boolean;
  showAttempts?: boolean;
  attempts?: number;
}

/**
 * Props específicas para ejercicios centrales de werden
 */
export interface WerdenCentralProps {
  exercise: CentralExercise;
  answer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onHint: () => void;
  onFill: () => void;
  disabled?: boolean;
  showAttempts?: boolean;
  attempts?: number;
  showMultipleChoice?: boolean;
  showFunctionIdentification?: boolean;
}

/**
 * Props específicas para párrafos narrativos de werden
 */
export interface WerdenNarrativeProps {
  paragraph: NarrativeParagraph;
  onAnswerChange: (clozeId: string, answer: string) => void;
  onVerify: () => void;
  onHint: () => void;
  disabled?: boolean;
}

// ============================================================================
// TIPOS PARA HOOKS GENÉRICOS
// ============================================================================

/**
 * Configuración para useWorkshopExercises
 */
export interface UseWorkshopExercisesConfig<
  T extends AnyExercise,
  C extends AnyExerciseContext
> {
  workshopId: WorkshopId;
  sectionId: string;
  loader: WorkshopVariantLoader<AnyWorkshopVariant>;
  validator: ValidationFunction<C>;
  hintGenerator: HintGenerator<C>;
  answerGetter: AnswerGetter<C>;
  feedbackHandler: (result: AnyValidationResult) => void;
  contextExtractor: (exercise: T) => C;
}

/**
 * Retorno del hook useWorkshopExercises
 */
export interface UseWorkshopExercisesReturn<T extends AnyExercise> {
  // Estado
  exercises: T[];
  loading: boolean;
  answers: Record<string, string>;
  attempts: Record<string, number>;
  progress: {
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    hintsUsed: number;
  };

  // Acciones
  handleSubmit: (exercise: T) => AnyValidationResult;
  handleHint: (exercise: T) => string;
  handleFill: (exercise: T) => void;
  updateAnswer: (exerciseId: string, answer: string) => void;
  resetState: () => void;
}

// ============================================================================
// HOOKS ESPECÍFICOS PARA WERDEN
// ============================================================================

/**
 * Configuración específica para useWerdenExercises
 */
export interface UseWerdenExercisesConfig {
  workshopId: "werden";
  sectionId: string;
  loader: (variant: number) => Promise<WerdenWorkshopVariant>;
  validator: WerdenValidator;
  feedbackHandler: (result: WerdenValidationResult) => void;
}

/**
 * Retorno específico del hook useWerdenExercises
 */
export interface UseWerdenExercisesReturn {
  // Estado específico de werden
  warmupExercises: WarmupExercise[];
  centralExercises: CentralExercise[];
  narrativeParagraphs: NarrativeParagraph[];
  loading: boolean;
  answers: Record<string, string>;
  attempts: Record<string, number>;

  // Progreso específico
  progress: {
    warmupScore: number;
    centralScore: number;
    narrativeScore: number;
    overallScore: number;
    correctAnswers: number;
    totalQuestions: number;
    hintsUsed: number;
  };

  // Acciones específicas
  handleWarmupSubmit: (exercise: WarmupExercise) => WerdenValidationResult;
  handleCentralSubmit: (exercise: CentralExercise) => WerdenValidationResult;
  handleNarrativeVerify: () => void;
  handleHint: (exerciseId: string) => string;
  handleFill: (exerciseId: string) => void;
  updateAnswer: (exerciseId: string, answer: string) => void;
  resetState: () => void;
}

// ============================================================================
// TIPOS PARA CONFIGURACIÓN DE EJERCICIOS
// ============================================================================

/**
 * Configuración completa de un ejercicio
 */
export interface ExerciseConfig<
  T extends AnyExercise,
  C extends AnyExerciseContext
> {
  workshopId: WorkshopId;
  sectionId: string;
  title: string;
  description: string;
  icon: string;
  loader: WorkshopVariantLoader<AnyWorkshopVariant>;
  validator: ValidationFunction<C>;
  hintGenerator: HintGenerator<C>;
  answerGetter: AnswerGetter<C>;
  contextExtractor: (exercise: T) => C;
  sentenceExtractor: (exercise: T) => string;
  placeholderExtractor?: (exercise: T) => string;
  renderDemo?: () => React.ReactNode;
  renderExerciseMetadata?: (exercise: T, attempts?: number) => React.ReactNode;
}

/**
 * Factory para crear configuraciones de ejercicios
 */
export type ExerciseConfigFactory<
  T extends AnyExercise,
  C extends AnyExerciseContext
> = (config: ExerciseConfig<T, C>) => ExerciseConfig<T, C>;

// ============================================================================
// CONFIGURACIÓN ESPECÍFICA PARA WERDEN
// ============================================================================

/**
 * Configuración específica para ejercicios de werden
 */
export interface WerdenExerciseConfig {
  workshopId: "werden";
  sectionId: string;
  title: string;
  description: string;
  icon: string;
  loader: (variant: number) => Promise<WerdenWorkshopVariant>;
  validator: WerdenValidator;
  contextExtractor: (
    exercise: WerdenExercise | WarmupExercise | CentralExercise
  ) => WerdenContext;
  sentenceExtractor: (
    exercise: WerdenExercise | WarmupExercise | CentralExercise
  ) => string;
  placeholderExtractor?: (
    exercise: WerdenExercise | WarmupExercise | CentralExercise
  ) => string;
  renderDemo?: () => React.ReactNode;
  renderExerciseMetadata?: (
    exercise: WerdenExercise | WarmupExercise | CentralExercise,
    attempts?: number
  ) => React.ReactNode;

  // Configuraciones específicas por tipo de ejercicio
  warmupConfig?: {
    showFunctionHint?: boolean;
    showTenseHint?: boolean;
    showPronounHint?: boolean;
  };
  centralConfig?: {
    showMultipleChoice?: boolean;
    showFunctionIdentification?: boolean;
    allowMultipleAttempts?: boolean;
  };
  narrativeConfig?: {
    showContextualHints?: boolean;
    validateOnBlur?: boolean;
  };
}

// ============================================================================
// TIPOS PARA FEEDBACK Y TOASTS
// ============================================================================

/**
 * Handler de feedback genérico
 */
export type FeedbackHandler = (result: AnyValidationResult) => void;

/**
 * Handler de hints genérico
 */
export type HintHandler = (hint: string) => void;

/**
 * Factory para crear handlers de feedback
 */
export type FeedbackHandlerFactory = () => FeedbackHandler;

/**
 * Factory para crear handlers de hints
 */
export type HintHandlerFactory = () => HintHandler;

// ============================================================================
// FEEDBACK ESPECÍFICO PARA WERDEN
// ============================================================================

/**
 * Handler específico para feedback de werden
 */
export type WerdenFeedbackHandler = (result: WerdenValidationResult) => void;

/**
 * Handler específico para hints de werden
 */
export type WerdenHintHandler = (hint: string, context: WerdenContext) => void;

/**
 * Factory específica para crear handlers de feedback de werden
 */
export type WerdenFeedbackHandlerFactory = () => WerdenFeedbackHandler;

/**
 * Factory específica para crear handlers de hints de werden
 */
export type WerdenHintHandlerFactory = () => WerdenHintHandler;

// ============================================================================
// TIPOS PARA UTILIDADES DE EJERCICIOS
// ============================================================================

/**
 * Función para normalizar respuestas
 */
export type AnswerNormalizer = (answer: string) => string;

/**
 * Función para validar si una respuesta está vacía
 */
export type EmptyAnswerChecker = (answer: string) => boolean;

/**
 * Función para calcular progreso
 */
export type ProgressCalculator = (
  answers: Record<string, string>,
  totalExercises: number
) => {
  score: number;
  correctAnswers: number;
  completionRate: number;
  accuracy: number;
};

/**
 * Función para formatear feedback
 */
export type FeedbackFormatter = (result: AnyValidationResult) => string;

// ============================================================================
// UTILIDADES ESPECÍFICAS PARA WERDEN
// ============================================================================

/**
 * Función específica para normalizar respuestas de werden
 */
export type WerdenAnswerNormalizer = (
  answer: string,
  context: WerdenContext
) => string;

/**
 * Función específica para validar si una respuesta de werden está vacía
 */
export type WerdenEmptyAnswerChecker = (
  answer: string,
  context: WerdenContext
) => boolean;

/**
 * Función específica para calcular progreso de werden
 */
export type WerdenProgressCalculator = (
  answers: Record<string, string>,
  totalExercises: number,
  context: WerdenContext
) => {
  score: number;
  correctAnswers: number;
  completionRate: number;
  accuracy: number;
  functionAccuracy: Record<WerdenFunction, number>;
  tenseAccuracy: Record<Tense, number>;
};

/**
 * Función específica para formatear feedback de werden
 */
export type WerdenFeedbackFormatter = (
  result: WerdenValidationResult
) => string;

/**
 * Función específica para generar hints contextuales de werden
 */
export type WerdenContextualHintGenerator = (
  context: WerdenContext,
  attempt: number
) => string;

// ============================================================================
// NOTA: Los tipos se exportan automáticamente al ser declarados
// ============================================================================
