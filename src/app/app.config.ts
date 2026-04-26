import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

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

export const appConfig: ApplicationConfig = {
  providers: [
    LanguageStore,
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
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
