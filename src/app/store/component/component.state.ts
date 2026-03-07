import { ComponentDataModel, ComponentMenuItem } from "../../core/model/component-dto";

export interface ComponentState {
  items: ComponentDataModel[];
  menuItems: ComponentMenuItem[];
  loading: boolean;
  error: string | null;
}

export const initialComponentState: ComponentState = {
  items: [],
  menuItems: [],
  loading: false,
  error: null,
};