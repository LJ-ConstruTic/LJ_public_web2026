import { Injectable } from "@angular/core";
import { initialThemeState, STORAGE_KEY, ThemePref, ThemeState } from "./theme.state";
import { distinctUntilChanged, fromEventPattern, map, tap, withLatestFrom } from "rxjs";
import { parseThemePref, systemPrefersDark } from "../../utils/theme.utils";
import { ComponentStore } from '@ngrx/component-store';


@Injectable({ providedIn: 'root' })
export class ThemeStore extends ComponentStore<ThemeState> {
  constructor() {
    super(initialThemeState);
  }

  // SELECTORS
  readonly pref$ = this.select(state => state.pref).pipe(distinctUntilChanged());

  readonly isDark$ = this.select(state => {
    if (state.pref === 'dark') return true;
    if (state.pref === 'light') return false;
    return systemPrefersDark();
  }).pipe(distinctUntilChanged());

  // UPDATERS
  readonly setPref = this.updater<ThemePref>((state, pref) => ({ ...state, pref }));

  get storage(): Storage | null {
    const ls: any = (globalThis as any).localStorage;
    return (ls && typeof ls.getItem === 'function' && typeof ls.setItem === 'function') ? (ls as Storage) : null;
  }

  // Init() Sólo se llama 1 vez al arrancar
  init(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const saved = this.storage?.getItem(STORAGE_KEY) ?? null;
    this.setPref(parseThemePref(saved)); // cargar preferencia guardada

    this.persistPrefEffect(this.pref$); // persistir cuando cambia pref

    this.applyDomClassEffect(this.isDark$); // aplicar clase cuando cambia isDark

    this.listenSystemEffect(); // si pref=system, re-aplicar
  }

  // Effects
  readonly persistPrefEffect = this.effect<ThemePref>((pref$) =>
    pref$.pipe(
      tap((pref) => {
        this.storage?.setItem(STORAGE_KEY, pref);
        // if (typeof localStorage === 'undefined') return;
        //   localStorage.setItem(STORAGE_KEY, pref);
      })
    )
  );

  private readonly applyDomClassEffect = this.effect<boolean>((isDark$) => // aplica la clase
    isDark$.pipe(
      tap((isDark) => {
        if (typeof document === 'undefined') return;
        document.documentElement.classList.toggle('app-dark', isDark);
      })
    )
  );

  private listenSystemEffect(): void {
    if (typeof window === 'undefined') return;
    const matchMedia = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!matchMedia) return;

    const handler = () => { // solo si el usuario está en "system"
      if (this.get().pref !== 'system') return;

      if (typeof document === 'undefined') return; // re-evaluar clase usando el isDark efectivo actual
      document.documentElement.classList.toggle('app-dark', systemPrefersDark());
    };

    matchMedia.addEventListener?.('change', handler);
  }

  // Funciones de theme switch (botón nav-bar)
  toggle(): void {
    const pref = this.get().pref;
    console.log('toggle', pref);

    if (pref === 'dark') {
      this.setPref('light');
      return;
    }

    if (pref === 'light') {
      this.setPref('dark');
      return;
    }

    // pref === 'system' -> decide a partir del sistema y cambia al contrario
    const sysDark = systemPrefersDark();
    this.setPref(sysDark ? 'light' : 'dark');
  }

  setSystem(): void {
    this.setPref('system');
  }

  setLight(): void {
    this.setPref('light');
  }

  setDark(): void {
    this.setPref('dark');
  }

}