import { ComponentTagsDescription } from "../../core/model/component-dto";

export interface ComponentTagState {
  tags: ComponentTagsDescription | null;
  loading: boolean;
  error: string | null;
}

export const initialComponentTagState: ComponentTagState = {
  tags: null,
  loading: false,
  error: null,
};