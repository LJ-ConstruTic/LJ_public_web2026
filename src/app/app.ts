import { Component, effect, inject, signal, untracked } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LanguageStore } from './store/language/language.store';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ComponentAppStore } from './store/component/component.store';
import { RouterLink } from '@angular/router';
import { CookiePreferencesService } from './core/services/cookie-preferences.service';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [],
})
export class App {
  protected readonly cookiePreferences = inject(CookiePreferencesService);
  private readonly languageStore = inject(LanguageStore);
  private readonly componentStore = inject(ComponentAppStore);

  protected readonly title = signal('construtic');

  // Signals expuestos para el template
  protected readonly isLoading = this.componentStore.$loading;
  protected readonly hasError = this.componentStore.$error;

  constructor() {
    const router = inject(Router);
    const seo = inject(SeoService);
    const navigation = toSignal(router.events.pipe(filter(event => event instanceof NavigationEnd)));
    effect(() => {
      if (navigation()) {
        seo.update(router.routerState.snapshot.root, this.languageStore.$selectedCodeLang() ?? 'pt');
      }
    });

    this.languageStore.loadAllLanguages();

    effect(() => { // se ejecuta cada vez que $selectedCode, el idioma cambia. Al inicio se seteó cunado se cargó la lengua loadAllLanguages().
      const selectedLanguageCode = this.languageStore.$selectedCodeLang();

      // Mientras no se haya resuelto el idioma, no hacemos nada.
      if (!selectedLanguageCode) {
        return;
      }

      untracked(() => {
        this.componentStore.loadPageBySlug({ slug: 'page-menu', lang: selectedLanguageCode });
        this.componentStore.loadPageBySlug({ slug: 'page-footer', lang: selectedLanguageCode });
      });
    });
  }
}
