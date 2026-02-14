import { TranslateService } from '@ngx-translate/core';

export type LangKey = 'pt-AO' | 'pt' | 'es' | 'umb' | 'en';

const SUPPORTED: LangKey[] = ['pt-AO', 'pt', 'es', 'umb', 'en'];

export function pickBrowserLangSafe(translate: TranslateService): LangKey {
  const locale = (translate.getBrowserCultureLang() || '').toLowerCase();
  const exact = SUPPORTED.find(s => s.toLowerCase() === locale);
  if (exact) return exact;

  const base = (translate.getBrowserLang() || '').toLowerCase();
  const baseMatch = SUPPORTED.find(s => s.toLowerCase() === base);
  if (baseMatch) return baseMatch;

  return 'en';
}

