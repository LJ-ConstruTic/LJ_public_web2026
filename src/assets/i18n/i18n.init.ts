import { TranslateService } from '@ngx-translate/core';
import { getBrowserLang } from './lang';


export function initI18n(translate: TranslateService) {
    translate.setFallbackLang('en');
    translate.use(getBrowserLang(translate));
}