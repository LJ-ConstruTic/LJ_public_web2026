import { GroupDetail } from "../../core/model/group-details-dto";

export interface GroupDetailState {
    detail: GroupDetail | null;
    loading: boolean;
    error: string | null;
}

export const initialGroupDetailState: GroupDetailState = {
    detail: null,
    loading: false,
    error: null,
};