import { ComponentStore } from "@ngrx/component-store";
import { inject, Injectable } from "@angular/core";
import { GroupDetailState, initialGroupDetailState } from "./group-detail.state";
import { catchError, EMPTY, switchMap, tap } from "rxjs";
import { GroupDetail } from "../../core/model/group-details-dto";
import { ComponentService } from "../../core/services/component.service";

@Injectable()
export class GetGroupDetailsStore extends ComponentStore<GroupDetailState> {
    private readonly componentService = inject(ComponentService);

    constructor() {
        super(initialGroupDetailState);
    }

    readonly detail$ = this.select((s) => s.detail);
    readonly loading$ = this.select((s) => s.loading);
    readonly error$ = this.select((s) => s.error);

    private readonly setDetail = this.updater((state, detail: GroupDetail) => ({
        ...state, detail,
    }));

    private readonly setLoading = this.updater((state, loading: boolean) => ({
        ...state, loading,
    }));

    private readonly setError = this.updater((state, error: string | null) => ({
        ...state, error,
    }));

    readonly loadDetail = this.effect<string>((id$) =>
        id$.pipe(
            tap(() => {
                this.setLoading(true);
                this.setError(null);
            }),
            switchMap((tagId) =>
                this.componentService.getGroupDetailsById(tagId).pipe(
                    tap((response) => {
                        console.log('GroupDetail:', response);
                        this.setDetail(response);
                        this.setLoading(false);
                    }),
                    catchError(() => {
                        this.setError('Error al cargar el detalle');
                        this.setLoading(false);
                        return EMPTY;
                    })
                )
            )
        )
    );
}