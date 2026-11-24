import { computed, Injectable, signal } from '@angular/core';

type Choice = 'accepted' | 'rejected';
const storageKey = 'construtic-cookie-preferences-v1';
const preferenceDuration = 180 * 24 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class CookiePreferencesService {
  private readonly choice = signal<Choice | null>(this.readChoice());
  private readonly settingsOpen = signal(false);

  readonly externalMapAllowed = computed(() => this.choice() === 'accepted');
  readonly visible = computed(() => this.settingsOpen() || this.choice() === null);

  open(): void {
    this.settingsOpen.set(true);
  }

  save(choice: Choice): void {
    this.choice.set(choice);
    this.settingsOpen.set(false);
    try {
      localStorage.setItem(storageKey, JSON.stringify({ choice, expiresAt: Date.now() + preferenceDuration }));
    } catch {
      // The preference still applies for this visit if storage is blocked.
    }
  }

  private readChoice(): Choice | null {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
      if (value?.expiresAt > Date.now() && (value.choice === 'accepted' || value.choice === 'rejected')) {
        return value.choice;
      }
    } catch {
      // Missing or unavailable storage leaves optional content disabled.
    }
    return null;
  }
}
