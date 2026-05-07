import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { BackendTranslateLoader } from '../assets/i18n/language-translate-loader';
import Lara from '@primeuix/themes/lara';
import { initI18n } from '../assets/i18n/i18n.init';
import { providePrimeNG } from 'primeng/config';
import { ThemeStore } from './store/theme/theme.store';
import { provideAnimations } from '@angular/platform-browser/animations';
import { API_BASE_URL } from '../api.tokens';
import { environment } from '../environments/environments';
import { LanguageStore } from './store/language/language.store';
import { TagStore } from './store/tag/tag.store';
import { ComponentAppStore } from './store/component/component.store';

export const appConfig: ApplicationConfig = {
  providers: [
    LanguageStore,
    TagStore,
    ComponentAppStore,
    provideAppInitializer(() => { // load all tags by default donde sea
      const tagStore = inject(TagStore);
      tagStore.loadAllTags();
    }),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })), 
    provideClientHydration(withEventReplay()),
    importProvidersFrom(
      TranslateModule.forRoot({
        fallbackLang: 'en',
        loader: {
          provide: TranslateLoader,
          useClass: BackendTranslateLoader,
        },
      })
    ),
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      initI18n(translate);
    }),
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: '.app-dark'
        }
      }
    }),
    provideAppInitializer(() => {
      inject(ThemeStore).init();
    }),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
  ]
};
