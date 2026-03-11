import { TranslateService } from '@ngx-translate/core';

export type LangKey = 'pt' | 'es' | 'umb' | 'en';

const SUPPORTED: LangKey[] = ['pt', 'es', 'umb', 'en'];


// Le pregunta al navegador qué idioma tiene configurado y lo mapea a 'pt' | 'es' | 'umb' | 'en'
export function getBrowserLang(translate: TranslateService): LangKey {
  const locale = (translate.getBrowserCultureLang() || '').toLowerCase();
  const exact = SUPPORTED.find(s => s.toLowerCase() === locale); // Primero intenta match exacto con cultura: 'es-ES', 'pt-PT'
  if (exact) return exact;

  // Si no, intenta solo la base: 'es', 'pt'...
  const base = (translate.getBrowserLang() || '').toLowerCase();
  const baseMatch = SUPPORTED.find(s => s.toLowerCase() === base);
  if (baseMatch) return baseMatch;

  // Si el navegador tiene un idioma no soportado → inglés por defecto
  return 'en';
}

