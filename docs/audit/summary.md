# Validación integrada y entrega

## Alcance y estado

1. **Auditoría inicial verificada.** Se revisaron rutas, lockfile, compilación, componentes, SCSS, idiomas, API, producción y publicación. La línea base reproducible quedó en `dist/audit-baseline/`.
2. **Rendimiento implementado.** Prioridad al hero que midió Lighthouse, reserva de espacio, fuentes locales, variantes WebP y trabajo inicial de Angular. Consultar [rendimiento](performance.md) para métricas y trazas.
3. **SEO implementado.** Sitemap y HTML de acceso directo para rutas verificadas, metadatos, imagen social, datos estructurados, canónicas y 404. Consultar [SEO](seo.md) para inventario, SSG, analítica y Search Console.
4. **Seguridad implementada.** Cabeceras, CSP de informe, control del origen del mapa, reescrituras acotadas, ajustes de dependencias y paquete estático. Consultar [seguridad](security.md) para resultados y pasos de publicación.

El entregable para publicar manualmente es `dist/construtic/LJConstruTic-onecom.zip`, acompañado de `LJConstruTic-onecom.zip.sha256` y `onecom-manifest.json`. El ZIP contiene el árbol browser con `.htaccess` y avisos de licencias. No se ha publicado en producción y no se modificaron el DNS, el backend ni cuentas externas.

## Resultado verificado

| Lighthouse local | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---:|---:|---:|---:|
| Móvil inicial → final | 16 → 52 | 100 → 100 | 100 → 100 | 83 → 92 |
| Escritorio inicial → final | 59 → 95 | 100 → 100 | 100 → 100 | 83 → 92 |

- Compilación de producción y ZIP verificados. El manifiesto y SHA-256 coinciden con los 86 archivos. El sitemap contiene 15 URLs y el ZIP no incluye mapas de fuente ni salida de servidor.
- Karma y Chrome Headless ejecutaron tres pruebas de regresión y pasaron las tres. El estado inicial tenía cero casos ejecutables. El humo en Chrome cubrió WebP móvil, consentimiento, mapa, tema, idioma, validación de formulario y respuesta local 202, rutas de acceso directo, recarga, 404 y ausencia de excepciones JavaScript en el recorrido.
- Apache 2.4.52 sirvió el paquete en local y pasó las comprobaciones de alias, 404, MIME, compresión, caché y cabeceras. Se verificaron el GET público y los preflight GET y POST de la API. Falta un envío autorizado desde el dominio tras publicar.
- El presupuesto inicial de 500 kB sigue en aviso. La auditoría npm final obtuvo cero avisos en producción y 16 moderados en el árbol completo de herramientas. Quedan pendientes el objetivo móvil de rendimiento, SSG completo, GA4, validación efectiva en one.com y medición Web Vitals de usuarios reales.

## Archivos

- **Rendimiento.** Componentes de portada, carrusel, menú, tarjetas y pie, configuración Angular, `public/img` y `public/fonts`.
- **SEO.** Rutas, 404, `src/app/seo-pages.json`, `src/app/seo-catalog.json`, `SeoService`, `public/sitemap.xml`, `public/robots.txt` y scripts de generación.
- **Seguridad y despliegue.** `public/.htaccess`, pipe de iframe, pruebas, store del CMS, manifiestos de dependencias y script PowerShell de empaquetado.

Antes de publicar, aplicar la comprobación en el plan de one.com y el procedimiento de reversión de [seguridad](security.md). Los valores 90/100 son objetivos por categoría y la decisión de publicar debe considerar los resultados locales y las pruebas del alojamiento.
