"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ResourcesPreposicionesList() {
  const resources = [
    {
      title: "📚 Gramática: Preposiciones Temporales",
      description: "Guía completa de preposiciones temporales en alemán",
      items: [
        "um - Para horas específicas (um 8 Uhr)",
        "am - Para días, momentos del día, fechas (am Montag, am Morgen)",
        "im - Para meses y estaciones (im Mai, im Sommer)",
        "seit - Para duración desde el pasado (seit drei Jahren)",
        "nach - Para secuencia temporal (nach dem Unterricht)",
        "bis - Para límite temporal (bis Freitag)",
        "von... bis - Para período completo (von 9 bis 17 Uhr)",
      ],
    },
    {
      title: "🎯 Casos Gramaticales",
      description: "Los casos que rigen las preposiciones temporales",
      items: [
        "Acusativo: um, bis",
        "Dativo: am, im, seit, nach, von",
        "Regla: La mayoría de preposiciones temporales rigen dativo",
      ],
    },
    {
      title: "💡 Consejos de Uso",
      description: "Trucos para recordar las preposiciones temporales",
      items: [
        "um = 'a las' (hora específica)",
        "am = 'en el' (día/momento específico)",
        "im = 'en el' (período largo: mes/estación)",
        "seit = 'desde hace' (duración)",
        "nach = 'después de' (secuencia)",
        "bis = 'hasta' (límite)",
        "von... bis = 'de... a' (período completo)",
      ],
    },
    {
      title: "🔍 Ejemplos Comunes",
      description: "Frases frecuentes con preposiciones temporales",
      items: [
        "Ich stehe um 7 Uhr auf. (Me levanto a las 7.)",
        "Am Montag arbeite ich. (El lunes trabajo.)",
        "Im Sommer ist es warm. (En verano hace calor.)",
        "Ich lerne seit zwei Jahren Deutsch. (Aprendo alemán desde hace dos años.)",
        "Nach dem Essen gehe ich spazieren. (Después de comer voy a pasear.)",
        "Das Geschäft ist bis 18 Uhr geöffnet. (La tienda está abierta hasta las 18.)",
        "Ich arbeite von 9 bis 17 Uhr. (Trabajo de 9 a 17 horas.)",
      ],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>📚 IV. Recursos: Preposiciones Temporales</CardTitle>
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
              <strong>1. Crear frases propias:</strong> Practica escribiendo
              frases sobre tu rutina diaria usando diferentes preposiciones
              temporales.
            </p>
            <p>
              <strong>2. Escuchar podcasts:</strong> Busca podcasts en alemán
              para familiarizarte con el uso natural de las preposiciones
              temporales.
            </p>
            <p>
              <strong>3. Leer textos:</strong> Lee artículos o historias cortas
              en alemán y subraya las preposiciones temporales que encuentres.
            </p>
            <p>
              <strong>4. Conversación:</strong> Practica describir tu día usando
              las preposiciones temporales correctas.
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
            Has completado el taller de preposiciones temporales. Continúa
            practicando para consolidar tu aprendizaje.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
