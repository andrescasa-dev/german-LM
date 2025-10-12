import { toast } from "sonner";
import React from "react";

export interface ToastConfig {
  title: string;
  description?: string | React.ReactNode;
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
    closeButton: true,
    actionButtonStyle: {
      backgroundColor: "#dd3c3c",
    },
  });
};

/**
 * Muestra un toast informativo
 */
export const showInfo = (config: ToastConfig) => {
  return toast.info(config.title, {
    description: config.description,
    duration: Infinity,
    closeButton: true,
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
  console.log("showIncorrectAnswer", explanation, example, markerInfo);

  // Si hay múltiples elementos, usar JSX para mejor formato
  if (example || markerInfo) {
    return showError({
      title: "Incorrecto",
      description: (
        <div className="space-y-2 text-sm">
          <p>{explanation}</p>
          {example && (
            <p className="text-green-700 dark:text-green-300">
              <strong>Ejemplo correcto: </strong>
              {example}
            </p>
          )}
          {markerInfo && <p className="text-muted-foreground">{markerInfo}</p>}
        </div>
      ),
    });
  }

  // Si solo hay explicación, usar string simple
  return showError({
    title: "Incorrecto",
    description: explanation,
  });
};

/**
 * Toast de pista
 */
export const showHintToast = (hint: string) => {
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
  console.log("showParagraphWithErrors", title, errors);
  return showError({
    title: `Párrafo "${title}" con errores`,
    description: (
      <ul className="list-disc list-inside space-y-2 text-sm [&_li]:ml-1.5">
        {errors.map((error, index) => (
          <li
            key={index}
            className="[&_strong]:font-bold [&_strong]:text-[hsl(357_100%_85.5%)]"
          >
            <span dangerouslySetInnerHTML={{ __html: error }} />
          </li>
        ))}
      </ul>
    ),
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
    description: (
      <ul className="list-disc list-inside space-y-2 text-sm [&_li]:ml-1.5">
        {hints.map((hint, index) => (
          <li
            key={index}
            className="[&_strong]:font-bold [&_strong]:text-[hsl(216_87%_70%)]"
          >
            <span dangerouslySetInnerHTML={{ __html: hint }} />
          </li>
        ))}
      </ul>
    ),
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
