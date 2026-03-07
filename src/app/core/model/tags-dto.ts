import { InternationalizationDataModel } from "./common-response-dto";

export interface TagDataModel {
  id: string;
  idx: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  keyLabel: string;
  internationalization: InternationalizationDataModel;
  imgUrl: string[];
}