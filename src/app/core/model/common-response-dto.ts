export interface CommonModelResponse<T> {
  size: number;
  items: T[];
}

export interface InternationalizationDataModel {
  pt: string;
  umb: string;
  en: string;
  es: string;
}