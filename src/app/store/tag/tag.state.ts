import { TagDataModel } from "../../core/model/tags-dto";

export interface TagState {
  tags: TagDataModel[];
  selectedTag: TagDataModel | null;
  total: number;
  loading: boolean;
  error: string | null;
}

export const initialTagState: TagState = {
  tags: [],
  selectedTag: null,
  total: 0,
  loading: false,
  error: null,
};