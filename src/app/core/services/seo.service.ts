import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, PRIMARY_OUTLET } from '@angular/router';
import catalog from '../../seo-pages.json';
import details from '../../seo-catalog.json';

type Copy = Record<string, string[]>;
const pages: Record<string, Copy> = catalog.pages;
const detailPages: Record<string, Copy> = details;
const nonIndexable: Record<string, Copy> = catalog.nonIndexable;

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update(root: ActivatedRouteSnapshot, lang: string): void {
    const route = root.children.find(child => child.outlet === PRIMARY_OUTLET);
    const path = route?.routeConfig?.path ?? '**';
    const canonicalPath = path === 'privated' ? 'privacy' : path.replace(':id', route?.params['id'] ?? '');
    const page = Object.hasOwn(pages, canonicalPath) ? pages[canonicalPath] : detailPages[canonicalPath];
    const fallback = nonIndexable[path.split('/')[0]] ?? nonIndexable['not-found'];
    const [label, description] = page?.[lang] ?? page?.['en'] ?? fallback[lang] ?? fallback['en'];
    const title = `${label} | ${catalog.name}`;
    const canonical = page ? `${catalog.origin}/${canonicalPath}` : null;
    const image = catalog.origin + catalog.socialImage;

    this.document.documentElement.lang = lang;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: canonical ? 'index, follow' : 'noindex, follow' });
    for (const [key, content] of Object.entries({
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
    })) {
      this.meta.updateTag(key.startsWith('og:') ? { property: key, content } : { name: key, content });
    }

    const link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      const element = link ?? this.document.createElement('link');
      element.rel = 'canonical';
      element.href = canonical;
      if (!link) this.document.head.append(element);
      this.meta.updateTag({ property: 'og:url', content: canonical });
    } else {
      link?.remove();
      this.meta.removeTag('property="og:url"');
    }

    const existing = this.document.getElementById('organization-schema');
    if (path === '') {
      const schema = existing ?? this.document.createElement('script');
      schema.id = 'organization-schema';
      schema.setAttribute('type', 'application/ld+json');
      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: catalog.name,
        url: `${catalog.origin}/`,
        logo: catalog.origin + catalog.logo,
      });
      if (!existing) this.document.head.append(schema);
    } else {
      existing?.remove();
    }
  }
}
