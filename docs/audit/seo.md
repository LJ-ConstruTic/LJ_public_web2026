# SEO e indexación

## Auditoría y decisiones

- **Implementado.** Los metadatos en portugués están en el HTML inicial del paquete. Angular actualiza título, descripción, robots, canonical, Open Graph, Twitter Card y el atributo `lang` al navegar. El catálogo editorial incluye portugués, inglés y español para las rutas corporativas. Las fichas usan los textos del CMS en portugués, inglés, español y Umbundu. En las rutas corporativas y el 404, Umbundu usa los metadatos en inglés hasta disponer de traducción revisada.
- **Implementado.** Organization en la portada con el nombre, la URL y el logo existentes. La imagen social de 1200 × 630 se deriva del hero público. Los proyectos y testimonios ilustrativos quedaron fuera de los datos estructurados.
- **Implementado.** El generador valida rutas Angular y publica las fichas que se enlazan desde la portada cuyo ID también existe en el detalle. Los endpoints `/pages/{slug}` devuelven la página completa con sus bloques y carecen de paginación en el contrato actual. La actualización falla si falta la sección, alguna ficha, su título o descripción. El paquete usa la captura versionada por defecto. Usar `-RefreshCatalog` para comprobar cambios en el CMS.
- **Implementado.** Los enlaces legales del pie tienen destinos rastreables. `/about` apunta a `/about/about-detail` y `/privated` a `/privacy`. No hay un inventario verificable de URLs antiguas adicionales de Website Builder.
- **Pendiente.** La compilación entrega un HTML por URL con su cabecera SEO y el cuerpo se renderiza en el navegador. El SSG nativo de Angular 20 es compatible con alojamiento estático, pero el código de servidor existente declara CSR para todas las rutas y la interfaz depende del CMS y de la selección de idioma en el navegador. El siguiente paso sería ensayar prerender estático como configuración separada con un catálogo público versionado y comprobar navegación, hidratación, idioma y ausencia de datos privados. [Prerendering de Angular](https://angular.dev/guide/prerendering)
- **Pendiente.** GA4 queda desactivado. Hace falta el ID real y definir la integración con consentimiento antes de añadir eventos. El consentimiento de mapa existente se mantiene separado. No se añadieron `hreflang` porque el idioma no cambia la URL.

## Inventario de URLs

Las entradas indexables usan canonical en el dominio raíz HTTPS y apuntan a sí mismas. La descripción y las variantes locales de cada entrada se conservan en `src/app/seo-pages.json` y `src/app/seo-catalog.json`. Los estados HTTP de esta tabla son los previstos para el paquete.

| URL | Título base PT | HTTP | Indexación |
|---|---|---:|---|
| `/` | Construção e tecnologia | 200 | Sí |
| `/about/about-detail` | Quem somos | 200 | Sí |
| `/news/news-detail` | Notícias | 200 | Sí |
| `/privacy` | Política de privacidade | 200 | Sí |
| `/term-condition` | Termos e condições | 200 | Sí |
| `/date-protect` | Proteção de dados | 200 | Sí |
| `/cookies` | Política de cookies | 200 | Sí |
| `/product-detail/:id` | Minha Saúde, Umbundu e Cultura, Orçamento e Custo, Mineria de Dados | 200 | 4 IDs verificados |
| `/service-detail/:id` | Construção, Tecnologia, Reparações, Venda | 200 | 4 IDs verificados |
| Detalle con ID fuera de la captura | Metadatos genéricos de producto o servicio | 200 CSR | `noindex` hasta incluirlo en el siguiente paquete |
| `/about`, `/privated` | Sus destinos equivalentes | 301 | Solo el destino |
| `/not-found`, ruta desconocida | Página não encontrada | 404 | No |

Apex y `www` devolvieron 200 por HTTPS antes del despliegue. El origen declarado usa el apex, coherente con el sitemap inicial y el origen aceptado por la API. Confirmar el redireccionamiento antes de convertir el 302 en 301.

**Verificado localmente.** Los 15 destinos del sitemap tenían una canonical única y coincidente en el HTML del ZIP. Se comprobó JSON-LD, dimensiones declaradas de la imagen social, `noindex` del 404, acceso directo en Chrome y estados HTTP bajo Apache. La página de error incluye texto portugués en el documento inicial y actualiza su idioma en Angular.

## Operación

Verificar la propiedad **Dominio** en Search Console con el registro TXT que Google proporcione. Tras publicar y confirmar los estados HTTP y las canónicas, enviar `sitemap.xml` e inspeccionar la portada, una página legal y una ficha. Revisar también enlaces sociales y HTML inicial. [Verificación de una propiedad en Search Console](https://support.google.com/webmasters/answer/34592)

Para revertir, restaurar juntos los HTML, sitemap, robots y reglas de ruta del paquete anterior. Conservar los chunks antiguos durante la transición.
