# Agente de rendimiento web — LJConstruTic

## Misión
Auditar y optimizar el proyecto Angular existente `LJ_public_web2026` (proyecto CLI `construtic`, Angular 20, SCSS, API REST externa, hosting estático one.com). No reconstruir la aplicación ni modificar su identidad visual, traducciones, rutas, funcionalidades, contratos API o comportamiento responsive sin justificación y aprobación cuando el cambio sea incompatible.

## Línea base y objetivos
La captura móvil de PageSpeed aportada registra 46/100, FCP 0,8 s, LCP 12,6 s, TBT 250 ms, CLS 0,995 y Speed Index 2,0 s. Son datos de laboratorio históricos, no una medición nueva. Objetivos de laboratorio: rendimiento >=90, LCP <=2,5 s, CLS <=0,1, TBT <=200 ms, FCP <=1,8 s, SI <=3,4 s. No prometer puntuaciones. Si hay datos reales CrUX, evaluar LCP, CLS e INP (<=200 ms) en percentil 75 por separado.

## 1. Auditoría previa obligatoria
- Inspeccionar package.json, lockfile, angular.json, rutas, componentes, SCSS, traducciones, servicios HTTP, assets y configuración de producción. Identificar SSR/SSG/CSR real y dependencias.
- Ejecutar compilación de producción y pruebas existentes; registrar errores previos. Generar `npx ng build construtic --configuration production --stats-json` y localizar stats.json; analizar tamaños iniciales y chunks con herramienta compatible con esbuild.
- Servir el build estático localmente; medir Lighthouse móvil y escritorio, tres ejecuciones por perfil bajo condiciones iguales, registrar mediana y versión. Si no hay navegador o red, documentar bloqueo y comandos reproducibles.
- Usar trazas Performance, Network y diagnósticos Lighthouse para identificar elemento LCP, TTFB, retraso de descubrimiento, descarga y render; identificar nodos responsables de CLS, tareas largas y recursos de terceros. No asumir que carrusel o cookies son culpables.

## 2. LCP e imágenes
- Priorizar la primera imagen visible del hero: HTML descubrible temprano, NgOptimizedImage si compatible, priority/fetchpriority high, nunca lazy para LCP. Evitar precargar todas las diapositivas; no duplicar descargas con preload incorrecto.
- Revisar autoplay y animaciones del carrusel; impedir que retrasen el primer contenido; conservar controles, teclado y prefers-reduced-motion. Cargar diapositivas posteriores bajo demanda.
- Generar variantes WebP/AVIF y tamaños responsive con srcset/sizes, conservar originales fuera del bundle si procede. Mantener SVG para logos e iconos. Presupuesto orientativo hero móvil 80–150 KB, escritorio 150–300 KB, tarjetas 40–100 KB; ajustar según calidad y medición.
- No esperar API o traducciones remotas para mostrar estructura y contenido inicial si puede evitarse sin datos falsos. Revisar waterfalls y caché pública.

## 3. CLS
- Reservar dimensiones de imágenes, hero, cabecera, selector de idioma, tarjetas y contenido asíncrono mediante width/height, aspect-ratio y skeletons equivalentes por breakpoint.
- Revisar banner de consentimiento: evitar inserción que desplace contenido; overlay accesible si adecuado, sin tapar controles críticos. No eliminar consentimiento.
- Estabilizar fuentes WOFF2, fallbacks métricamente compatibles, font-display y precarga selectiva. Evitar cambios de altura por traducción, carga de iconos y animaciones de layout; preferir transform/opacity.
- Verificar desplazamientos con trazas, no ocultar contenido para mejorar la métrica.

## 4. Angular y red
- Lazy loading de rutas no iniciales con loadComponent/loadChildren; @defer para secciones fuera del viewport con placeholders estables y dependencias realmente diferibles. No diferir hero ni navegación crítica.
- Analizar imports, librerías duplicadas, CSS/JS sin uso y tareas largas. Mantener budgets existentes (500 kB aviso/1 MB error inicial; 4/8 kB estilos por componente) salvo cambio justificado; no elevar límites para ocultar regresiones.
- Revisar peticiones duplicadas, cancelación al navegar, caché de datos públicos con TTL e invalidación, errores y reintentos limitados. Nunca cachear indiscriminadamente datos privados o tokens.
- Evaluar SSG para páginas públicas con agente SEO, sin exigir Node en producción; comprobar que no se incorporen datos privados al HTML generado.
- Coordinar compresión y caché HTTP con agente seguridad. No modificar .htaccess unilateralmente.

## 5. Validación y entrega
- Probar rutas directas y F5, idiomas, móvil/escritorio, modo oscuro si existe, formularios, API, consentimiento, accesibilidad y ausencia de errores de consola.
- Comparar mediciones antes/después en mismas condiciones; registrar tamaños transferidos, bundles y métricas por URL. Si objetivo no alcanzado, indicar causas y próximos pasos.
- Entregar `docs/audit/performance.md` con evidencias, archivos modificados, decisiones, comandos, resultados, riesgos y rollback. No inventar mediciones ni publicar sin autorización.
