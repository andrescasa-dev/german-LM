"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import vocabularyData from "@/data/workshops/legacy_vocabulary.json";
import { useVariant } from "@/hooks/useVariant";
import { getVocabularyByVariant } from "@/lib/workshop-loader";

type VocabItem = {
  id: string;
  de: string; // German keyword (lemma or phrase)
  es: string; // Spanish translation
  note?: string; // Optional extra context
  tag?: string; // Optional tag/category
};

// Función para obtener vocabulario por módulo (fallback)
const getVocabularyByModule = (module: string): VocabItem[] => {
  const moduleData = vocabularyData[module as keyof typeof vocabularyData];
  return moduleData || [];
};

type ViewMode = "table" | "cards";

export function Vocabulary({
  items,
  module = "adjetivo",
  workshopId,
}: {
  items?: VocabItem[];
  module?: string;
  workshopId?: string;
}) {
  const [view, setView] = useState<ViewMode>("cards");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [showOthers, setShowOthers] = useState(false);
  const [variantVocab, setVariantVocab] = useState<VocabItem[]>([]);
  const [loading, setLoading] = useState(false);

  const { currentVariant } = useVariant();

  // Load vocabulary for current variant
  useEffect(() => {
    const loadVariantVocabulary = async () => {
      if (!workshopId || items?.length) return; // Skip if items are provided or no workshopId

      setLoading(true);
      try {
        const vocabData = await getVocabularyByVariant(
          workshopId,
          currentVariant
        );
        const moduleVocab = vocabData[module] || [];
        setVariantVocab(moduleVocab);
      } catch (error) {
        console.error("Error loading variant vocabulary:", error);
        // Fallback to general vocabulary
        setVariantVocab(getVocabularyByModule(module));
      } finally {
        setLoading(false);
      }
    };

    loadVariantVocabulary();
  }, [workshopId, currentVariant, module, items]);

  const vocab = useMemo(() => {
    if (items?.length) return items;
    if (variantVocab.length) return variantVocab;
    return getVocabularyByModule(module);
  }, [items, variantVocab, module]);

  const toggleReveal = (id: string) => {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderVocabularyContent = () => {
    const mainItems = vocab.slice(0, 6);
    const otherItems = vocab.slice(6);

    if (view === "table") {
      return (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <h4 className="font-semibold mb-2">Principal</h4>
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-left">Alemán</th>
                  <th className="border border-border p-3 text-left">
                    Español
                  </th>
                </tr>
              </thead>
              <tbody>
                {mainItems.map((v) => (
                  <tr key={v.id} className="hover:bg-muted/40">
                    <td className="border border-border p-3 font-medium">
                      {v.de}
                    </td>
                    <td className="border border-border p-3 text-muted-foreground">
                      {v.es}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {otherItems.length > 0 && (
            <div className="overflow-x-auto">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Otros</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOthers((v) => !v)}
                  aria-expanded={showOthers}
                  aria-controls="vocab-otros-tabla"
                >
                  {showOthers ? "Ocultar" : `Mostrar (${otherItems.length})`}
                </Button>
              </div>
              {showOthers && (
                <table
                  id="vocab-otros-tabla"
                  className="w-full border-collapse border border-border text-sm"
                >
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">
                        Alemán
                      </th>
                      <th className="border border-border p-3 text-left">
                        Español
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {otherItems.map((v) => (
                      <tr key={v.id} className="hover:bg-muted/40">
                        <td className="border border-border p-3 font-medium">
                          {v.de}
                        </td>
                        <td className="border border-border p-3 text-muted-foreground">
                          {v.es}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      );
    }

    // cards view
    return (
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2">Principal</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mainItems.map((v) => {
              const isRevealed = !!revealed[v.id];
              return (
                <button
                  key={v.id}
                  onClick={() => toggleReveal(v.id)}
                  className="text-left group rounded-lg border border-border p-4 hover:shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label={`Revelar traducción de ${v.de}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base font-semibold">{v.de}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {v.tag}
                      </div>
                    </div>
                    <span className="text-xl">{isRevealed ? "👀" : "✨"}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    {isRevealed ? (
                      <span className="font-medium">{v.es}</span>
                    ) : (
                      <span className="text-muted-foreground">
                        Toca para ver en español
                      </span>
                    )}
                  </div>
                  {v.note && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {v.note}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {otherItems.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Otros</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOthers((v) => !v)}
                aria-expanded={showOthers}
                aria-controls="vocab-otros-cards"
              >
                {showOthers ? "Ocultar" : `Mostrar (${otherItems.length})`}
              </Button>
            </div>
            {showOthers && (
              <div
                id="vocab-otros-cards"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {otherItems.map((v) => {
                  const isRevealed = !!revealed[v.id];
                  return (
                    <button
                      key={v.id}
                      onClick={() => toggleReveal(v.id)}
                      className="text-left group rounded-lg border border-border p-4 hover:shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                      aria-label={`Revelar traducción de ${v.de}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-base font-semibold">{v.de}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {v.tag}
                          </div>
                        </div>
                        <span className="text-xl">
                          {isRevealed ? "👀" : "✨"}
                        </span>
                      </div>
                      <div className="mt-2 text-sm">
                        {isRevealed ? (
                          <span className="font-medium">{v.es}</span>
                        ) : (
                          <span className="text-muted-foreground">
                            Toca para ver en español
                          </span>
                        )}
                      </div>
                      {v.note && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {v.note}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          📚 Vocabulario clave
          {workshopId && !items?.length && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              (Variante {currentVariant})
            </span>
          )}
        </CardTitle>
        <div className="mt-2">
          <div className="inline-flex rounded-md border border-border overflow-hidden">
            <Button
              variant={view === "cards" ? "default" : "ghost"}
              onClick={() => setView("cards")}
              className="rounded-none"
            >
              Tarjetas
            </Button>
            <Button
              variant={view === "table" ? "default" : "ghost"}
              onClick={() => setView("table")}
              className="rounded-none border-l border-border"
            >
              Tabla
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Cargando vocabulario...</div>
          </div>
        ) : (
          renderVocabularyContent()
        )}
      </CardContent>
    </Card>
  );
}

export default Vocabulary;
