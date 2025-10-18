"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ResourcesPreposicionesRecorridoList() {
  const resources = [
    {
      title: "📚 Gramática: Preposiciones de Recorrido y Orientación",
      description:
        "Guía completa de preposiciones de recorrido y orientación en alemán",
      items: [
        "durch - A través de (siempre Acusativo)",
        "um - Alrededor de (siempre Acusativo)",
        "am...vorbei - Pasar junto a (Dativo)",
        "bis zu - Hasta (Dativo)",
        "gegenüber von - Enfrente de (Dativo)",
      ],
    },
    {
      title: "🎯 Casos Gramaticales",
      description:
        "Los casos que rigen las preposiciones de recorrido y orientación",
      items: [
        "Acusativo: durch, um (recorrido fijo)",
        "Dativo: am...vorbei, bis zu, gegenüber von (locales específicas)",
        "Regla: Preposiciones de recorrido = Acusativo, Locales específicas = Dativo",
      ],
    },
    {
      title: "💡 Consejos de Uso",
      description:
        "Trucos para recordar las preposiciones de recorrido y orientación",
      items: [
        "durch = 'a través de' (movimiento a través de algo)",
        "um = 'alrededor de' (movimiento alrededor de algo)",
        "am...vorbei = 'pasar junto a' (pasar cerca de un punto de referencia)",
        "bis zu = 'hasta' (hasta un destino específico)",
        "gegenüber von = 'enfrente de' (posición relativa)",
      ],
    },
    {
      title: "🔍 Ejemplos Comunes",
      description:
        "Frases frecuentes con preposiciones de recorrido y orientación",
      items: [
        "Wir laufen durch den Park. (Corremos a través del parque.)",
        "Sie geht um die Stadt. (Ella camina alrededor de la ciudad.)",
        "Gehen Sie an der Kirche vorbei. (Pase junto a la iglesia.)",
        "Fahren Sie bis zum Bahnhof. (Conduzca hasta la estación.)",
        "Das Hotel ist gegenüber von der Post. (El hotel está enfrente del correo.)",
      ],
    },
    {
      title: "🗺️ Vocabulario de Orientación",
      description: "Sustantivos comunes para orientación en la ciudad",
      items: [
        "der Bahnhof - la estación de tren",
        "die Kirche - la iglesia",
        "die Post - el correo",
        "der Park - el parque",
        "die Stadt - la ciudad",
        "der Tunnel - el túnel",
        "die Brücke - el puente",
        "der Platz - la plaza",
        "die Ampel - el semáforo",
        "die Apotheke - la farmacia",
      ],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          📚 IV. Recursos: Preposiciones de Recorrido y Orientación
        </CardTitle>
        <CardDescription>
          Material de referencia y ejemplos para consolidar el aprendizaje
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {resources.map((resource, index) => (
          <div
            key={index}
            className="border border-border rounded-lg p-6 space-y-4"
          >
            <div>
              <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {resource.description}
              </p>
            </div>

            <ul className="space-y-2">
              {resource.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Sección de práctica adicional */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-3 text-blue-900 dark:text-blue-100">
            🎯 Práctica Adicional Recomendada
          </h3>
          <div className="space-y-3 text-sm">
            <p>
              <strong>1. Crear itinerarios:</strong> Practica escribiendo
              instrucciones para llegar a lugares usando las preposiciones de
              recorrido y orientación.
            </p>
            <p>
              <strong>2. Jugar a dar direcciones:</strong> Practica dando
              direcciones en alemán usando un mapa de la ciudad.
            </p>
            <p>
              <strong>3. Escuchar podcasts de viajes:</strong> Busca podcasts en
              alemán sobre viajes y orientación para familiarizarte con el uso
              natural de estas preposiciones.
            </p>
            <p>
              <strong>4. Leer guías turísticas:</strong> Lee guías turísticas en
              alemán y subraya las preposiciones de recorrido y orientación que
              encuentres.
            </p>
            <p>
              <strong>5. Conversación:</strong> Practica describir cómo llegar a
              lugares usando las preposiciones correctas.
            </p>
          </div>
        </div>

        {/* Nota final */}
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🎉</div>
          <p className="font-semibold text-green-900 dark:text-green-100">
            ¡Felicitaciones!
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Has completado el taller de preposiciones de recorrido y
            orientación. Continúa practicando para consolidar tu aprendizaje.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
