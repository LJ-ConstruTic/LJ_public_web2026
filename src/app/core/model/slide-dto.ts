import { InternationalizationDataModel } from "./common-response-dto";

export interface Slide {
  title:   InternationalizationDataModel;
  context: InternationalizationDataModel;
  imgUrl:  string;
}

export interface TranslatedSlide {
  title:   string;
  context: string;
  imgUrl:  string;
}