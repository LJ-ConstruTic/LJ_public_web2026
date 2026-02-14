export type ThemePref = 'system' | 'light' | 'dark';

export type ThemeState = {
  pref: ThemePref;
};

export const STORAGE_KEY = 'theme-pref';

export const initialThemeState: ThemeState = {
  pref: 'system', // inicia con lo que haya en el sistema
};