/**
 * Componente funcional reutilizable para renderizado de ejercicios
 * Principios: Single Responsibility, Open/Closed, Composición
 */

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lightbulb, Wand2, Send } from "lucide-react";

// Tipos funcionales puros
interface ExerciseRendererProps<T> {
  exercise: T;
  answer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onHint: () => void;
  onFill: () => void;
  sentenceExtractor: (exercise: T) => string;
  placeholderExtractor?: (exercise: T) => string;
  disabled?: boolean;
}

/**
 * Componente funcional puro para renderizar un ejercicio
 * Abierto para extensión (props funcionales), cerrado para modificación
 */
export function ExerciseRenderer<T>({
  exercise,
  answer,
  onAnswerChange,
  onSubmit,
  onHint,
  onFill,
  sentenceExtractor,
  placeholderExtractor = () => "Escribe aquí...",
  disabled = false,
}: ExerciseRendererProps<T>) {
  // Composición funcional: extraer datos usando funciones puras
  const sentence = sentenceExtractor(exercise);
  const placeholder = placeholderExtractor(exercise);

  // Handler funcional puro
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="space-y-4">
      {/* Sentencia del ejercicio */}
      <div className="text-lg font-medium text-foreground">{sentence}</div>

      {/* Input de respuesta */}
      <Input
        type="text"
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="text-lg"
        aria-label="Respuesta del ejercicio"
      />

      {/* Botones de acción - Composición funcional */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={onSubmit}
          disabled={disabled || !answer.trim()}
          className="flex-1 md:flex-none"
        >
          <Send className="h-4 w-4 mr-2" />
          Enviar
        </Button>

        <Button
          variant="outline"
          onClick={onHint}
          disabled={disabled}
          className="flex-1 md:flex-none"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Pista
        </Button>

        <Button
          variant="secondary"
          onClick={onFill}
          disabled={disabled}
          className="flex-1 md:flex-none"
        >
          <Wand2 className="h-4 w-4 mr-2" />
          Rellenar
        </Button>
      </div>
    </div>
  );
}

/**
 * HOC funcional para agregar metadatos al ejercicio
 * Principio Open/Closed: extensible sin modificar el componente base
 */
export function withExerciseMetadata<T>(Component: typeof ExerciseRenderer) {
  return function ExerciseWithMetadata(
    props: ExerciseRendererProps<T> & {
      showAttempts?: boolean;
      attempts?: number;
    }
  ) {
    return (
      <div className="space-y-2">
        {props.showAttempts && props.attempts !== undefined && (
          <div className="text-sm text-muted-foreground">
            Intentos: {props.attempts}
          </div>
        )}
        <Component {...props} />
      </div>
    );
  };
}
