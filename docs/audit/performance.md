# Rendimiento web

## Auditoría de partida

El proyecto CLI `construtic` usa Angular 20, SCSS, PrimeNG, ngx-translate y ComponentStore. La configuración de producción usa esbuild, CSR, assets desde `public`, huellas en el código y API REST externa por HTTPS. Las traducciones de interfaz están en el código y el CMS aporta idiomas disponibles, navegación y páginas. El consentimiento ya era un aviso fijo. La carga inicial de la portada seguía el recorrido idiomas → página del CMS → carrusel → JPEG.

La captura móvil histórica de PageSpeed registró 46 puntos, FCP 0,8 s, LCP 12,6 s, TBT 250 ms, CLS 0,995 e índice de velocidad 2,0 s. No hay datos CrUX comparables disponibles en esta auditoría.

El build base con `--stats-json` y Lighthouse local identificó el JPEG del CMS en el carrusel como LCP. En la segunda pasada móvil, el modelo de Lighthouse atribuyó unos 6,16 s a la espera de descubrimiento y 2,36 s a la descarga. En esa pasada, el pie aportó 0,634 de CLS al ser desplazado por el contenido asíncrono. En la primera pasada de escritorio, el cambio de altura del aviso de cookies ligado a Montserrat aportó 0,195 de CLS.

## Cambios

- **Implementado.** El documento inicial contiene el hero y su espacio reservado. La vista inicial se retira cuando Angular ha pintado la portada. El paquete precarga una única imagen responsive y el carrusel aplica prioridad alta solo a la primera diapositiva. Las demás imágenes usan carga perezosa nativa. Se quitó la entrada con opacidad del título. Se mantienen indicadores, autoplay al llegar el CMS y respeto por movimiento reducido.
- **Implementado.** El hero original del CMS tenía 307.132 bytes y 1000 × 567 píxeles. Sus WebP pesan 21.076 bytes a 720 píxeles y 35.002 bytes a 1000 píxeles. Estrategia y Quiénes somos pesaban 11.832.054 y 1.465.276 bytes. Sus WebP de 640 píxeles pesan 19.278 y 38.498 bytes, respectivamente. El CMS mantiene control sobre los URLs. Si se reemplaza un JPEG manteniendo su URL, regenerar las variantes antes de empaquetar. Los JPEG se conservan como fallback y las tarjetas usan también WebP responsive.
- **Implementado.** El logo y la estructura de portada tienen dimensiones reservadas, el pie se mantiene por debajo del área inicial mientras carga el contenido y se sirve Montserrat y Open Sans en WOFF2 con sus licencias. Se precarga solo el subconjunto latino de Montserrat. El aviso fijo mantiene ambas opciones y se puede volver a abrir desde el pie.
- **Implementado.** Se eliminó una consulta duplicada de contacto. ComponentStore deduplica solicitudes simultáneas por slug e idioma, cancela la del idioma anterior y mantiene el flujo tras fallos. Se separó la lógica de anclas del menú del registro de componentes de portada y se difirió el motor de animaciones. Se conservan los presupuestos del proyecto.
- **Pendiente.** Reducir más el trabajo inicial de PrimeNG y separar secciones de portada con medidas de placeholder basadas en trazas. El navegador aún anticipa algunas diapositivas próximas pese a la carga perezosa. Evaluar carga ligada a la navegación del carrusel si persiste ese coste. No se añadió una caché persistente del CMS ni se cachearon datos privados. Confirmar las métricas del servidor definitivo y analizar CrUX cuando esté disponible.

El conjunto inicial bajó de **949,98 kB a 829,59 kB** en el grafo de imports estáticos, incluyendo el CSS. La estimación Brotli de Angular bajó de 215,09 kB a 186,34 kB. Sigue superando el aviso de 500 kB y respeta el límite de 1 MB. El análisis de `stats.json` identifica Angular, el router, el selector y menubar de PrimeNG y el código de formularios entre las contribuciones mayores. El carrusel y los componentes de portada se cargan con la ruta. El motor de animaciones tiene su propio chunk asíncrono.

## Reproducción y comparación

Medianas de tres pasadas de Lighthouse 12.8.2 con Chrome Headless 158 para cada perfil y build, en la portada. El servidor local no aplica compresión HTTP y ambas versiones compartieron el mismo proxy de lectura del CMS. Las cifras históricas de PageSpeed corresponden a otro entorno.

| Métrica | Objetivo | Móvil inicial | Móvil final | Escritorio inicial | Escritorio final |
|---|---:|---:|---:|---:|---:|
| Rendimiento | ≥90 | 16 | 52 | 59 | 95 |
| Accesibilidad | ≥90 | 100 | 100 | 100 | 100 |
| Buenas prácticas | ≥90 | 100 | 100 | 100 | 100 |
| SEO | ≥90 | 83 | 92 | 83 | 92 |
| FCP | ≤1,8 s | 7,17 s | 5,17 s | 1,33 s | 0,99 s |
| LCP | ≤2,5 s | 9,76 s | 6,51 s | 3,37 s | 1,29 s |
| CLS | ≤0,1 | 0,393 | 0,005 | 0,225 | 0,002 |
| TBT | ≤200 ms | 1.218 ms | 507 ms | 175 ms | 54 ms |
| Índice de velocidad | ≤3,4 s | 7,17 s | 5,17 s | 1,48 s | 0,99 s |
| Transferencia total | — | 15,51 MB | 1,89 MB | 17,61 MB | 1,96 MB |

El LCP móvil bajó un 33 % y la transferencia móvil un 88 %. La traza final atribuye prioridad alta y descubrimiento en el HTML inicial a la imagen LCP. El experimento con el hero temporal dentro de `app-root` aún desplazaba el pie al arrancar Angular. La vista inicial del release permanece fuera del flujo y se retira tras el primer render de la portada, que conserva su altura. El objetivo móvil de rendimiento sigue pendiente, con trabajo inicial de render y TBT por encima del objetivo. El HTML de las rutas internas, sus enlaces y sus estados se verificaron en las pruebas de humo. Las tres pasadas Lighthouse por perfil se centraron en la portada.

1. Compilar la línea base con `npx ng build construtic --configuration production --stats-json --output-path dist/audit-baseline` desde el estado previo. Generar el paquete final con `scripts/package-onecom.ps1`.
2. Ejecutar `python scripts/audit-preview.py 4372=dist/audit-baseline/browser 4373=dist/construtic/browser`. El servidor local sustituye la URL de la API al servir JS y comparte una caché temporal de lecturas públicas para evitar el rechazo CORS de localhost. Las medidas corresponden a ese entorno. El servidor de auditoría no ejecuta Apache ni envía formularios.
3. Ejecutar Lighthouse 12.8.2 tres veces por perfil y build con `npx --yes lighthouse@12.8.2 http://127.0.0.1:4373/ --chrome-flags="--headless=new --lang=pt" --output=json`. El perfil de escritorio añade `--preset=desktop`. Comparar medianas por métrica. Los informes definitivos son `dist/lh-before-*.json` y `dist/lh-release-*.json`.

Para revertir, restaurar el paquete anterior con sus assets y HTML juntos. Las mejoras de imágenes, fuentes, estado y animaciones pertenecen al bundle y al CSS de ese release.
