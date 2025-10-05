## Criterios de Aceptación — Herramienta Interactiva (Next.js + Tailwind CSS)

Basado en `context/Spec.md`. Estos criterios son verificables y cubren funcionalidad, UX, accesibilidad, estado, rendimiento y despliegue. Se consideran cumplidos cuando todos los ítems están marcados.

---

### 1) Fundacionales del proyecto
- [x] `shadcn/ui` instalado y configurado (CLI) junto con Tailwind; componentes generados en `components/ui/*`.
- [x] Uso de primitives accesibles (Radix) vía `shadcn/ui` para UI base (Button, Input, Dialog, Tooltip, Toast).
- [x] Eliminado el boilerplate de Create Next App que no se utilice; solo estructura necesaria permanece.
- [x] Estructura de componentes creada: `SectionIntro`, `ExerciseAkkusativMasculine`, `NarrativeCloze`, `ResourcesList`.
- [x] Rutas/secciones claras y accesibles (ya sea por anclas en una sola página o subrutas), con navegación por teclado.

---

### 2) Estado y persistencia
- [x] Cada sección mantiene su estado de forma aislada: progreso, intentos, respuestas, feedback visible, pistas usadas.
- [x] No se comparte estado entre secciones; solo se emiten eventos/telemetría opcionales.
- [x] Reset de sección disponible (borra estado persistido de esa sección sin afectar a las demás).

---

### 3) Accesibilidad (A11y)
- [x] Contraste cumple WCAG 2.1 AA en todos los textos y controles.
- [x] Todos los inputs y botones tienen `label`/`aria-label` descriptivos y `role` apropiado si procede.
- [x] Focus visible en controles navegables; orden lógico de tabulación.
- [x] Feedback de validación y resultados anunciado con `aria-live` (polite o assertive según el caso).
- [x] Soporte teclado completo: activar botones, revelar pistas, enviar respuestas y navegar secciones sin ratón.
- [x] Componentes base emplean `shadcn/ui` (Radix) para asegurar roles/atributos ARIA y estados accesibles.

---

### 4) UX y microinteracciones
- [x] Skeleton de carga breve al cambiar de bloque/sección.
- [x] Confirmación de respuesta correcta: tick verde + breve resumen (incluye terminación esperada).
- [x] Error: explicación específica que indique marcador (artículo/ausencia), caso detectado y terminación correcta.
- [x] Botón "pista" por sección muestra marcador/caso; contador de pistas visibles y acumuladas.
- [x] Barra de progreso por sección; se otorga "medalla" al completar con ≥80%.
- [x] Toaster global (`shadcn/ui` Toast) para notificaciones no bloqueantes; anuncia por `aria-live`.

---

### 5) Reglas de corrección (débil/mixta/fuerte)
- [x] Implementadas reglas: 
  - Débil: artículo definido marca; adjetivo -e/-en según posición/plural.
  - Mixta: con ein/posesivos/kein, el adjetivo asume marca fuerte en nominativo/acusativo sing. cuando el determinante no marca.
  - Fuerte: sin artículo, el adjetivo porta la marca completa de caso/género/número.
- [x] Feedback incluye: marcador identificado, caso detectado, terminación esperada, ejemplo correcto.

---

### 6) Sección I — Repaso de los Tipos de Declinación
- [x] Micro-sondeo inicial de 2 ítems para activar conocimientos; resultados no bloquean el avance.
- [x] Presentación guiada: tabla "quién lleva la marca fuerte" + 3 ejemplos contrastivos.
- [x] Práctica controlada de 4 ítems: identificar marcador (der/ein/—) y terminación.
- [x] Micro-feedback inmediato por ítem con explicación breve y ejemplo adicional.
- [x] Criterio de logro cumplible: micro-sondeo correcto ≥2/3 registrado en estado de la sección.

---

### 7) Sección II — Ejercicio Central: Akkusativ Masculino
- [x] Demostración de 1 ejemplo resuelto antes de la práctica.
- [x] Tres escenarios secuenciales: débil → mixta → fuerte, cada uno con una oración.
- [x] Validación por intento con feedback formativo que explica por qué cambia la terminación y referencia a la regla.
- [x] Botón "pista" revela marcador y caso; "intento extra" con variante léxica disponible tras error.
- [x] Criterio de logro: 3/3 correctos o 2/3 con explicación vista (quedan registrados en estado).

---

### 8) Sección III — Relato Contextualizado (Cloze)
- [x] Relato por párrafos con huecos de adjetivos; pistas de caso por preposición/artículo/número.
- [x] Verificación progresiva por párrafo; feedback específico por error (artículo vs. ausencia y su impacto en la terminación).
- [x] Opción de pista por bloque (sin dar respuesta literal) que indica marcador/caso.
- [x] Producción opcional: 2 oraciones reescritas cambiando el artículo para forzar otra regla; validadas con la misma lógica.
- [x] Criterio de logro: ≥80% aciertos globales o mejora inter-intentos registrada.

---

### 9) Sección IV — Recursos para práctica continua
- [x] Lista curada A2–B1 con categorías (gramática, cuadernos, lecturas, simulacros B1) y enlaces.
- [x] El usuario puede "guardar favorito" (persistencia por sesión) y registrar una nota/plan breve.
- [x] Criterio de logro: el usuario selecciona al menos un recurso y planifica práctica.

---

### 10) Instrumentación y métricas (optativo)
- [x] Registro de tasa de acierto por sección, número de pistas usadas y tiempo por ejercicio.
- [x] Captura de errores comunes por regla (débil/mixta/fuerte) para refuerzo futuro.
- [x] La app funciona si la telemetría está desactivada; no bloquea ni degrada UX.

---

### 11) Rendimiento y calidad
- [x] TTI razonable (sin bloqueos en main thread); componentes pesados cargan de forma diferida si es necesario.
- [x] Imágenes optimizadas con `next/image` y textos alternativos adecuados.
- [x] Sin errores en consola durante uso normal.
- [x] Sin warnings de accesibilidad evidentes en herramientas básicas (e.g., Lighthouse/axe) en páginas clave.

---

### 12) Internacionalización y contenido
- [x] UI en español con contenidos en alemán/español según la actividad; copias revisadas.
- [x] No se requiere selector de idioma para la MVP salvo que se especifique; textos pasan por utilidades de i18n si existen.

---

### 13) Pruebas y verificación
- [x] Casos de prueba unitarios para la función de determinación de terminación del adjetivo (débil/mixta/fuerte) cubriendo bordes.
- [x] Pruebas de interacción básicas por sección (render, introducir respuesta, recibir feedback, usar pista, resetear sección).
- [x] Revisión manual de accesibilidad (teclado, focus, `aria-live`) en los cuatro componentes.

---

### 14) Criterios de finalización del taller (Definition of Done funcional)
- [x] Repaso: micro-sondeo ≥2/3 correcto registrado.
- [x] Ejercicio central: 3/3 correctos o 2/3 con explicación vista.
- [x] Relato: ≥80% aciertos globales o mejora entre intentos; producción opcional correcta en 2 oraciones.
- [x] Recursos: al menos un recurso seleccionado y plan de práctica guardado.
- [x] Se muestra medalla/completado cuando se cumplen los cuatro criterios; persistencia por sesión.

---

### 15) Entregables
- [x] Código en el repositorio con componentes declarados y estilos Tailwind.
- [x] Este documento (`Criterios_de_Aceptacion.md`) almacenado en `context/` y referenciado por el equipo.
- [x] README con instrucciones breves para ejecutar, construir y probar.


