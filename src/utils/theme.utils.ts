import { STORAGE_KEY, ThemePref } from "../app/store/theme.state";

const ALLOWED: ThemePref[] = ['system', 'light', 'dark'];

export function parseThemePref(value: string | null): ThemePref {
  return value === 'dark' || value === 'light' || value === 'system' ? value : 'system';
}

export function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches;
}