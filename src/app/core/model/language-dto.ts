export interface LanguageItem {
  code: string;
  name: string;
  nativeName: string;
  order: number;
}

export interface LanguagesResponse {
  items: LanguageItem[];
}