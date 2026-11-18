# CheckPeso

Aplicación web ultraliviana para registro de peso, pensada para adultos mayores (Vue 3 + PWA).

Ver el plan completo y el estado de fases en [`PROYECTO.md`](./PROYECTO.md).

## Desarrollo

```bash
npm install
npm run dev
```

## Fases

1. Estructura base y vistas accesibles
2. Calendario reactivo (Mar/Vie + días extras)
3. Formulario Entrada / Salida
4. Offline-First (`localStorage`) + PWA ← **actual**

## PWA

```bash
npm run build
npm run preview
```

En un dispositivo o Chrome, usa “Instalar aplicación” / “Añadir a pantalla de inicio”. El Service Worker solo se activa en build/preview (no en `dev`).
