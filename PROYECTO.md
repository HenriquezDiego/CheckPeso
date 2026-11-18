# CheckPeso — Contexto del Proyecto

Aplicación web ultraliviana, minimalista y accesible para registro de peso, orientada a personas mayores. Construida con **Vue 3 (Composition API)** y preparada para PWA / Offline-First.

---

## Principios de UX (adulto mayor)

- Botones grandes, tipografía grande, alto contraste.
- Cero distracciones: sin ruido visual, sin animaciones innecesarias.
- Flujos cortos y claros.
- Si hoy es **martes o viernes** y faltan datos → abrir directo la pantalla grande de registro.
- Si no → mostrar el calendario interactivo.

---

## Regla de entrega: Desarrollo Incremental por Commits

**No entregar todo el código de golpe.** Construir paso a paso, probar cada módulo y hacer commits limpios en Git en cada etapa.

En cada turno:
1. Entregar **únicamente** el código de la fase actual.
2. Explicar qué archivos crear o modificar.
3. Indicar cuándo está listo para commit y pasar a la siguiente fase.

---

## Fases de desarrollo

### Fase 1 — Estructura base y vistas accesibles
- Configuración del proyecto Vue 3 + Vite.
- Layout accesible (tipografía grande, contraste, botones grandes).
- Vistas esqueleto: Home / Calendario / Registro.
- Estilos globales y tokens de accesibilidad.
- Sin lógica de calendario real ni persistencia aún.

### Fase 2 — Calendario reactivo
- Calendario mensual interactivo.
- Días oficiales **Martes** y **Viernes** priorizados y marcados en grande.
- Días extras (cualquier otro día con registro) resaltados con color distinto.
- Navegación mes anterior / siguiente.

### Fase 3 — Formulario de doble registro Entrada / Salida
- Pantalla grande de registro.
- Campos: peso de **Entrada** y peso de **Salida** (días oficiales).
- Siempre Entrada + Salida (también en días extras); se pueden guardar por separado.
- Validación accesible (mensajes claros, foco visible).

### Fase 4 — Almacenamiento Offline-First y PWA
- Guardado inmediato en `localStorage`.
- Estructura de datos lista para sincronizar con Supabase o Google Sheets.
- Manifest + Service Worker (PWA básica).
- Lógica de enrutado inteligente según día y datos faltantes.

### Fase 5 — Respaldo JSON local *(actual)*
- Exportar / importar copia de seguridad en JSON bien estructurado.
- Formato portable (lista `entries`) listo para sync futuro.
- Confirmación clara al reemplazar datos al cargar.

---

## Requerimientos funcionales (proyecto completo)

1. **Días oficiales de control (Martes y Viernes)**  
   Priorizados y marcados en grande en el calendario mensual. Permiten doble registro: peso de "Entrada" y peso de "Salida".

2. **Flexibilidad para días extras**  
   Si se registra peso cualquier otro día (ej. miércoles), la app lo permite (también con Entrada y Salida) y lo resalta en el calendario con un color distinto al de los días oficiales.

3. **Almacenamiento Offline-First**  
   Guardado inmediato en `localStorage` para funcionar sin internet. Estructura de datos preparada para sincronizar con Supabase o Google Sheets más adelante.

4. **UX para adulto mayor**  
   Si hoy es martes o viernes y faltan datos → pantalla grande de registro. Si no → calendario interactivo.

---

## Stack técnico previsto

| Área | Tecnología |
|------|------------|
| Framework | Vue 3 + Composition API (`<script setup>`) |
| Build | Vite |
| Routing | Vue Router |
| Estilos | CSS nativo (variables CSS, sin frameworks pesados) |
| Persistencia (Fase 4) | `localStorage` (+ schema sync-ready) |
| PWA (Fase 4) | `vite-plugin-pwa` o manifest + SW manual |
| Sync futuro | Supabase o Google Sheets (no en Fase 1–4 core) |

---

## Modelo de datos / JSON de respaldo

```json
{
  "app": "CheckPeso",
  "schemaVersion": 1,
  "exportedAt": "2026-11-18T02:00:00.000Z",
  "meta": {
    "entryCount": 1,
    "dateFrom": "2026-11-18",
    "dateTo": "2026-11-18",
    "storeVersion": 1
  },
  "entries": [
    {
      "id": "uuid",
      "date": "2026-11-18",
      "dayType": "official",
      "entradaKg": 72.5,
      "salidaKg": 71.8,
      "synced": false,
      "updatedAt": "2026-11-18T15:30:00.000Z"
    }
  ]
}
```

```ts
type WeightEntry = {
  id: string
  date: string // YYYY-MM-DD
  dayType: 'official' | 'extra'
  entradaKg: number | null
  salidaKg: number | null
  synced: boolean
  updatedAt: string // ISO
}
```

---

## Paleta / tokens de accesibilidad (Fase 1)

- Fondo: `#F7F7F2` (claro, suave)
- Texto principal: `#1A1A1A` (alto contraste)
- Acento oficial (Mar/Vie): `#C62828` (rojo + icono gota)
- Botón primario UI: `#0B5FFF` (azul)
- Acento día extra: `#C45C26` (naranja/terracota diferenciador)
- Éxito / completo: `#1B7F4A`
- Botones: altura mínima ~56–64px, texto ≥ 1.25rem
- Focus visible: outline grueso y contrastado

---

## Commits sugeridos por fase

1. `chore: scaffold Vue 3 app with accessible base layout`
2. `feat: interactive monthly calendar with official and extra days`
3. `feat: large entry/exit weight registration form`
4. `feat: offline-first localStorage persistence and basic PWA`
5. `feat: structured JSON backup export and import`

---

## Estado actual

- [x] Documento de contexto (`PROYECTO.md`)
- [x] Fase 1 — Estructura base y vistas accesibles
- [x] Fase 2 — Calendario reactivo
- [x] Fase 3 — Formulario Entrada/Salida
- [x] Fase 4 — Offline-First + PWA
- [x] Fase 5 — Respaldo JSON local *(lista para commit)*
