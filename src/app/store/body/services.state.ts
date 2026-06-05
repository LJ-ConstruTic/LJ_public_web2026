import { ComponentTagsDescription } from "../../core/model/component-dto";

export interface ServicesState {
  tags: ComponentTagsDescription | null;
  loading: boolean;
  error: string | null;
}

export const initialServicesState: ServicesState = {
  tags: null,
  loading: false,
  error: null,
};