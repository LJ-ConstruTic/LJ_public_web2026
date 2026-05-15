import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { firstValueFrom } from 'rxjs';

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors  } from '@angular/common/http';



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

// impor service Auth 
import { AuthService } from '../app/auth/AuthService';
import { publicJwtInterceptor } from '../app/auth/AuthInterceptor';


export function initPublicSession() {
  return () => {
    const auth = inject(AuthService);
    const tagStore = inject(TagStore);

    // Siempre nueva autenticación al levantar la app
    auth.clearSession();

    return firstValueFrom(auth.startPublicSession()).then(() => {tagStore.loadAllTags()}).catch((err) => {
      console.error('Public session failed:', err);
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    LanguageStore,
    TagStore,
    ComponentAppStore,
    {
      provide: API_BASE_URL,
      useValue: environment.apiBaseUrl,
    },
    provideAnimations(),
    provideHttpClient(withFetch(), withInterceptors([publicJwtInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })), 
    provideClientHydration(withEventReplay()),
    {
      provide: APP_INITIALIZER,
      useFactory: initPublicSession,
      multi: true,
    },
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
  ]
};


/*

Chuleta:

1. APP_INITIALIZER → llama a /v1/Login → guarda los tokens en localStorage
2. El interceptor añade automáticamente el token a cada petición HTTP
3. Si una petición devuelve 401 (token expirado) → el interceptor llama a /v1/Refresh para renovarlo y reintenta la petición
4. Si el refresh también falla → hace un login nuevo desde cero

*/