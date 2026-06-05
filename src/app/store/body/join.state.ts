import { ComponentTagsDescription } from "../../core/model/component-dto";

export interface JoinState {
  tags: ComponentTagsDescription | null;
  loading: boolean;
  error: string | null;
}

export const initialJoinState: JoinState = {
  tags: null,
  loading: false,
  error: null,
};