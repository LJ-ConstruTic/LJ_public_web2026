import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import ts from 'typescript';

const catalog = JSON.parse(readFileSync('src/app/seo-pages.json', 'utf8'));
const details = JSON.parse(readFileSync('src/app/seo-catalog.json', 'utf8'));
const routes = ts.createSourceFile(
  'app.routes.ts', readFileSync('src/app/app.routes.ts', 'utf8'), ts.ScriptTarget.Latest,
);
const paths = new Set();
function visit(node) {
  if (ts.isObjectLiteralExpression(node)) {
    const path = node.properties.find(property => property.name?.getText(routes) === 'path');
    const component = node.properties.some(property => property.name?.getText(routes) === 'loadComponent');
    if (component && path && ts.isPropertyAssignment(path) && ts.isStringLiteral(path.initializer)) {
      paths.add(path.initializer.text);
    }
  }
  ts.forEachChild(node, visit);
}
visit(routes);

const escape = value => value.replace(/[&<>"']/g, character =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const url = path => `${catalog.origin}/${path}`;
const entries = Object.keys(catalog.pages);
if (!entries.length || entries.some(path => !paths.has(path) || !/^[a-z/-]*$/.test(path))) {
  throw new Error('SEO metadata references an invalid public route.');
}
for (const type of ['service-detail', 'product-detail']) {
  const matching = Object.keys(details).filter(path => path.startsWith(type + '/'));
  if (!paths.has(type + '/:id') || !matching.length ||
      matching.some(path => !/^[a-z0-9-]+$/i.test(path.split('/').slice(1).join('/')) ||
        details[path].pt?.length !== 2 || details[path].pt.some(value => !value))) {
    throw new Error(`Incomplete public catalog for ${type}.`);
  }
  entries.push(...matching);
}
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map(path => `  <url><loc>${escape(url(path))}</loc></url>`),
  '</urlset>',
  '',
].join('\n');

if (process.argv[2] === '--sitemap') {
  writeFileSync('public/sitemap.xml', sitemap);
} else {
  const browser = process.argv[2] ?? 'dist/construtic/browser';
  const base = readFileSync(join(browser, 'index.html'), 'utf8');
  if (!base.includes('</head>') || !/<title>[^<]*<\/title>/.test(base)) {
    throw new Error('Missing expected Angular HTML head.');
  }
  const image = catalog.origin + catalog.socialImage;
  const heroSources = '/img/carrusel/hero-cms-720.webp 720w, /img/carrusel/hero-cms-1000.webp 1000w';
  const homeShell = `<div id="home-preview">
    <div class="home-preview-bar">
      <img src="/img/logo.svg" alt="LJConstruTic" class="home-preview-logo">
    </div>
    <div class="home-preview-hero">
      <picture><source type="image/webp" srcset="${heroSources}" sizes="100vw">
        <img src="/img/carrusel/hero-cms-720.webp" width="720" height="408"
             alt="Profissional da construção com capacete e colete de segurança" fetchpriority="high">
      </picture>
      <div class="home-preview-copy"><h1>Construção com rigor em cada etapa.</h1></div>
    </div>
  </div>`;
  const homeStyles = `<style>
    #home-preview{position:absolute;inset:0 0 auto;z-index:2;pointer-events:none}
    app-root[data-entry="home"] > main{min-height:100svh}
    .home-preview-bar{display:flex;align-items:center;min-height:5.6rem;padding:.7rem clamp(.75rem,3vw,2rem);background:#061a30}
    .home-preview-logo{width:clamp(7.7rem,calc(16vw + .7rem),12.7rem);height:4.2rem;object-fit:contain;padding:.35rem;background:white;border-radius:.5rem}
    .home-preview-hero{position:relative;display:grid;align-items:end;height:clamp(21rem,58vw,37rem);overflow:hidden;isolation:isolate;background:#123c69}
    .home-preview-hero img,.home-preview-hero::after{position:absolute;inset:0;width:100%;height:100%}
    .home-preview-hero img{z-index:-2;object-fit:cover}
    .home-preview-hero::after{content:'';z-index:-1;background:linear-gradient(90deg,#0a2848e8,#123c6966),linear-gradient(0deg,#0a2848eb,transparent 75%)}
    .home-preview-copy{width:min(100%,1200px);margin-inline:auto;padding:clamp(1.25rem,5vw,4.5rem);color:white}
    .home-preview-copy::before{content:'';display:block;width:3.25rem;height:.3rem;margin-bottom:1.25rem;border-radius:999px;background:#0a7a75}
    .home-preview-copy h1{max-width:24ch;margin:0;font-size:clamp(1.6rem,4.2vw,3.65rem);font-weight:700;line-height:1.16;letter-spacing:-.035em}
  </style>`;
  if (!base.includes('<app-root></app-root>')) throw new Error('Missing Angular root element.');
  function render(output, label, description, canonical, organization = false) {
    const title = label ? `${label} | ${catalog.name}` : catalog.name;
    const tags = Object.entries({
      description,
      robots: canonical ? 'index, follow' : 'noindex, follow',
      'og:type': 'website',
      'og:site_name': catalog.name,
      'og:title': title,
      'og:description': description,
      'og:image': image,
      'og:image:width': String(catalog.socialImageWidth),
      'og:image:height': String(catalog.socialImageHeight),
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image,
      ...(canonical ? { 'og:url': canonical } : {}),
    }).map(([key, value]) =>
      `<meta ${key.startsWith('og:') ? 'property' : 'name'}="${key}" content="${escape(value)}">`);
    if (canonical) tags.push(`<link rel="canonical" href="${escape(canonical)}">`);
    if (organization) {
      tags.push(`<link rel="preload" as="image" type="image/webp" imagesrcset="${heroSources}" imagesizes="100vw" fetchpriority="high">`);
      tags.push(homeStyles);
      const schema = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: catalog.name,
        url: url(''),
        logo: catalog.origin + catalog.logo,
      }).replaceAll('<', '\\u003c');
      tags.push(`<script id="organization-schema" type="application/ld+json">${schema}</script>`);
    }
    let html = base.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
      .replace('</head>', `${tags.join('\n')}\n</head>`);
    if (organization) {
      html = html.replace('<app-root></app-root>', `${homeShell}<app-root data-entry="home"></app-root>`);
    } else if (output === '404.html') {
      html = html.replace('<app-root></app-root>',
        `<app-root><main class="component-container"><h1>${escape(label)}</h1><p>${escape(description)}</p><a href="/">${escape(catalog.name)}</a></main></app-root>`);
    }
    writeFileSync(join(browser, output), html);
  }
  for (const path of entries) {
    const output = path ? `route-html/${path}.html` : 'index.html';
    mkdirSync(dirname(join(browser, output)), { recursive: true });
    render(output, ...(catalog.pages[path] ?? details[path]).pt, url(path), !path);
  }
  render('index.csr.html', '', catalog.pages[''].pt[1], null);
  render('404.html', ...catalog.nonIndexable['not-found'].pt, null);
  writeFileSync(join(browser, 'sitemap.xml'), sitemap);
}
