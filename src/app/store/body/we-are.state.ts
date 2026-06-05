import { ComponentTagsDescription } from "../../core/model/component-dto";

export interface WeAreState {
  tags: ComponentTagsDescription | null;
  loading: boolean;
  error: string | null;
}

export const initialWeAreState: WeAreState = {
  tags: null,
  loading: false,
  error: null,
};