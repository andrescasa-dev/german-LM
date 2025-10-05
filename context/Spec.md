# Objetivo 
Mejorar la experiencia de estudiantes de alemán con actividades interactivas y ejercicios contextualizados, alineados con MCER (A2.2–B1), siguiendo un enfoque comunicativo y asegurando que el alumno sea protagonista activo del aprendizaje.

---

## Alcance del taller base
Taller de consolidación intensiva sobre la Declinación del Adjetivo Alemán (reglas débil, mixta y fuerte) con cuatro bloques:
1) Repaso de tipos de declinación
2) Ejercicio central comparado (Acusativo Masculino)
3) Relato contextualizado (aplicación integrada)
4) Recursos para práctica continua

---

## Secciones extraídas (desde German_activity.md)
1. I. Repaso de los Tipos de Declinación
2. II. Ejercicio Central: Declinación comparada (Acusativo Masculino)
3. III. Ejercicio Interesante: Relato contextualizado
4. IV. Recursos para la práctica continua

---

## IDS: Información Descriptiva de Sección

### 1) Repaso de los Tipos de Declinación
- Objetivo: Distinguir cuándo aplica declinación débil, mixta o fuerte; comprender la “marca fuerte”.
- Contenidos clave: artículo definido (débil), indefinido/posesivos/kein (mixta), sin artículo (fuerte).
- Prerrequisitos: Casos (Nom/Acc/Dat), género y número; orden del verbo en subordinadas (recordatorio breve).
- Materiales: Tabla comparativa de reglas; ejemplos mínimos por caso; glosario.
- Duración sugerida: 8–12 min.
- Criterios de logro (B1): Identifica el marcador y selecciona correctamente la terminación del adjetivo en ≥80% de ejemplos guiados.

### 2) Ejercicio Central: Declinación comparada (Acusativo Masculino)
- Objetivo: Consolidar la selección de terminaciones en el punto de mayor confusión (Akk. Masc.).
- Contenidos clave: Adjetivo „neu“, sustantivo „Wagen“; tres escenarios (débil/mixta/fuerte) con apoyo visual.
- Interacción: Completar huecos + retroalimentación inmediata por intento.
- Materiales: 3 imágenes de apoyo; oraciones modelo; validación de entradas.
- Duración sugerida: 6–10 min.
- Criterios de logro: 3/3 ítems correctos con explicación comprendida (feedback leído/escuchado).

### 3) Relato contextualizado
- Objetivo: Aplicar débil/mixta/fuerte en contexto narrativo con mezcla de casos.
- Contenidos clave: Diario del explorador; huecos con adjetivos; pistas de caso por preposición/artículo.
- Interacción: Rellenar huecos; verificación progresiva por párrafo; pista opcional.
- Materiales: Ilustraciones (cabaña, interior, suministros); resaltado de marcadores.
- Duración sugerida: 12–18 min.
- Criterios de logro: ≥80% aciertos globales o mejora inter-intentos; uso correcto en Nom/Acc/Dat con y sin artículo.

### 4) Recursos para práctica continua
- Objetivo: Derivar a práctica autónoma con material confiable A2–B1.
- Contenidos: Listado curado (gramáticas, cuadernos, lecturas, simulacros B1).
- Interacción: Guardar favoritos; enlaces; registro de estudio (opcional).
- Duración sugerida: libre.
- Criterios de logro: Selecciona al menos un recurso y planifica práctica.

---

## Estrategia didáctica por sección (enfoque comunicativo, MCER B1)

### 1) Repaso
- Activación de conocimientos: micro-sondeo (2 ítems) para detectar concepciones previas.
- Presentación guiada: tabla „quién lleva la marca fuerte“ + 3 ejemplos contrastivos.
- Práctica controlada: 4 ítems de identificación de marcador (der/ein/—) y terminación.
- Micro-feedback: confirmación inmediata con explicación breve y ejemplo adicional.

### 2) Ejercicio central (Akk. Masc.)
- Demostración 1 ejemplo resuelto.
- Práctica por escenarios: débil → mixta → fuerte; una oración cada uno.
- Retroalimentación formativa: explica por qué la terminación cambia; referencia a la regla.
- Diferenciación: botón „pista“ muestra marcador y caso; „intento extra“ con variante léxica.

### 3) Relato contextualizado
- Lectura extensiva breve por párrafos; foco en pistas morfosintácticas (artículos, números, preposiciones).
- Relleno de huecos con validación por bloque; feedback específico por error (artículo vs. ausencia).
- Producción opcional: reescritura de 2 oraciones cambiando artículo para forzar regla distinta.
- Cierre: resumen de errores frecuentes y tabla de repaso personalizada.

### 4) Recursos
- Orientación: cómo elegir material por necesidad (gramática vs. lectura).
- Tarea autónoma: marcar 1–2 recursos; sugerencia de agenda de 20–30 min.

---

## Reglas de corrección y feedback
- Débil: artículo definido lleva marca fuerte; adjetivo en -e/-en según posición/plural.
- Mixta: ein/posesivos/kein no marcan en ciertos nominativo/acusativo; adjetivo asume marca fuerte allí, -en en resto.
- Fuerte: sin artículo, adjetivo marca completamente caso/género/número.
- Feedback siempre incluye: marcador identificado, caso detectado, terminación esperada, ejemplo correcto.

---

## Integración con React (estado independiente por sección)
- Componentes sugeridos:
  - `SectionIntro` (Repaso)
  - `ExerciseAkkusativMasculine`
  - `NarrativeCloze`
  - `ResourcesList`
- Estado por sección (aislado):
  - progreso, intentos, respuestas del usuario, feedback visible, pistas usadas.
  - no compartir estado entre secciones; levantar solamente eventos de telemetría.
- Props de accesibilidad: descripciones de imagen, roles y etiquetas para inputs, soporte teclado.
- Persistencia: opcional `sessionStorage` por sección con clave estable.

---

## UX: confirmaciones y microinteracciones
- Estados de carga: skeleton breve al cambiar de bloque.
- Confirmación de respuesta: tick verde con resumen; error con explicación y vibración sutil (reduce motion configurable).
- Pistas: botón muestra marcador/caso; contador de pistas usadas.
- Progreso: barra por sección; medalla al completar con ≥80%.
- Accesibilidad: contraste AA, focus visible, mensajes aria-live para feedback.

---

## Instrumentación y métricas (optativo)
- Tasa de acierto por sección, número de pistas, tiempo por ejercicio.
- Errores comunes por regla (débil/mixta/fuerte) para refuerzo adaptativo.

---

## Criterios de finalización del taller
- Repaso completado y comprendido (micro-sondeo correcto ≥2/3).
- Ejercicio central: 3/3 correctos o 2/3 con explicación vista.
- Relato: ≥80% aciertos o mejora entre intentos; dos reformulaciones opcionales correctas.
- Selección de al menos un recurso para estudio autónomo.

---

## Pendientes de implementación (no de contenido)
- Eliminar el código de ejemplo de Create Next App y dejar solo la estructura necesaria.
- Integrar los cuatro componentes con estado independiente y rutas/secciones claras.
- Añadir confirmaciones y microinteracciones descritas, con respeto de accesibilidad.

---

## Referencias base
- Actor_german_teacher.md (MCER B1, enfoque comunicativo, materiales)
- German_activity.md (contenido del taller, ejercicios y recursos)