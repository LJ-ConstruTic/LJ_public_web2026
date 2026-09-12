import { LanguageItem } from "./language-dto";

export interface BootstrapResponse {
  site: SiteInfo;
  language: string;
  languages: LanguageItem[];
  sections: SectionPage[];
}

export interface PageResponse {
  page: Page;
  meta: PageMeta;
}

export interface Page {
  id: string;
  slug: string;
  route: string;
  pageType: string;
  language: string;
  fallbackLanguage?: string;
  version?: string;
  title: string;
  description?: string;
  seo?: Record<string, unknown>;
  sections: SectionPage[];
}

export interface SectionPage {
  id: string;
  key: string;
  type: string;
  scope: string;       // 'global' | 'page'
  order: number;
  settings?: Record<string, unknown>;
  blocks: Block[];
}

export interface Block {
  id: string;
  key: string;
  type: string;
  htmlTag?: string;
  order: number;
  content?: string;
  altText?: string;
  ariaLabel?: string;
  properties?: Record<string, unknown>;
  media?: Media[];
  children?: Block[];
}

export interface Media {
  id: string;
  type: string;
  url: string;
  mimeType?: string;
  width?: number;
  height?: number;
  role?: string;
  order: number;
}

export interface SiteInfo {
  code: string;
  name: string;
  defaultLanguage: string;
}

export interface PageMeta {
  generatedAt: string;
  etag: string;
}
