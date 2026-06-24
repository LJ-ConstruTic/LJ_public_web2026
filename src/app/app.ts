import { Component, PLATFORM_ID, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LanguageStore } from './store/language/language.store';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ComponentAppStore } from './store/component/component.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [],
})
export class App implements OnInit {
  private readonly componentStore = inject(ComponentAppStore);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly title = signal('construtic');

  constructor(private readonly languageStore: LanguageStore) {
    if (isPlatformBrowser(this.platformId)) {
      this.languageStore.loadAll();
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.componentStore.loadAllComponents();
    }
  }
}
