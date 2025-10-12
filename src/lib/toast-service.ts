import { toast } from "sonner";

export interface ToastConfig {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Muestra un toast de éxito
 */
export const showSuccess = (config: ToastConfig) => {
  return toast.success(config.title, {
    description: config.description,
    duration: config.duration,
    action: config.action,
  });
};

/**
 * Muestra un toast de error
 */
export const showError = (config: ToastConfig) => {
  return toast.error(config.title, {
    description: config.description,
    duration: config.duration,
    action: config.action,
  });
};

/**
 * Muestra un toast informativo
 */
export const showInfo = (config: ToastConfig) => {
  return toast.info(config.title, {
    description: config.description,
    duration: config.duration,
    action: config.action,
  });
};

/**
 * Muestra un toast de advertencia
 */
export const showWarning = (config: ToastConfig) => {
  return toast.warning(config.title, {
    description: config.description,
    duration: config.duration,
    action: config.action,
  });
};

/**
 * Toast de respuesta correcta
 */
export const showCorrectAnswer = (explanation: string, markerInfo?: string) => {
  return showSuccess({
    title: "¡Correcto! ✓",
    description: markerInfo ? `${explanation}\n${markerInfo}` : explanation,
  });
};

/**
 * Toast de respuesta incorrecta
 */
export const showIncorrectAnswer = (
  explanation: string,
  example?: string,
  markerInfo?: string
) => {
  let description = explanation;
  if (example) description += `\nEjemplo correcto: ${example}`;
  if (markerInfo) description += `\n\n${markerInfo}`;

  return showError({
    title: "Incorrecto",
    description,
  });
};

/**
 * Toast de pista
 */
export const showHint = (hint: string) => {
  return showInfo({
    title: hint,
  });
};

/**
 * Toast de párrafo correcto
 */
export const showParagraphCorrect = (
  title: string,
  correctCount: number,
  totalCount: number
) => {
  return showSuccess({
    title: `¡Párrafo "${title}" correcto! ✓`,
    description: `${correctCount}/${totalCount} respuestas correctas.`,
  });
};

/**
 * Toast de párrafo con errores
 */
export const showParagraphWithErrors = (title: string, errors: string[]) => {
  return showError({
    title: `Párrafo "${title}" con errores`,
    description: errors.join("\n"),
    duration: Infinity,
    action: {
      label: "Cerrar",
      onClick: () => {},
    },
  });
};

/**
 * Toast de pistas para párrafo
 */
export const showParagraphHints = (title: string, hints: string[]) => {
  return showInfo({
    title: `Pistas para "${title}"`,
    description: hints.join("\n"),
    duration: 10000,
  });
};

/**
 * Toast de micro-sondeo completado
 */
export const showSurveyCompleted = (
  correct: number,
  total: number,
  percentage: number
) => {
  return showSuccess({
    title: `Micro-sondeo completado: ${correct}/${total} correctas (${percentage}%)`,
    description: "Ahora revisemos las reglas y practiquemos.",
  });
};

/**
 * Toast de intento extra
 */
export const showExtraAttempt = () => {
  return showInfo({
    title: "💪 Intento extra disponible",
    description: "Piensa en la regla: ¿quién lleva la marca fuerte aquí?",
  });
};

/**
 * Toast de favorito añadido
 */
export const showFavoriteAdded = () => {
  return showSuccess({
    title: "Recurso añadido a favoritos ⭐",
  });
};

/**
 * Toast de favorito eliminado
 */
export const showFavoriteRemoved = () => {
  return showInfo({
    title: "Recurso eliminado de favoritos",
  });
};
