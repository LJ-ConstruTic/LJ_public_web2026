import { TagKey } from "../dictionary/tags-dictionary";
import { InternationalizationDataModel } from "./common-response-dto";

export interface TagDataModel {
  id: string;
  idx: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  keyLabel: string;
  internationalization: TagItem;
  imgUrl: string[];
}

export interface TagItem {
  keyLabel: string;
  tag: InternationalizationDataModel;
  imgUrl: string[];
}

export interface TeamMemberConfig {
  nameKey: TagKey;
  jobKey?: TagKey;
}