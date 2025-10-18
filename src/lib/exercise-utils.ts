/**
 * Utilidades compartidas para ejercicios de talleres
 * Funciones comunes extraídas de los componentes específicos
 */

import type { BaseUserAnswer, BaseProgress } from "@/types/workshop-base";

/**
 * Normaliza una respuesta del usuario para comparación
 */
export function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase();
}

/**
 * Calcula el progreso basado en las respuestas del usuario
 */
export function calculateProgress(
  answers: BaseUserAnswer[],
  totalQuestions: number
): Pick<BaseProgress, "correctAnswers" | "score" | "completed"> {
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const score = Math.round((correctCount / totalQuestions) * 100);
  const completed = score >= 80;

  return {
    correctAnswers: correctCount,
    score,
    completed,
  };
}

/**
 * Formatea el feedback de un resultado de validación
 */
export function formatFeedback(result: {
  isCorrect: boolean;
  explanation: string;
  example?: string;
  markerInfo?: string;
}): string {
  let feedback = result.explanation;

  if (result.example) {
    feedback += `\n\nEjemplo: ${result.example}`;
  }

  if (result.markerInfo) {
    feedback += `\n\n${result.markerInfo}`;
  }

  return feedback;
}

/**
 * Maneja eventos de teclado comunes para ejercicios
 */
export function handleKeyPress(
  event: React.KeyboardEvent,
  onSubmit: () => void,
  onEscape?: () => void
): void {
  if (event.key === "Enter") {
    event.preventDefault();
    onSubmit();
  }

  if (event.key === "Escape" && onEscape) {
    event.preventDefault();
    onEscape();
  }
}

/**
 * Genera un ID único para ejercicios
 */
export function generateExerciseId(prefix: string, index: number): string {
  return `${prefix}-${index}`;
}

/**
 * Valida si una respuesta está vacía o solo contiene espacios
 */
export function isEmptyAnswer(answer: string): boolean {
  return !answer || answer.trim().length === 0;
}

/**
 * Calcula estadísticas de una sección
 */
export function calculateSectionStats(answers: BaseUserAnswer[]) {
  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const incorrect = total - correct;
  const totalAttempts = answers.reduce((sum, a) => sum + a.attempts, 0);
  const totalHints = answers.reduce((sum, a) => sum + a.hintsUsed, 0);

  return {
    total,
    correct,
    incorrect,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    averageAttempts:
      total > 0 ? Math.round((totalAttempts / total) * 10) / 10 : 0,
    totalHints,
  };
}

/**
 * Formatea tiempo transcurrido desde una fecha
 */
export function formatTimeElapsed(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return "hace menos de 1 minuto";
  if (diffMins < 60) return `hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24)
    return `hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;

  const diffDays = Math.floor(diffHours / 24);
  return `hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
}

/**
 * Genera un mensaje de motivación basado en el progreso
 */
export function getMotivationalMessage(score: number): string {
  if (score >= 90) return "¡Excelente! Dominas perfectamente este tema.";
  if (score >= 80) return "¡Muy bien! Has alcanzado el objetivo.";
  if (score >= 70) return "¡Bien! Estás cerca del objetivo.";
  if (score >= 60) return "¡Sigue practicando! Estás mejorando.";
  if (score >= 50) return "¡No te rindas! Cada intento te acerca al éxito.";
  return "¡Ánimo! La práctica hace al maestro.";
}

/**
 * Valida formato de email (para futuras funcionalidades)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitiza texto para prevenir XSS
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Debounce function para optimizar llamadas frecuentes
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function para limitar frecuencia de ejecución
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Clona un objeto profundamente
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array)
    return obj.map((item) => deepClone(item)) as unknown as T;
  if (typeof obj === "object") {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}

/**
 * Genera un hash simple para strings
 */
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}
