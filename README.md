# Renewly (RNProject)

Renewly es un micro-SaaS de seguimiento de membresías y suscripciones para negocios de servicio recurrente chicos: gimnasios, academias, clubes, retainers de servicios. El dueño registra a cada miembro con su plan, monto por ciclo, fecha de inicio y fecha de renovación, y Renewly calcula en tiempo real quién está por vencer (7/14/30 días), quién ya venció sin renovar, y quién tiene el pago pendiente. El panel muestra el ingreso recurrente estimado del mes y una lista priorizada de a quién contactar primero, ordenada por urgencia real (días vencido) y estado de pago — no por orden de captura.

> Nombre comercial: **Renewly** · Identificador técnico: `RNProject` · Identificador de portafolio: `RN2Prf` · Grado 2 (micro-SaaS)

## Qué hace

- **Alta de miembros**: nombre, plan, monto por ciclo, frecuencia de cobro (mensual/trimestral/semestral/anual), fecha de inicio, próxima renovación, estado de pago y contacto opcional.
- **Cálculo real de urgencia**: cada miembro se clasifica en `vencido`, `vence en 7 días`, `vence en 14 días`, `vence en 30 días` o `al día` a partir de la diferencia real en días entre hoy y su fecha de renovación (`lib/dates.ts`, `lib/status.ts`) — no hay estados simulados ni hardcodeados.
- **Lista priorizada**: "A quién contactar primero" ordena por un score real (más días vencido + pago pendiente pesa más), no por orden de alta.
- **Ingreso recurrente estimado**: normaliza el monto de cada miembro a su equivalente mensual (`monto / meses de frecuencia`) y lo suma — un anual y un mensual se comparan en la misma base.
- **Renovar ahora**: avanza la fecha de renovación desde la fecha vigente (o desde hoy si ya venció, para no arrastrar meses no cobrados) según la frecuencia del plan, y marca el pago como al día.
- **Filtros**: por estado de urgencia y por texto (nombre/plan).
- Editar y eliminar miembros existentes.

## El elemento de firma: el anillo de renovación

`components/RenewalRing.tsx` dibuja un anillo SVG por miembro que se llena según el avance real del ciclo de facturación (desde el inicio del ciclo hasta la fecha de renovación). El color codifica el estado, pero la urgencia nunca depende solo del color: un miembro vencido tiene el anillo completo *y* un punto sólido al centro, así que se lee de un vistazo incluso sin distinguir bien los colores. El mismo lenguaje visual (anillo abierto + flecha + punto) es la marca de Renewly en el header y el favicon.

## Paleta y tipografía

- **Ink** `#14231F`, **Parchment** `#FBF7EE` / `#EDE1C9`, **Renewal** `#2F6B4F` / `#1F4E38`, **Amber** `#D79A34` / `#8A5F1E`, **Ember** `#C1462B`, **Mist** `#7C8D84`.
- **Fraunces** (display, para títulos y cifras grandes) + **Inter** (texto de interfaz) + **IBM Plex Mono** (fechas y montos, para que los datos se lean como datos).

## Stack

Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS 4, React 19, lucide-react.

## Estructura

- `lib/types.ts` — modelo de dato `Member`.
- `lib/dates.ts` — matemática de fechas real: días entre fechas, suma de meses, progreso del ciclo.
- `lib/status.ts` — clasificación de urgencia y score de prioridad a partir de esas fechas.
- `lib/storage.ts` — persistencia en `localStorage`.
- `components/RenewalRing.tsx` — el anillo de renovación (elemento de firma).
- `components/RenewlyView.tsx` — orquestador principal: estadísticas, lista priorizada, filtros y CRUD.

## Por qué es honesto, no una demo

Este es un producto de un solo negocio por diseño: el dueño de un gimnasio o academia lleva su propia lista de miembros, no necesita sincronizar entre dispositivos de dos partes distintas. Por eso, igual que Stashline, Quorel o Ledgerly, Renewly usa `localStorage` — la decisión correcta de alcance para este caso de uso, no un atajo. Todas las fechas y cálculos de vencimiento son aritmética real sobre las fechas que el usuario ingresa; no hay estados de "vencido" o "por vencer" fijados a mano en los datos de ejemplo.

## Estado

Completo y funcional. Verificado con `tsc --noEmit`, `eslint` y `next build` limpios, y con pruebas end-to-end (alta de miembro con renovación próxima marcado como "por vencer", alta con fecha pasada marcado como "vencido", renovar, marcar pago, editar, eliminar, filtros, persistencia tras recargar).

## Pendientes

Ninguno bloqueante. Posibles mejoras futuras: recordatorios por email/WhatsApp, múltiples monedas, historial de pagos por miembro.
