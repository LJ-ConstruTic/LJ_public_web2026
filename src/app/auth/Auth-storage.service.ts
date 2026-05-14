import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthStorageService {

  private platformId = inject(PLATFORM_ID);

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  set(key: string, value: string): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(key, value);
  }

  get(key: string): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem(key);
  }

  remove(key: string): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.removeItem(key);
  }
}