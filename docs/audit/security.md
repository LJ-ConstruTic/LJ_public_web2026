# Seguridad y despliegue

## Hallazgos y controles

| Estado | Hallazgo o control | Evidencia |
|---|---|---|
| Verificado localmente | `public/.htaccess` acota la reescritura CSR, devuelve 404 para rutas y recursos inexistentes y define las redirecciones conocidas. | Apache 2.4.52 en WSL sirvió rutas, alias, fichas, 404 de documento y asset, cabeceras, MIME, caché y gzip. La aplicación de las directivas en el plan de one.com queda pendiente. |
| Implementado | `nosniff`, política de referencia, protección contra framing y permisos restrictivos. CSP en modo informe. | Se permiten fuentes locales, API HTTPS y el origen del mapa. PrimeNG y los estilos inline requieren `style-src 'unsafe-inline'` en esta etapa. La optimización crítica de Angular usa un manejador inline que se debe revisar antes de enforcement. |
| Implementado | CSP y sanitización del mapa complementarias. | La API pública entregó `https://maps.google.com`. El pipe solo confía en ese origen HTTPS sin credenciales URL. El iframe requiere consentimiento. |
| Implementado | HTML, robots y sitemap con revalidación, recursos sin huella con 1 día, JS/CSS y fuentes con huella con 1 año inmutable. | Compresión gzip condicional y tipos WebP/WOFF2. Validar los módulos de Apache, `Vary` y caché final de Varnish en one.com. |
| Verificado | La API externa acepta el origen HTTPS canónico. | GET a `/v2/languages` devolvió 200. Los preflight GET y POST a `/v2/languages` y `/v2/contact-requests` devolvieron 204 con origen exacto, cabeceras permitidas y credenciales. Una consulta desde `localhost` devolvió 403. El envío del formulario se probó con una respuesta local 202. |
| Implementado | Proxy Angular limitado a la configuración de desarrollo, sin mapas de fuente en producción. | `angular.json` y el paquete browser. |
| Pendiente | TLS, redireccionamientos y cabeceras efectivas de la publicación. | HTTP, HTTPS y HTTPS `www` respondían 200 en consultas previas. La regla nueva usa 302 hasta verificar TLS, host y ausencia de bucles detrás de Varnish. HSTS queda pendiente hasta verificar HTTPS estable. [HTTPS en one.com](https://help.one.com/hc/en-us/articles/115005587469-How-do-I-force-visitors-of-my-site-to-always-use-HTTPS) |

Angular conserva la sanitización de los dos usos de `innerHTML` y el formulario conserva su DTO y validación. La aplicación registra únicamente el interceptor de errores para la API pública. Hay clases de autenticación con almacenamiento local que no participan en las peticiones públicas actuales. Revisar el almacenamiento y la expiración antes de reactivar el flujo autenticado. Las verificaciones de autorización, rate limiting y validación final deben realizarse en la API. No se utilizó un SAST o un escáner dedicado de secretos.

## Dependencias

| Auditoría npm | Críticas | Altas | Moderadas | Bajas | Total |
|---|---:|---:|---:|---:|---:|
| Árbol completo inicial | 4 | 37 | 22 | 1 | 64 |
| Tras correcciones compatibles y parche Angular 20 | 0 | 0 | 16 | 0 | 16 |
| Solo producción final, `npm audit --omit=dev` | 0 | 0 | 0 | 0 | 0 |

Se alinearon los paquetes de framework y animaciones en 20.3.35 y las herramientas CLI y SSR en 20.3.43. PrimeNG requiere un peer de animaciones compatible y se declaró explícitamente para resolver el árbol. Los avisos residuales pertenecen a la cadena de herramientas de npm que trae Angular CLI. El ZIP sirve archivos estáticos y excluye ese ejecutable y sus dependencias. No se aplicó `npm audit fix --force`.

La revisión de recursos detectó imágenes del CMS por HTTPS, fuentes Montserrat y Open Sans empaquetadas, iconos locales, mapa de Google bajo consentimiento y ausencia de analítica activa. La ruta `/media/w2/` contiene recursos que pueden estar alojados en el mismo dominio y debe preservarse en la publicación.

## Publicación manual y rollback

1. Ejecutar `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/package-onecom.ps1`. Agregar `-RefreshCatalog` si se desea actualizar las fichas públicas con el CMS.
2. Comparar el SHA-256 del ZIP con el fichero `.sha256`. Antes de publicar, respaldar el contenido actual y su `.htaccess` fuera de la raíz web. Conservar `media/`, archivos de verificación y demás directorios que no formen parte del release.
3. Extraer el ZIP y subir su contenido a la raíz del sitio. Subir primero los assets y chunks con huella, después los HTML, sitemap y robots. Aplicar `.htaccess` al final y conservar temporalmente los chunks anteriores.
4. Verificar con `curl.exe -I` y `curl.exe -IL` HTTP, HTTPS, `www`, rutas directas, 404 de documento y asset, JSON/XML, MIME, caché, compresión, CSP y CORS. Probar menú, idiomas, tema, consentimiento y un envío autorizado de prueba desde el dominio. Promover el 302 a 301 solo si la redirección está validada.
5. Si hay regresión, restaurar primero el `.htaccess` y luego los HTML, sitemap y robots del respaldo. Mantener los assets anteriores hasta que las pruebas de humo vuelvan a pasar.
