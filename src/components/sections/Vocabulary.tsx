"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type VocabItem = {
  id: string;
  de: string; // German keyword (lemma or phrase)
  es: string; // Spanish translation
  note?: string; // Optional extra context
  tag?: string; // Optional tag/category
};

const DEFAULT_VOCAB: VocabItem[] = [
  { id: "wagen", de: "der Wagen", es: "el coche" },
  { id: "neu", de: "neu", es: "nuevo" },
  { id: "alt", de: "alt", es: "viejo" },
  { id: "dunkel", de: "dunkel", es: "oscuro" },
  { id: "licht", de: "das Licht", es: "la luz" },
  { id: "huette", de: "die Hütte", es: "la cabaña" },
  { id: "decke", de: "die Decke", es: "la manta" },
  { id: "brot", de: "das Brot", es: "el pan" },
  { id: "tisch", de: "der Tisch", es: "la mesa" },
  { id: "brief", de: "der Brief", es: "la carta" },
  { id: "wasser", de: "das Wasser", es: "el agua" },
  { id: "holz", de: "das Holz", es: "la madera" },
  { id: "schlafsack", de: "der Schlafsack", es: "el saco de dormir" },
  { id: "gut", de: "gut", es: "bueno" },
  { id: "trocken", de: "trocken", es: "seco" },
  { id: "warm", de: "warm", es: "caliente" },
  { id: "wichtig", de: "wichtig", es: "importante" },
  { id: "klein", de: "klein", es: "pequeño" },
  { id: "schwach", de: "schwach", es: "débil" },
];

type ViewMode = "table" | "cards";

export function Vocabulary({ items }: { items?: VocabItem[] }) {
  const [view, setView] = useState<ViewMode>("cards");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [showOthers, setShowOthers] = useState(false);

  const vocab = useMemo(() => (items?.length ? items : DEFAULT_VOCAB), [items]);

  const toggleReveal = (id: string) => {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>📚 Vocabulario clave</CardTitle>
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
        {(() => {
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
                        <th className="border border-border p-3 text-left">
                          Alemán
                        </th>
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
                        {showOthers
                          ? "Ocultar"
                          : `Mostrar (${otherItems.length})`}
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
                            <div className="text-base font-semibold">
                              {v.de}
                            </div>
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
                      {showOthers
                        ? "Ocultar"
                        : `Mostrar (${otherItems.length})`}
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
                                <div className="text-base font-semibold">
                                  {v.de}
                                </div>
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
        })()}
      </CardContent>
    </Card>
  );
}

export default Vocabulary;
