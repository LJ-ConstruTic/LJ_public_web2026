import { readFileSync, writeFileSync } from 'node:fs';

const source = readFileSync('src/environments/environments.prod.ts', 'utf8');
const api = source.match(/apiBaseUrl:\s*'(https:\/\/[^']+)'/)?.[1];
if (!api) throw new Error('Missing HTTPS production API.');

async function getPage(slug, lang) {
  const url = new URL(`${api}/pages/${slug}`);
  url.search = new URLSearchParams({ lang, site: 'main' });
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`${slug} (${lang}): HTTP ${response.status}`);
  const { page } = await response.json();
  if (page?.slug !== slug || page.language !== lang || page.fallbackLanguage ||
      !Array.isArray(page.sections) || !page.sections.length) {
    throw new Error(`${slug} (${lang}): incomplete CMS page`);
  }
  return page.sections.flatMap(section => section.blocks);
}

function* descendants(blocks) {
  for (const block of blocks) {
    yield block;
    yield* descendants(block.children);
  }
}

const pages = {};
const home = await getPage('page-home', 'pt');
for (const [type, section] of [['product', 'our-products'], ['service', 'our-services']]) {
  const slug = `page-${type}`;
  const ids = home.find(block => block.properties.section === section)?.children
    .filter(card => card.properties.page === slug).map(card => card.properties.productId);
  if (!ids?.length || new Set(ids).size !== ids.length ||
      ids.some(id => typeof id !== 'string' || !/^[a-z0-9-]+$/i.test(id))) {
    throw new Error(`${slug}: invalid or incomplete list of linked identifiers`);
  }
  for (const id of ids) pages[`${type}-detail/${id}`] = {};
  const languages = ['pt', 'en', 'es', 'umb'];
  const localized = await Promise.all(languages.map(lang => getPage(slug, lang)));
  for (const [index, blocks] of localized.entries()) {
    const lang = languages[index];
    const details = [...descendants(blocks)];
    for (const id of ids) {
      const block = details.find(item => item.id === id);
      const title = block?.content?.trim();
      const description = block?.children.find(item => item.type === 'text' && item.content?.trim())
        ?.content.trim().replace(/\s+/g, ' ');
      if (!title || !description) throw new Error(`${slug} (${lang}): missing detail copy for ${id}`);
      pages[`${type}-detail/${id}`][lang] = [title, description];
    }
  }
}
writeFileSync('src/app/seo-catalog.json', JSON.stringify(pages, null, 2) + '\n');
