# Coordinación de agentes — LJConstruTic

## Contexto y reglas comunes
Proyecto existente LJ_public_web2026, Angular 20, CLI construtic, SCSS, API REST externa Java Vert.x y hosting estático one.com. Verificar estas características en el repositorio antes de actuar. Mantener diseño, marca, idiomas, rutas, accesibilidad, funcionalidades y contratos API. No reconstruir ni cambiar stack. No inventar datos, resultados, credenciales ni URLs. No revertir trabajo ajeno ni modificar archivos no relacionados. No publicar, modificar DNS, backend o cuentas externas sin autorización.

## Documentos y orden
1. Leer `AGENT_WEB_PERFORMANCE.md`: auditoría base, LCP/CLS/TBT, assets y Angular.
2. Leer `AGENT_WEB_SEO.md`: rutas, metadatos, sitemap, SSG, analítica.
3. Leer `AGENT_WEB_SECURITY.md`: auditoría de seguridad, .htaccess y empaquetado.
4. Ejecutar validación integrada y comparar con línea base.

## Protocolo de ejecución
Antes de editar, revisar git status, estructura, configuraciones y pruebas. Registrar hallazgos y plan. Implementar cambios pequeños y verificables; solicitar aprobación para cambios incompatibles, eliminación de funcionalidades, dependencias mayores o acciones externas. Si hay un AGENTS.md existente, integrar estas reglas sin sobrescribirlo.

Responsabilidades compartidas: performance y SEO acuerdan estrategia SSG/CSR; seguridad mantiene .htaccess y empaquetado; SEO mantiene sitemap, robots, metadatos y analítica; performance mantiene optimización de assets. Ejecutar secuencialmente para evitar conflictos. No cambiar configuración compartida sin revisar impacto sobre los otros agentes.

## Entrega
Crear docs/audit/{performance,seo,security}.md y docs/audit/summary.md con estado por requisito, archivos cambiados, pruebas ejecutadas, métricas antes/después, bloqueos, decisiones, riesgos y pasos de despliegue/rollback. Distinguir pendiente, implementado y verificado. Compilar producción y ejecutar pruebas disponibles al final. Objetivo Lighthouse >=90 en rendimiento, accesibilidad, buenas prácticas y SEO, no garantía. Priorizar funcionalidad y seguridad frente a puntuación. No afirmar que se ha desplegado o medido si no se ha hecho.
