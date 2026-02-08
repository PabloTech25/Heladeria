# 🔍 Diagnóstico: Imagen no se muestra

## Pasos para resolver el problema:

### 1️⃣ Verifica que la imagen esté REALMENTE pública

**Importante:** A veces Google Drive dice que está compartido pero tiene restricciones ocultas.

#### Prueba manual:
1. Abre una **ventana de incógnito** en tu navegador (Ctrl+Shift+N en Chrome)
2. Pega esta URL (reemplaza TU_ID con el ID de tu imagen):
   ```
   https://drive.google.com/thumbnail?id=TU_ID&sz=w1000
   ```
   
Para tu imagen actual:
```
https://drive.google.com/thumbnail?id=1TAnQkOrRhEC2CvMgFNVQOzK6J69U4j0w&sz=w1000
```

3. **¿Qué ves?**
   - ✅ Si ves la imagen → El problema está en el código
   - ❌ Si ves error o aviso de permisos → La imagen NO está pública correctamente

---

### 2️⃣ Si la imagen NO se ve en incógnito:

#### Solución A: Volver a compartir
1. Ve a Google Drive
2. Clic derecho en la imagen → "Compartir"
3. Haz clic en **"Restringido"** (aunque ya diga "Cualquier persona")
4. Selecciona **"Cualquier persona con el enlace"**
5. Asegúrate de seleccionar **"Visualizador"**
6. Haz clic en **"Copiar enlace"**
7. Clic en **"Listo"**

#### Solución B: Cambiar configuración de Drive
1. Ve a Google Drive
2. Clic derecho en la imagen
3. Selecciona "Organizar" → "Mover"
4. Muévela a otra carpeta temporal
5. Vuelve a moverla a la carpeta "Productos"
6. Comparte de nuevo siguiendo los pasos de Solución A

---

### 3️⃣ Si la imagen SÍ se ve en incógnito:

El problema es el formato de URL. He actualizado el código para usar un endpoint más confiable.

**Prueba esto:**

1. **Abre la consola del navegador:**
   - Presiona F12 en tu navegador
   - Ve a la pestaña "Console"

2. **Recarga tu página web**

3. **Busca mensajes como:**
   ```
   Producto: concha-rellena, URL generada: https://drive.google.com/thumbnail?id=...
   ```

4. **Copia esa URL y ábrela en una nueva pestaña**
   - Si funciona ahí pero no en tu sitio → problema de CORS (sigue leyendo)

---

### 4️⃣ Problema de CORS (Cross-Origin)

A veces Google Drive bloquea imágenes en sitios web locales (localhost).

#### Solución temporal:
**Usa la extensión de Chrome "CORS Unblock"** solo durante desarrollo

#### Solución definitiva:
Las imágenes funcionarán correctamente cuando el sitio esté desplegado en producción (Vercel, Netlify, etc.)

---

### 5️⃣ Alternativa: URLs directas diferentes

Si nada funciona, prueba estos formatos en tu `products.json`:

**Formato 1: Thumbnail (actual):**
```json
"image": "1TAnQkOrRhEC2CvMgFNVQOzK6J69U4j0w"
```
Genera: `https://drive.google.com/thumbnail?id=ID&sz=w1000`

**Formato 2: Export view:**
```json
"image": "https://drive.google.com/uc?export=view&id=1TAnQkOrRhEC2CvMgFNVQOzK6J69U4j0w"
```

**Formato 3: Formato antiguo (menos recomendado):**
```json
"image": "https://lh3.googleusercontent.com/d/1TAnQkOrRhEC2CvMgFNVQOzK6J69U4j0w"
```

---

### 6️⃣ Verificar el ID es correcto

#### Obtén el ID correcto:
1. Abre la imagen en Google Drive
2. La URL del navegador se verá así:
   ```
   https://drive.google.com/file/d/1TAnQkOrRhEC2CvMgFNVQOzK6J69U4j0w/view
   ```
3. El ID está entre `/d/` y `/view`

#### Verifica que coincida con el que tienes en products.json

---

### 7️⃣ Checklist final:

- [ ] La imagen está en formato JPG, PNG o WEBP
- [ ] La imagen es menor a 10 MB
- [ ] El archivo está compartido como "Cualquier persona con el enlace"
- [ ] El permiso es "Visualizador" (no "Editor")
- [ ] El ID está copiado correctamente (sin espacios)
- [ ] La URL funciona en ventana de incógnito
- [ ] Has recargado la página (Ctrl+F5 o Cmd+Shift+R)

---

## 🆘 Si nada funciona:

### Opción alternativa: Subir a la carpeta /public

1. Descarga la imagen de Google Drive
2. Copia la imagen a: `public/products/concha-rellena.jpg`
3. En `products.json` cambia:
   ```json
   "image": "/products/concha-rellena.jpg"
   ```

Esta opción siempre funciona pero significa que las imágenes estarán en tu proyecto en lugar de Google Drive.

---

## 💡 Información técnica

**URL actual que se está generando:**
```
https://drive.google.com/thumbnail?id=1TAnQkOrRhEC2CvMgFNVQOzK6J69U4j0w&sz=w1000
```

**Para ver el log de URLs generadas:**
1. Abre DevTools (F12)
2. Ve a Console
3. Recarga la página
4. Verás: `Producto: concha-rellena, URL generada: ...`

Esto te ayudará a diagnosticar el problema exacto.
