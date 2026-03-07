import { LanguageDataModel } from "../../core/model/language-dto";

export interface LanguageState {
  items: LanguageDataModel[];
  loading: boolean;
  error: string | null;
  selectedCode: number | null;
}

export const initialLanguageState: LanguageState = {
  items: [],
  loading: false,
  error: null,
  selectedCode: null,
};