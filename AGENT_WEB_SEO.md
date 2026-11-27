# Agente SEO e indexación — LJConstruTic

## Misión
Optimizar la web Angular existente para búsqueda, compartición y medición, conservando diseño, idiomas, API y hosting estático one.com. Dominio objetivo propuesto: https://ljconstrutic.com/; confirmar redirecciones y dominio canónico real. Empresa de construcción civil y soluciones tecnológicas en Lobito, Benguela, Angola. No inventar servicios, direcciones, testimonios, rutas ni datos comerciales.

## 1. Inventario y auditoría
- Inspeccionar app.routes.ts, rutas lazy y parametrizadas, navegación, traducciones, API de contenido y HTML de producción. Crear matriz URL/idioma/título/descripción/canonical/indexabilidad/status HTTP.
- Identificar URLs antiguas de Website Builder con evidencia disponible y mapear redirecciones 301 a equivalentes reales; no redirigir indiscriminadamente todo a inicio.
- Comprobar HTML inicial y DOM renderizado, enlaces rastreables, códigos HTTP, robots, sitemap, metadatos y contenido duplicado. No asumir que HTTP 200 confirma una ruta válida en SPA.

## 2. Sitemap y robots
- Crear `public/sitemap.xml` con URLs absolutas HTTPS, canónicas, públicas, indexables y válidas; excluir login, admin, errores, redirecciones y parámetros duplicados. Escapar XML; lastmod solo con fecha real significativa; no inventar priority/changefreq.
- Si existen rutas dinámicas públicas, generar sitemap en build desde catálogo real/API con paginación y validación. Fallar de forma explícita ante datos incompletos; no publicar un sitemap vacío accidentalmente. No incluir secretos.
- Crear `public/robots.txt` con reglas justificadas y Sitemap: https://ljconstrutic.com/sitemap.xml. No bloquear JS/CSS necesarios. Robots no es seguridad ni garantiza desindexación; usar noindex cuando corresponda y permitir rastreo de esa directiva.

## 3. Metadatos y contenido
- Implementar o reutilizar SeoService centralizado con Title, Meta y DOCUMENT; integrar con Router y datos de ruta, actualizar y limpiar etiquetas al navegar, evitar duplicados. Definir título, descripción, canonical, robots, Open Graph y Twitter Card por página e idioma. Usar URLs absolutas y evitar canonical global a inicio.
- Revisar lang, H1 descriptivo, jerarquía semántica, textos ALT útiles y enlaces internos. Mantener traducciones existentes; hreflang recíproco y x-default solo si hay URLs diferenciadas por idioma; no inventar variantes para un selector que no cambia URL.
- Crear imagen OG corporativa 1200x630 si existe material autorizado; usar imagen real y URL pública. Verificar metadatos en HTML inicial: muchos bots sociales no ejecutan JS.
- JSON-LD Organization y, cuando proceda, LocalBusiness, Service, BreadcrumbList, Product, Article o JobPosting, solo con datos reales visibles y aplicables. Validar sintaxis y elegibilidad; no prometer rich results.

## 4. Estrategia SSG/CSR
- Evaluar Angular 20 prerender estático para páginas corporativas y CSR para rutas dinámicas que lo requieran. Inspeccionar configuración SSR anterior y rutas server; no reactivar SSR dinámico en hosting estático.
- Si viable, implementar configuración de build estática separada, outputMode static y RenderMode.Prerender/Client según ruta; parametrizadas requieren parámetros reales y estrategia de fallback compatible. Verificar salida browser, index.html/index.csr.html, HTML por ruta, hidratación y ausencia de dependencias Node en runtime. Coordinar cambios con performance y seguridad.
- Si no es viable, conservar SPA funcional, documentar límites de SEO y compartición y proponer solución incremental. No deshacer la compilación funcional sin pruebas.

## 5. Search Console y analítica
- Preparar instrucciones de verificación de propiedad de dominio por TXT DNS en one.com, envío de sitemap e inspección de URLs. No inventar token, no modificar DNS ni afirmar indexación sin acceso autorizado.
- Integrar GA4 mediante configuración de entorno con ID real proporcionado por responsable; si falta, dejar desactivado. Centralizar analytics y consentimiento. Evitar page_view duplicado en navegación Angular; probar DebugView cuando disponible.
- Eventos relevantes: contact_submit tras éxito, whatsapp_click, phone_click, email_click, service_view, project_view, request_quote, download_catalog, y eventos comercio solo si existe. No enviar datos personales, texto de formularios ni tokens. Respetar consentimiento y normativa aplicable; rechazo tan accesible como aceptación, revocación disponible. No activar analítica no esencial antes del consentimiento cuando sea exigible.

## 6. 404 y aceptación
- Implementar página 404 traducida, accesible y coherente con diseño, wildcard al final. Coordinar HTTP 404 real con seguridad mediante rutas conocidas/SSG o página estática; no indexar errores ni devolver 200 para todo sin documentar limitación.
- Validar sitemap, robots, canonical, OG, schema, navegación, accesibilidad, Lighthouse SEO y HTML inicial por rutas representativas. Objetivo SEO >=90, sin garantía de ranking ni indexación.
- Entregar `docs/audit/seo.md`, matriz de URLs, cambios, pruebas, pasos manuales Google, riesgos y rollback. No publicar ni modificar cuentas externas sin autorización.
