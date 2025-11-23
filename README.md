# Chaud & Glacé

Sitio web oficial para Chaud & Glacé (Heladería y Cafetería). Proyecto desarrollado con el framework Astro. El objetivo es presentar el menú completo, la sección 'Sobre Nosotros' y facilitar pedidos o encargos a través de un formulario de contacto.

## 📋 Estructura del Proyecto

```
Heladeria/
├── src/
│   ├── components/
│   │   ├── Header.astro          # Encabezado con logo y menú
│   │   ├── Footer.astro          # Pie de página
│   │   ├── ProductMenu.astro     # Menú de productos
│   │   └── ContactForm.astro     # Formulario de contacto
│   └── pages/
│       └── index.astro           # Página principal
└── public/
    ├── products/                 # Imágenes de productos
    ├── background.jpg            # Imagen de fondo del hero
    ├── about-image.jpg           # Imagen para "Sobre Nosotros"
    └── logo.png                  # Logo de Chaud & Glace
```
## 🚀 Cómo Ejecutar el Proyecto

1. **Instalar dependencias** (si no lo has hecho):
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**:
   - El sitio estará disponible en: `http://localhost:4321`

## ✨ Características Implementadas

### ✅ Header (Encabezado)
- Logo de Chaud & Glace con texto "Chaud & Glace - Dulce Vida"
- Menú de navegación: Inicio, Sobre Nosotros, Menú, Contacto
- Botón "Llámanos" que enlaza al teléfono 2454522978
- Diseño responsive con menú hamburguesa en móviles

### ✅ Sección Hero (Inicio)
- Imagen de fondo atractiva
- Título principal con gradiente
- Botones de llamada a la acción
- Animaciones suaves

### ✅ Sección "Sobre Nosotros"
- Párrafo descriptivo sobre el negocio
- Diseño de dos columnas con imagen
- Estadísticas destacadas

### ✅ Menú de Productos
- 6 productos de ejemplo con:
  - Nombre del producto
  - Descripción
  - Ingredientes
  - Tamaño
  - Precio
  - Imagen
  - Botón "Ordenar Ahora"
- Diseño en grid responsive (1-3 columnas según pantalla)
- Efectos hover atractivos

### ✅ Formulario de Contacto
- Campos solicitados:
  - Nombre del cliente
  - Productos y cantidad
  - Teléfono
  - Dirección de entrega
  - Mensaje adicional
- Botón "Enviar" que abre WhatsApp con el pedido formateado
- Número de WhatsApp: +52 2451051911
- Información de contacto al lado:
  - Teléfono: 2454522978
  - Ubicación: Calle 3 poniente y Av. Revolución #202, frente a Soriana
  - Horario de atención

### ✅ Footer (Pie de Página)
- Texto de derechos reservados: "© 2025 Chaud & Glace - Dulce Vida. Todos los derechos reservados."
- Iconos de redes sociales (Facebook, Instagram, WhatsApp)
- Información de contacto

## 🎨 Personalización

## 📱 Responsive Design
El sitio está completamente optimizado para:
- 📱 Móviles (< 768px)
- 💻 Tablets (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🔧 Tecnologías Utilizadas
- **Astro** - Framework web moderno
- **Tailwind CSS v4** - Estilos utilitarios
- **Google Fonts (Outfit)** - Tipografía moderna
- **JavaScript vanilla** - Interactividad

## 📞 Funcionalidades de Contacto
- Botón de llamada directa en el header
- Formulario que envía pedidos por WhatsApp
- Enlaces a redes sociales en el footer