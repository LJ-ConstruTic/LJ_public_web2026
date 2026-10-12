import { Type } from "@angular/core";
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

export interface PageSeo {
  title: string | null;
  description: string | null;
}

export interface Page {
  id: string;
  slug: string;
  route: string;
  pageType: string;
  language: string;
  fallbackLanguage: string | null;
  version?: string;
  title: string;
  description: string | null; 
  seo: PageSeo | null;
  sections: SectionPage[];
}

export interface SectionPage {
  id: string;
  key: string;
  type: string;
  scope: string;
  order: number;
  settings?: Record<string, unknown>;
  blocks: Block[];
}

export interface Block {
  id: string;
  key: string;
  type: string;
  htmlTag: string | null;
  order: number;
  content: string | null;
  altText: string | null;
  ariaLabel: string | null;
  properties: Record<string, unknown>;
  media: Media[];
  children: Block[];
}

export interface Media {
  id: string;
  type: string;
  url: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  role: string | null;
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

export interface BlockWithComponent {
  block: Block;
  component: Type<any> | null;
  sectionKey: string | null;
}