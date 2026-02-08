# Guía para Gestionar Productos

## 📝 Cómo agregar un nuevo producto

Para agregar productos nuevos al menú, simplemente edita el archivo `products.json`:

### Ubicación del archivo:
```
src/data/products.json
```

### Estructura de un producto:

```json
{
  "id": "id-unico-del-producto",
  "name": "Nombre del Producto",
  "description": "Descripción breve y atractiva",
  "category": "Categoría del producto",
  "ingredients": "Lista de ingredientes (opcional)",
  "size": "Tamaño o porción (opcional)",
  "price": "$00",
  "numericPrice": 00,
  "image": "URL o ID de la imagen"
}
```

## 🖼️ Configurar Imágenes de Google Drive

### Paso 1: Hacer la imagen pública en Google Drive

1. Ve a tu carpeta de productos en Google Drive
2. Haz clic derecho en la imagen
3. Selecciona "Compartir" o "Obtener enlace"
4. Cambia la configuración a **"Cualquier persona con el enlace"**
5. Asegúrate de que el permiso sea "Visualizador"
6. Copia el enlace compartido

### Paso 2: Obtener el ID del archivo

El enlace de Google Drive se ve así:
```
https://drive.google.com/file/d/1ABC123xyz-EJEMPLO-ID/view?usp=sharing
```

El **ID del archivo** es la parte entre `/d/` y `/view`:
```
1ABC123xyz-EJEMPLO-ID
```

### Paso 3: Usar el ID o URL en products.json

Puedes usar el ID directamente o la URL completa:

**Opción 1 - Solo el ID (recomendado):**
```json
{
  "id": "frappe-caramelo",
  "name": "Frappe de Caramelo",
  "image": "1ABC123xyz-EJEMPLO-ID"
}
```

**Opción 2 - URL completa:**
```json
{
  "id": "frappe-caramelo",
  "name": "Frappe de Caramelo",
  "image": "https://drive.google.com/file/d/1ABC123xyz-EJEMPLO-ID/view"
}
```

**Opción 3 - URL directa:**
```json
{
  "id": "frappe-caramelo",
  "name": "Frappe de Caramelo",
  "image": "https://drive.google.com/uc?export=view&id=1ABC123xyz-EJEMPLO-ID"
}
```

📌 **Nota:** El sistema automáticamente convierte cualquiera de estos formatos al formato correcto para mostrar la imagen.

### 📁 Organización recomendada en Google Drive:

```
Productos/
├── Bebidas Frias/
│   ├── frappe-clasico.jpg
│   ├── frappe-oreo.jpg
│   └── smoothie-fresa.jpg
├── Bebidas Calientes/
│   ├── cafe-americano.jpg
│   └── capuchino.jpg
├── Helados/
│   └── helado-artesanal.jpg
├── Paletas de Hielo/
│   ├── paleta-agua.jpg
│   └── paleta-crema.jpg
├── Postres/
│   ├── concha-rellena.jpg
│   ├── crepa-dulce.jpg
│   └── cheesecake.jpg
├── Salados/
│   └── croissant-jamon.jpg
└── Galletas/
    ├── galletas-chispas.jpg
    └── galletas-avena.jpg
```

### ⚠️ Solución de problemas:

**Problema:** La imagen no se muestra
- ✅ Verifica que la imagen sea pública ("Cualquier persona con el enlace")
- ✅ Asegúrate de copiar el ID correcto (sin espacios ni caracteres extra)
- ✅ Revisa que el formato del archivo sea JPG, PNG o WEBP

**Problema:** La imagen se carga lento
- Las imágenes de Google Drive pueden tardar unos segundos en cargar la primera vez
- Considera optimizar el tamaño de las imágenes (máximo 1MB recomendado)

## 📋 Categorías disponibles:
- `Helados`
- `Paletas de Hielo`
- `Bebidas Frias`
- `Bebidas Calientes`
- `Postres`
- `Salados`
- `Galletas`

### ✏️ Ejemplo de producto completo:

```json
{
  "id": "frappe-caramelo",
  "name": "Frappe de Caramelo",
  "description": "Delicioso frappe con sabor a caramelo y crema",
  "category": "Bebidas Frias",
  "ingredients": "Café, Leche, Hielo, Jarabe de caramelo, Crema batida",
  "size": "16 oz",
  "price": "$65",
  "numericPrice": 65,
  "image": "1ABC123xyz-EJEMPLO-ID"
}
```

### ⚠️ Importante:
1. Cada producto debe tener un `id` único
2. El `numericPrice` debe coincidir con el precio (sin el símbolo $)
3. No olvides la coma `,` entre productos (excepto el último)
4. Las imágenes deben ser públicas en Google Drive

### 🎨 Para agregar una nueva categoría:
Si necesitas una categoría nueva, debes actualizar el archivo `src/data/products.ts` en la sección de tipos:

```typescript
export type ProductCategory = 
  | "Helados" 
  | "Paletas de Hielo" 
  | "Bebidas Frias" 
  | "Bebidas Calientes" 
  | "Postres" 
  | "Salados" 
  | "Galletas"
  | "TU NUEVA CATEGORÍA";  // Agregar aquí
```

Y también en el componente `src/components/ProductMenu.astro` en el array de categorías.

---

✅ **Los cambios se aplicarán automáticamente al recargar la página**


### ✏️ Ejemplo de producto nuevo:

```json
{
  "id": "frappe-caramelo",
  "name": "Frappe de Caramelo",
  "description": "Delicioso frappe con sabor a caramelo y crema",
  "category": "Bebidas Frias",
  "ingredients": "Café, Leche, Hielo, Jarabe de caramelo, Crema batida",
  "size": "16 oz",
  "price": "$65",
  "numericPrice": 65,
  "image": "/products/frappe-caramelo.jpg"
}
```

### ⚠️ Importante:
1. Cada producto debe tener un `id` único
2. El `numericPrice` debe coincidir con el precio (sin el símbolo $)
3. No olvides la coma `,` entre productos (excepto el último)
4. Coloca las imágenes en la carpeta `public/products/`

### 🎨 Para agregar una nueva categoría:
Si necesitas una categoría nueva, debes actualizar el archivo `src/data/products.ts` en la sección de tipos:

```typescript
export type ProductCategory = 
  | "Helados" 
  | "Paletas de Hielo" 
  | "Bebidas Frias" 
  | "Bebidas Calientes" 
  | "Postres" 
  | "Salados" 
  | "Galletas"
  | "TU NUEVA CATEGORÍA";  // Agregar aquí
```

Y también en el componente `src/components/ProductMenu.astro` en el array de categorías.

---

✅ **Los cambios se aplicarán automáticamente al recargar la página**
