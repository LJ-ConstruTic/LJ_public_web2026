import { LanguageItem } from "../../core/model/language-dto";

export interface LanguageState {
  langs: LanguageItem[];
  loading: boolean;
  error: string | null;
  selectedCode: string | null; // 'es', 'pt', 'en', 'umb'
}

export const initialLanguageState: LanguageState = {
  langs: [],
  loading: false,
  error: null,
  selectedCode: null,
};

export const LOCALSTORAGE_KEY = 'ui-lang-code';