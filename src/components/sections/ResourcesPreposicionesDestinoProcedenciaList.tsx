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

export function ResourcesPreposicionesDestinoProcedenciaList() {
  const { currentVariant } = useVariant();
  const [vocabulary, setVocabulary] = useState<Record<string, unknown[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVocabulary = async () => {
      setLoading(true);
      try {
        const data = await getVocabularyByVariant(
          "preposiciones-destino-procedencia",
          currentVariant
        );
        setVocabulary(data);
      } catch (error) {
        console.error("Failed to load vocabulary:", error);
        // Fallback to variant 1
        const data = await getVocabularyByVariant(
          "preposiciones-destino-procedencia",
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
            📚 IV. Recursos: Preposiciones de Destino y Procedencia
          </CardTitle>
          <CardDescription>
            Vocabulario y recursos para las preposiciones de destino y
            procedencia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Cargando vocabulario...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const workshopVocabulary =
    vocabulary["preposiciones-destino-procedencia"] || [];

  // Categorizar vocabulario
  const prepositions = workshopVocabulary.filter(
    (item: { tag: string }) =>
      item.tag === "preposicion-local" ||
      item.tag === "preposicion-modal" ||
      item.tag === "preposicion-temporal"
  );
  const nouns = workshopVocabulary.filter(
    (item: { tag: string }) =>
      item.tag?.includes("sustantivo") || item.tag === "nombre-propio"
  );
  const pronouns = workshopVocabulary.filter((item: { tag: string }) =>
    item.tag?.includes("pronombre")
  );
  const articles = workshopVocabulary.filter(
    (item: { tag: string }) =>
      item.tag === "articulo" || item.tag === "contraccion"
  );
  const others = workshopVocabulary.filter(
    (item: { tag: string }) =>
      !item.tag?.includes("preposicion") &&
      !item.tag?.includes("sustantivo") &&
      !item.tag?.includes("pronombre") &&
      !item.tag?.includes("articulo") &&
      !item.tag?.includes("contraccion") &&
      item.tag !== "nombre-propio"
  );

  const renderVocabularySection = (
    title: string,
    items: {
      id: string;
      de: string;
      es: string;
      caso?: string;
      uso?: string;
    }[],
    icon: string
  ) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          {icon} {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map(
            (item: {
              id: string;
              de: string;
              es: string;
              caso?: string;
              uso?: string;
            }) => (
              <div
                key={item.id}
                className="bg-muted/50 rounded-lg p-3 border border-border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">{item.de}</p>
                    <p className="text-sm text-muted-foreground">{item.es}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {item.caso}
                    </p>
                    {item.uso && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.uso}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          📚 IV. Recursos: Preposiciones de Destino y Procedencia
        </CardTitle>
        <CardDescription>
          Vocabulario y recursos para las preposiciones de destino y procedencia
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Resumen teórico */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-3 text-blue-900 dark:text-blue-100">
            📖 Resumen Teórico: Preposiciones de Destino y Procedencia
          </h3>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  🎯 Preposiciones de Destino:
                </h4>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                  <li>
                    <strong>nach:</strong> Con nombres propios (países,
                    ciudades)
                  </li>
                  <li>
                    <strong>zu:</strong> Con nombres comunes (requiere
                    declinación)
                  </li>
                  <li>
                    <strong>zur:</strong> Contracción de zu + der
                  </li>
                  <li>
                    <strong>zum:</strong> Contracción de zu + dem
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  📍 Preposiciones de Procedencia:
                </h4>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                  <li>
                    <strong>aus:</strong> Desde, de (procedencia)
                  </li>
                  <li>
                    <strong>von:</strong> De, desde (origen o posesión)
                  </li>
                  <li>
                    <strong>vom:</strong> Contracción de von + dem
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                ⚠️ Regla importante:
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Todas estas preposiciones SIEMPRE rigen Dativo,
                independientemente del verbo.
              </p>
            </div>
          </div>
        </div>

        {/* Vocabulario categorizado */}
        <div className="space-y-6">
          {renderVocabularySection("Preposiciones", prepositions, "🔗")}
          {renderVocabularySection("Sustantivos y Lugares", nouns, "🏢")}
          {renderVocabularySection("Pronombres", pronouns, "👤")}
          {renderVocabularySection("Artículos y Contracciones", articles, "📝")}
          {renderVocabularySection("Otros", others, "📚")}
        </div>

        {/* Consejos de uso */}
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-3 text-green-900 dark:text-green-100">
            💡 Consejos de Uso
          </h3>
          <div className="space-y-3 text-sm text-green-700 dark:text-green-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Para Destino:</h4>
                <ul className="space-y-1">
                  <li>
                    • Usa <strong>nach</strong> con países y ciudades
                  </li>
                  <li>
                    • Usa <strong>zu</strong> con lugares específicos
                  </li>
                  <li>• Recuerda las contracciones: zum, zur</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Para Procedencia:</h4>
                <ul className="space-y-1">
                  <li>
                    • Usa <strong>aus</strong> para procedencia física
                  </li>
                  <li>
                    • Usa <strong>von</strong> para origen o posesión
                  </li>
                  <li>• Recuerda la contracción: vom</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
