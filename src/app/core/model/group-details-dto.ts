import { InternationalizationDataModel } from "./common-response-dto";

export interface GroupDetailItem {
  id: string;
  idx: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  internationalization: {
    keyLabel: string;
    tagHtml: string;
    tag: InternationalizationDataModel;
    imgUrl: string[];
  };
}

export interface GroupDetail {
  size: number;
  items: GroupDetailItem[];
}
