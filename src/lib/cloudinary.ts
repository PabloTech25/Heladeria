/**
 * Utilidades de Cloudinary para optimización de imágenes
 * 
 * Esta configuración genera URLs optimizadas automáticamente con:
 * - f_auto: Formato automático (WebP, AVIF según soporte del navegador)
 * - q_auto: Calidad automática optimizada
 * - Transformaciones responsive para diferentes tamaños
 */

// Cloud name de Cloudinary
export const CLOUD_NAME = 'diwklfbvj';

// Base URL para las imágenes
export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

/**
 * Convierte una ruta local de imagen a URL de Cloudinary optimizada
 * 
 * Ejemplo:
 * - Input:  "/productos/Helados/HeladoSencillo.webp"
 * - Output: "https://res.cloudinary.com/diwklfbvj/image/upload/f_auto,q_auto/HeladoSencillo"
 * 
 * @param localPath - Ruta local de la imagen (ej: /productos/Helados/HeladoSencillo.webp)
 * @param options - Opciones de transformación
 */
export function getCloudinaryUrl(
  localPath: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'auto:low' | 'auto:eco' | 'auto:good' | 'auto:best' | number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'pad' | 'limit';
  } = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'limit',
  } = options;

  // Extraer solo el nombre del archivo (sin ruta ni extensión)
  // "/productos/Helados/HeladoSencillo.webp" -> "HeladoSencillo"
  const fileName = localPath
    .split('/').pop() || localPath;  // Obtener último segmento
  const publicId = fileName
    .replace(/\.[^/.]+$/, '');       // Quitar extensión

  const transformations: string[] = [];

  // Calidad automática
  transformations.push(`q_${quality}`);
  
  // Formato automático
  transformations.push(`f_${format}`);

  // Dimensiones y crop
  if (width) {
    transformations.push(`w_${width}`);
    transformations.push(`c_${crop}`);
  }
  if (height) {
    transformations.push(`h_${height}`);
  }

  const transformString = transformations.join(',');
  
  return `${CLOUDINARY_BASE_URL}/${transformString}/${publicId}`;
}

/**
 * Genera URLs responsive para srcset
 * @param localPath - Ruta local de la imagen
 * @param widths - Array de anchos para generar
 */
export function getResponsiveSrcSet(
  localPath: string,
  widths: number[] = [320, 480, 640, 768, 1024]
): string {
  return widths
    .map(w => `${getCloudinaryUrl(localPath, { width: w })} ${w}w`)
    .join(', ');
}

/**
 * Genera una URL de placeholder blur (LQIP - Low Quality Image Placeholder)
 * @param localPath - Ruta local de la imagen
 */
export function getBlurPlaceholder(localPath: string): string {
  const fileName = localPath.split('/').pop() || localPath;
  const publicId = fileName.replace(/\.[^/.]+$/, '');
    
  return `${CLOUDINARY_BASE_URL}/w_50,q_30,e_blur:1000,f_auto/${publicId}`;
}
