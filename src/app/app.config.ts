import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { BackendTranslateLoader } from '../assets/i18n/language-translate-loader';
import Lara from '@primeuix/themes/lara';
import { initI18n } from '../assets/i18n/i18n.init';
import { providePrimeNG } from 'primeng/config';
import { ThemeStore } from './store/theme.store';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
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
  ]
};
