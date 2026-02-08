# 📸 Guía Rápida: Cómo Obtener URLs de Google Drive

## Método 1: Obtener el ID del Archivo (Recomendado)

### Paso a Paso:

1. **Abre Google Drive** y ve a tu carpeta "Productos"

2. **Encuentra la imagen** que quieres usar

3. **Haz clic derecho** en la imagen y selecciona "Compartir"

4. **Configura el acceso:**
   - Haz clic en "Cambiar" junto a "Restringido"
   - Selecciona **"Cualquier persona con el enlace"**
   - Asegúrate de que el permiso sea **"Visualizador"**
   - Haz clic en "Listo"

5. **Copia el enlace:**
   - Haz clic en "Copiar enlace"
   - Te dará algo como:
   ```
   https://drive.google.com/file/d/1sF8hG3jK9-xYz2AbC-EJEMPLO_ID/view?usp=sharing
   ```

6. **Extrae el ID:**
   - El ID está entre `/d/` y `/view`
   - En el ejemplo anterior sería: `1sF8hG3jK9-xYz2AbC-EJEMPLO_ID`

7. **Usa el ID en products.json:**
   ```json
   {
     "id": "frappe-clasico",
     "name": "Frappe Clásico",
     "image": "1sF8hG3jK9-xYz2AbC-EJEMPLO_ID"
   }
   ```

---

## Método 2: Usar la URL Completa (También Funciona)

Si prefieres no extraer el ID manualmente, puedes usar la URL completa:

```json
{
  "id": "frappe-clasico",
  "name": "Frappe Clásico",
  "image": "https://drive.google.com/file/d/1sF8hG3jK9-xYz2AbC-EJEMPLO_ID/view?usp=sharing"
}
```

El sistema automáticamente extraerá el ID y la convertirá al formato correcto.

---

## Método 3: Obtener Múltiples IDs Rápidamente

### Para procesar varias imágenes a la vez:

1. **Selecciona todas las imágenes** de una categoría (Ctrl+clic o Cmd+clic)

2. **Haz clic derecho** → "Compartir"

3. **Configura acceso público** como se indicó arriba

4. **Obtén enlaces individuales:**
   - Abre cada imagen
   - Copia la URL del navegador
   - La URL ya contiene el ID que necesitas

---

## 🎯 Ejemplo Real Completo

### Imagen en Google Drive:
- **Nombre del archivo:** `frappe-oreo.jpg`
- **URL compartida:** `https://drive.google.com/file/d/19Xyz-AbCdEf_GhIjKlMn-OpQrSt/view?usp=sharing`
- **ID extraído:** `19Xyz-AbCdEf_GhIjKlMn-OpQrSt`

### En products.json:

```json
{
  "id": "frappe-oreo",
  "name": "Frappe Oreo",
  "description": "Frappe con galletas Oreo trituradas y crema",
  "category": "Bebidas Frias",
  "ingredients": "Café, Leche, Hielo, Galletas Oreo, Crema batida",
  "size": "16 oz",
  "price": "$65",
  "numericPrice": 65,
  "image": "19Xyz-AbCdEf_GhIjKlMn-OpQrSt"
}
```

---

## ✅ Checklist de Verificación

Antes de guardar tu products.json, verifica:

- [ ] Todas las imágenes están configuradas como **públicas** en Drive
- [ ] Los IDs están correctamente copiados (sin espacios)
- [ ] Cada producto tiene una imagen asignada
- [ ] El formato JSON es válido (comas correctas)
- [ ] Has guardado el archivo products.json

---

## 🚨 Problemas Comunes

### La imagen no carga:
- Verifica que la imagen sea pública en Google Drive
- Comprueba que el ID esté completo y sin espacios
- Intenta abrir esta URL en tu navegador:
  ```
  https://drive.google.com/uc?export=view&id=TU_ID_AQUI
  ```

### La imagen carga muy lento:
- Google Drive puede tardar unos segundos la primera vez
- Considera comprimir las imágenes (usa herramientas como TinyPNG)
- Recomendado: imágenes de máximo 1MB

### Error de permisos:
- Asegúrate de que el enlace sea público ("Cualquier persona con el enlace")
- No uses "Restringido" o "Solo personas específicas"

---

## 💡 Tips Pro

1. **Nombres consistentes:** Nombra tus archivos igual que el ID del producto
   - Ejemplo: `frappe-oreo.jpg` → `id: "frappe-oreo"`

2. **Organiza por carpetas:** Usa las carpetas de Drive para ordenar por categoría

3. **Backup:** Guarda una copia del archivo products.json antes de hacer cambios grandes

4. **Optimiza imágenes:** Usa formato JPG con calidad 80-85% para balance tamaño/calidad

---

¿Necesitas más ayuda? Consulta el archivo `README.md` en la misma carpeta.
