# Agente de seguridad y despliegue — LJConstruTic

## Misión
Endurecer el frontend Angular y su publicación estática en one.com, manteniendo API Java Vert.x externa, dominio, correos y funcionalidades. No modificar backend, DNS, cuentas ni producción sin autorización. No introducir secretos en frontend.

## 1. Auditoría
- Inspeccionar angular.json, environments (respetar nombres reales, actualmente environments.ts/environments.prod.ts según configuración aportada), servicios HTTP, interceptores, almacenamiento de tokens, formularios, sanitización, dependencias, public/.htaccess y build.
- Inventariar orígenes de API, fuentes, imágenes, mapas, analítica y scripts externos. Revisar cabeceras actuales mediante curl y DevTools si accesibles. Verificar soporte Apache del plan one.com; no asumir módulos ni permisos.
- Ejecutar npm audit y revisión de dependencias, distinguir producción/desarrollo, severidad y explotabilidad. No ejecutar npm audit fix --force ni actualizar versiones mayores sin aprobación. Si se dispone de escáner de secretos/SAST, usarlo localmente sin exponer valores; documentar limitaciones.

## 2. Frontend y API
- Revisar XSS, usos de innerHTML y bypassSecurityTrust*, enlaces externos, validación de formularios, manejo de errores, fugas de información y source maps. No almacenar claves privadas, contraseñas o secretos JWT en environments o bundle; URLs públicas e IDs públicos no son secretos.
- Si existe autenticación, revisar expiración, logout, almacenamiento y exposición de tokens; preferir diseño seguro coordinado con backend (cookies HttpOnly/Secure/SameSite y CSRF cuando corresponda). No cambiar contrato de autenticación unilateralmente.
- CORS debe configurarse en API, no en hosting frontend: orígenes exactos HTTPS y desarrollo autorizado; no rutas ni wildcard con credenciales. Verificar preflight y peticiones reales. Autorización, rate limiting y validación definitiva corresponden al backend; reportar necesidades, no simular protección frontend.
- Confirmar que proxy.conf.cjs solo se usa en desarrollo y que producción apunta a API HTTPS real. No enviar PII a logs/analytics.

## 3. Apache / one.com
- Consolidar un único public/.htaccess coordinado con los demás agentes. Respaldar configuración existente y preservar reglas necesarias. DirectoryIndex index.html o entrada verificada; archivos y directorios existentes deben servirse directamente.
- HTTPS y dominio canónico mediante 301 tras validar TLS y comportamiento del proxy del hosting; probar inicialmente redirección temporal si necesario. Evitar bucles, preservar path/query y no afectar subdominios/correo.
- Para SPA, fallback solo de rutas válidas cuando sea viable; para SSG servir HTML prerenderizado antes de fallback CSR. Recursos inexistentes deben devolver 404, no HTML con 200. Coordinar ErrorDocument 404 y rutas dinámicas con SEO. Probar acceso directo y F5.
- Cabeceras: X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, protección framing mediante CSP frame-ancestors y/o X-Frame-Options coherente, Permissions-Policy según funcionalidades. HSTS solo tras confirmar HTTPS estable; empezar con max-age corto y ampliar; no includeSubDomains/preload sin auditoría y aprobación.
- Diseñar CSP según inventario real: default-src, script-src, style-src, img-src, font-src, connect-src, frame-src, object-src none, base-uri, frame-ancestors y form-action. Empezar Report-Only; validar Angular, estilos, JSON-LD, consentimiento, API y terceros; no imponer nonces estáticos ni unsafe-eval; justificar excepciones. Aplicar enforcement solo tras pruebas. No introducir endpoint de reportes inexistente.
- Cache-Control: HTML y sitemap/robots con revalidación apropiada; JS/CSS con hash immutable y max-age largo; recursos sin hash con TTL prudente. No cachear datos privados. Verificar compresión gzip/Brotli disponible, MIME correctos y Vary cuando aplique. No activar módulos no soportados; si error 500, aislar directiva y restaurar backup.

## 4. Despliegue reproducible
- Crear o mejorar script PowerShell de build y empaquetado sin credenciales; verificar exit code, carpeta dist/construtic/browser, entrada HTML, .htaccess, robots y sitemap. Incluir dotfiles en ZIP, excluir código fuente, server SSR, .env, mapas privados, logs y backups. Conservar avisos de licencias aplicables.
- Generar manifiesto de archivos y checksum; probar localmente. Publicar solo contenido browser en raíz web, no carpeta browser completa. No borrar directorios ajenos ni volver a publicar desde Website Builder.
- Documentar backup fuera de raíz pública, subida de assets antes de HTML, conservación temporal de chunks anteriores, prueba de humo y rollback. SFTP con secretos gestionados externamente y verificación de host si se automatiza. No desplegar sin autorización.

## 5. Aceptación
- Verificar HTTPS, redirecciones, status 404, cabeceras, MIME, caché, compresión, CSP, API/CORS, formularios, idiomas, consentimiento y rutas directas. Usar curl.exe -I y curl.exe -IL, DevTools y herramientas SSL/cabeceras cuando disponibles. No confundir puntuación de escáner con seguridad garantizada.
- Entregar `docs/audit/security.md` con hallazgos priorizados, evidencias sin secretos, cambios, comandos, resultados, riesgos residuales, pasos manuales one.com y rollback. Registrar pruebas no ejecutadas y motivos.
