# Guía de Variables CSS - Colores

Este documento explica cómo usar las variables CSS para cambiar los colores de toda la aplicación desde un solo lugar.

## Ubicación del archivo

Las variables CSS se encuentran en: `src/styles/variables.css`

## Cómo cambiar los colores

Para cambiar el color principal de toda la aplicación, simplemente modifica el valor de `--color-primary` en el archivo `variables.css`:

```css
:root {
  --color-primary: #39a900;  /* Cambia este valor para cambiar el color principal */
  --color-primary-dark: #2d7d00;
  --color-primary-light: #5ccb5f;
  /* ... */
}
```

## Variables disponibles

### Colores Principales
- `--color-primary`: Color principal (#39a900)
- `--color-primary-dark`: Versión oscura (#2d7d00)
- `--color-primary-light`: Versión clara (#5ccb5f)
- `--color-primary-lighter`: Versión más clara (#5EB930)
- `--color-primary-hover`: Color para hover (#2E8700)

### Colores Secundarios
- `--color-secondary`: Color secundario (#44b900)

### Colores de Texto
- `--color-text-primary`: Texto principal (#333)
- `--color-text-secondary`: Texto secundario (#666)
- `--color-text-light`: Texto claro (#888)
- `--color-text-white`: Texto blanco (#ffffff)

### Colores de Fondo
- `--color-bg-primary`: Fondo principal (#ffffff)
- `--color-bg-secondary`: Fondo secundario (#f5f5f5)
- `--color-bg-light`: Fondo claro (#f8faf8)
- `--color-bg-hover`: Fondo hover con transparencia
- `--color-bg-active`: Fondo activo con transparencia

### Colores de Borde
- `--color-border-primary`: Borde principal
- `--color-border-light`: Borde claro (#e0e0e0)

### Colores de Estado
- `--color-success`: Éxito (#2e7d32)
- `--color-error`: Error (#c62828)
- `--color-warning`: Advertencia (#e65100)
- `--color-info`: Información (#1565c0)

### Gradientes
- `--gradient-primary`: Gradiente horizontal principal
- `--gradient-primary-vertical`: Gradiente vertical
- `--gradient-primary-diagonal`: Gradiente diagonal
- `--gradient-primary-dark`: Gradiente oscuro

## Uso en los archivos

### En CSS/SCSS
```css
.mi-clase {
  background-color: var(--color-primary);
  color: var(--color-text-white);
  border: 2px solid var(--color-border-primary);
}
```

### En estilos inline (Vue)
```vue
<div :style="{ backgroundColor: 'var(--color-primary)' }">
  Contenido
</div>
```

### En componentes Quasar
```vue
<q-btn color="primary" />  <!-- Usa el color primary de Quasar -->
```

## Archivos que ya usan variables

Los siguientes archivos ya han sido actualizados para usar variables CSS:

✅ `src/views/Login.vue`
✅ `src/layouts/MainLayout.vue`
✅ `src/components/cards/StatsCard.vue`
✅ `src/components/modals/modalComponent.vue`

## Archivos pendientes de actualizar

Los siguientes archivos aún tienen colores hardcodeados y deben ser actualizados:

- `src/views/aprendiz/ChangePassword.vue`
- `src/views/aprendiz/NewPassword.vue`
- `src/views/aprendiz/EnterPasswordCode.vue`
- `src/views/aprendiz/PersonalData.vue`
- `src/views/admin/Companies.vue`
- `src/views/admin/Apprentices.vue`
- `src/views/admin/AdminNews.vue`
- `src/views/admin/Instructors.vue`
- `src/views/instructor/News.vue`
- `src/views/instructor/Followups.vue`
- `src/views/aprendiz/Logbooks.vue`

## Ejemplo de reemplazo

**Antes:**
```css
.header {
  background-color: #39a900;
  color: #ffffff;
  border: 2px solid #39a900;
}
```

**Después:**
```css
.header {
  background-color: var(--color-primary);
  color: var(--color-text-white);
  border: 2px solid var(--color-border-primary);
}
```

## Beneficios

1. **Cambio centralizado**: Modifica los colores en un solo lugar
2. **Consistencia**: Todos los componentes usan los mismos colores
3. **Mantenibilidad**: Fácil de actualizar y mantener
4. **Temas**: Facilita la implementación de temas dark/light en el futuro

