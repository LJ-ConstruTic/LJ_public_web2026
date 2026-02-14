import { Injectable } from "@angular/core";
import { TranslateLoader } from "@ngx-translate/core";
import { Observable, of } from "rxjs";

import ptTranslations from './languages/pt.json';
import esTranslations from './languages/es.json';
import umbTranslations from './languages/umb.json';
import enTranslations from './languages/en.json';

type LangKey = 'pt-AO' | 'pt' | 'es' | 'umb' | 'en';

@Injectable()
export class BackendTranslateLoader implements TranslateLoader {
  private translations: { [key: string]: any } = {
    'pt-AO': ptTranslations,
    'es': esTranslations,
    'umb': umbTranslations,
    'en': enTranslations
  };

  getTranslation(lang: string): Observable<any> {
    return of(this.translations[(lang as LangKey)] ?? this.translations['en']);
  }
}