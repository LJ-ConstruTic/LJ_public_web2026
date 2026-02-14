import { TranslateService } from '@ngx-translate/core';
import { pickBrowserLangSafe } from './lang';


export function initI18n(translate: TranslateService) {
    translate.setFallbackLang('en');
    translate.use(pickBrowserLangSafe(translate));
}