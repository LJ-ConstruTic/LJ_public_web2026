import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
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

  protected readonly title = signal('construtic');

  constructor(private readonly languageStore: LanguageStore) {
    this.languageStore.loadAll();
  }

  ngOnInit(): void {
    this.componentStore.loadAllComponents();
  }
}
