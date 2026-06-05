import { ComponentTagsDescription } from "../../core/model/component-dto";

export interface ProductsState {
  tags: ComponentTagsDescription | null;
  loading: boolean;
  error: string | null;
}

export const initialProductsState: ProductsState = {
  tags: null,
  loading: false,
  error: null,
};