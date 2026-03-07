import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { CommonModule } from '@angular/common';
import { LanguageStore } from './store/language/language.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [],
})
export class App {
  protected readonly title = signal('construtic');

  constructor(private readonly languageStore: LanguageStore) {
    this.languageStore.loadAll();
  }
}
