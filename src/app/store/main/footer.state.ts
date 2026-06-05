import { ComponentTagsDescription } from "../../core/model/component-dto";

export interface FooterState {
  tags: ComponentTagsDescription | null;
  loading: boolean;
  error: string | null;
}

export const initialFooterState: FooterState = {
  tags: null,
  loading: false,
  error: null,
};