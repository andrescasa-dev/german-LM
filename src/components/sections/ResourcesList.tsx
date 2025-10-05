"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: "grammar" | "workbook" | "reading" | "test";
  level: string;
}

const RESOURCES: Resource[] = [
  {
    id: "res-1",
    title: "Deutsche Welle - Nicos Weg (A2-B1)",
    description:
      "Serie interactiva con ejercicios de gramática contextualizada",
    url: "https://learngerman.dw.com/de/nicos-weg/c-36519687",
    category: "grammar",
    level: "A2-B1",
  },
  {
    id: "res-2",
    title: "Schubert Verlag - Online Übungen",
    description: "Ejercicios gratuitos de declinación del adjetivo por nivel",
    url: "https://www.schubert-verlag.de/aufgaben/uebungen_a2/a2_uebungen_index.htm",
    category: "workbook",
    level: "A2",
  },
  {
    id: "res-3",
    title: "Lingolia - Deklination der Adjektive",
    description: "Explicación detallada con tablas y ejercicios interactivos",
    url: "https://deutsch.lingolia.com/de/grammatik/adjektive/deklination",
    category: "grammar",
    level: "A2-B1",
  },
  {
    id: "res-4",
    title: "Deutsch Perfekt - Übungsheft",
    description: "Revista con ejercicios de comprensión lectora nivel B1",
    url: "https://www.deutsch-perfekt.com/",
    category: "reading",
    level: "B1",
  },
  {
    id: "res-5",
    title: "Goethe Institut - Übungssätze B1",
    description: "Simulacros de examen B1 con sección de gramática",
    url: "https://www.goethe.de/de/spr/kup/prf/prf/gb1/ueb.html",
    category: "test",
    level: "B1",
  },
  {
    id: "res-6",
    title: "Easy Deutsch - Adjektivdeklination",
    description: "Explicaciones simplificadas con ejemplos visuales",
    url: "https://easy-deutsch.de/adjektive/adjektivdeklination/",
    category: "grammar",
    level: "A2-B1",
  },
  {
    id: "res-7",
    title: "Café Deutsch - Übungen",
    description: "Ejercicios prácticos con corrección automática",
    url: "http://www.cafe-deutsch.de/",
    category: "workbook",
    level: "A2-B1",
  },
  {
    id: "res-8",
    title: "Deutsch Lernen - Lesetexte A2/B1",
    description: "Textos graduados con ejercicios de comprensión",
    url: "https://deutsch-lernen.com/lesen/",
    category: "reading",
    level: "A2-B1",
  },
];

const CATEGORY_LABELS = {
  grammar: "📚 Gramática",
  workbook: "📝 Cuadernos",
  reading: "📖 Lecturas",
  test: "🎯 Simulacros",
};

export function ResourcesList() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [studyPlan, setStudyPlan] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Cargar favoritos desde sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("german-lm-favorites");
      if (stored) {
        try {
          setFavorites(new Set(JSON.parse(stored)));
        } catch {
          // Ignorar errores de parsing
        }
      }

      const storedPlan = sessionStorage.getItem("german-lm-study-plan");
      if (storedPlan) {
        setStudyPlan(storedPlan);
      }
    }
  }, []);

  // Guardar favoritos en sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "german-lm-favorites",
        JSON.stringify([...favorites])
      );
    }
  }, [favorites]);

  const toggleFavorite = (resourceId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(resourceId)) {
        newFavorites.delete(resourceId);
        toast.info("Recurso eliminado de favoritos");
      } else {
        newFavorites.add(resourceId);
        toast.success("Recurso añadido a favoritos ⭐");
      }
      return newFavorites;
    });
  };

  const savePlan = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("german-lm-study-plan", studyPlan);
      toast.success("Plan de estudio guardado", {
        description: "Tu plan se ha guardado en esta sesión.",
      });
    }
  };

  const filteredResources = selectedCategory
    ? RESOURCES.filter((r) => r.category === selectedCategory)
    : RESOURCES;

  const criteriaComplete = favorites.size > 0 && studyPlan.trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>IV. Recursos para Práctica Continua</CardTitle>
        <CardDescription>
          Material confiable A2–B1 para estudio autónomo
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Orientación */}
        <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-indigo-900 dark:text-indigo-100">
            💡 ¿Cómo elegir material?
          </h3>
          <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
            <li>
              <strong>Gramática:</strong> Para repasar reglas y ver más ejemplos
            </li>
            <li>
              <strong>Cuadernos:</strong> Para práctica intensiva con ejercicios
            </li>
            <li>
              <strong>Lecturas:</strong> Para aplicar en contexto real
            </li>
            <li>
              <strong>Simulacros:</strong> Para preparar exámenes oficiales B1
            </li>
          </ul>
        </div>

        {/* Filtros por categoría */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Todos
          </Button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(key)}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Lista de recursos */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="border border-border rounded-lg p-4 space-y-3 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">
                      {CATEGORY_LABELS[resource.category].split(" ")[0]}
                    </span>
                    <h4 className="font-semibold text-sm">{resource.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {resource.description}
                  </p>
                  <span className="inline-block text-xs bg-muted px-2 py-1 rounded">
                    {resource.level}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(resource.id)}
                  aria-label={
                    favorites.has(resource.id)
                      ? "Eliminar de favoritos"
                      : "Añadir a favoritos"
                  }
                >
                  {favorites.has(resource.id) ? "⭐" : "☆"}
                </Button>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visitar recurso →
                </a>
              </Button>
            </div>
          ))}
        </div>

        {/* Plan de estudio */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-lg mb-3">📅 Mi plan de práctica</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Describe brevemente cómo planeas usar estos recursos (20–30 min
            sugeridos):
          </p>
          <Input
            placeholder="Ej: Lunes y miércoles, 20 min de ejercicios de Schubert Verlag..."
            value={studyPlan}
            onChange={(e) => setStudyPlan(e.target.value)}
            className="mb-3"
            aria-label="Plan de estudio"
          />
          <Button onClick={savePlan} disabled={!studyPlan.trim()}>
            Guardar plan
          </Button>
        </div>

        {/* Favoritos seleccionados */}
        {favorites.size > 0 && (
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">
              ⭐ Mis favoritos ({favorites.size})
            </h4>
            <ul className="text-sm space-y-1">
              {RESOURCES.filter((r) => favorites.has(r.id)).map((r) => (
                <li key={r.id}>• {r.title}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Criterio de logro */}
        {criteriaComplete && (
          <div
            className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="text-4xl mb-2">🏅</div>
            <p className="font-semibold text-green-900 dark:text-green-100">
              ¡Sección completada!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Has seleccionado {favorites.size} recurso(s) y planificado tu
              práctica.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
