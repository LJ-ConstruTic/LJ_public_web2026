import { ComponentTagsDescription } from "../../core/model/component-dto";

export interface GoalsState {
  tags: ComponentTagsDescription | null;
  loading: boolean;
  error: string | null;
}

export const initialGoalsState: GoalsState = {
  tags: null,
  loading: false,
  error: null,
};