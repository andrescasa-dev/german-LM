"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getVocabularyByVariant } from "@/lib/workshop-loader";
import { useVariant } from "@/hooks/useVariant";

export function ResourcesPreposicionesModalesList() {
  const { currentVariant } = useVariant();
  const [vocabulary, setVocabulary] = useState<Record<string, unknown[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVocabulary = async () => {
      setLoading(true);
      try {
        const data = await getVocabularyByVariant(
          "preposiciones-modales-relaciones",
          currentVariant
        );
        setVocabulary(data);
      } catch (error) {
        console.error("Failed to load vocabulary:", error);
        // Fallback to variant 1
        const data = await getVocabularyByVariant(
          "preposiciones-modales-relaciones",
          1
        );
        setVocabulary(data);
      } finally {
        setLoading(false);
      }
    };

    loadVocabulary();
  }, [currentVariant]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            📚 IV. Recursos: Preposiciones Modales y Relacionales
          </CardTitle>
          <CardDescription>
            Vocabulario y reglas para consolidar el aprendizaje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Cargando recursos...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          📚 IV. Recursos: Preposiciones Modales y Relacionales
        </CardTitle>
        <CardDescription>
          Vocabulario y reglas para consolidar el aprendizaje
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Preposiciones Modales */}
        {vocabulary.preposiciones_modales && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              🔗 Preposiciones Modales y Relacionales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(vocabulary.preposiciones_modales as any[]).map(
                (prep, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">
                        {prep.preposition}
                      </span>
                      <span className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                        {prep.case}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{prep.meaning}</p>
                      <p className="text-xs text-muted-foreground">
                        {prep.usage}
                      </p>
                    </div>
                    <div className="space-y-1">
                      {(prep.examples as string[]).map((example, exIndex) => (
                        <p
                          key={exIndex}
                          className="text-sm italic text-muted-foreground"
                        >
                          "{example}"
                        </p>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Verbos Fijos */}
        {vocabulary.verbos_fijos && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              🔄 Verbos con Preposición Fija (A2 → B1)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(vocabulary.verbos_fijos as any[]).map((verb, index) => (
                <div
                  key={index}
                  className="border border-border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{verb.verb}</span>
                    <span className="text-sm px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                      {verb.preposition} ({verb.case})
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{verb.meaning}</p>
                  </div>
                  <div className="space-y-1">
                    {(verb.examples as string[]).map((example, exIndex) => (
                      <p
                        key={exIndex}
                        className="text-sm italic text-muted-foreground"
                      >
                        "{example}"
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reglas de Caso */}
        {vocabulary.reglas_caso && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
              📋 Reglas de Caso Fijo
            </h3>
            <div className="space-y-3">
              {(vocabulary.reglas_caso as any[]).map((rule, index) => (
                <div
                  key={index}
                  className="border border-border rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{rule.rule}:</span>
                    <span className="text-sm px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                      {rule.prepositions.join(", ")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rule.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ejemplos Contextuales */}
        {vocabulary.ejemplos_contextuales && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
              💡 Ejemplos Contextuales
            </h3>
            <div className="space-y-3">
              {(vocabulary.ejemplos_contextuales as any[]).map(
                (example, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-lg p-4 space-y-2"
                  >
                    <p className="font-mono text-sm">"{example.sentence}"</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded">
                        {example.preposition} ({example.case})
                      </span>
                      <span className="text-muted-foreground">
                        {example.explanation}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Consejos de Estudio */}
        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
            🎯 Consejos para el Estudio Continuo
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Diferenciación del caso:</strong> Practica constantemente
              para distinguir entre preposiciones que rigen Dativo (mit) y las
              que rigen Acusativo (ohne, für, gegen).
            </p>
            <p>
              <strong>Memorización contextualizada:</strong> Memoriza las
              preposiciones con ejemplos clave como "Ich trinke meinen Kaffee
              ohne Milch" o "Wir spielen Fußball gegen unsere Freunde".
            </p>
            <p>
              <strong>Avance al B1:</strong> Al pasar al nivel B1, estudia los
              verbos que funcionan con preposición fija (como "sich
              interessieren für" o "diskutieren mit"), donde la preposición rige
              un caso inamovible.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
