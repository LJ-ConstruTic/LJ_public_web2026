import { ComponentStore } from "@ngrx/component-store";
import { initialServicesState, ServicesState } from "./services.state";
import { ComponentService } from "../../core/services/component.service";
import { inject, Injectable } from "@angular/core";
import { ComponentTagsDescription } from "../../core/model/component-dto";
import { catchError, EMPTY, switchMap, tap } from "rxjs";

@Injectable()
export class ServicesStore extends ComponentStore<ServicesState> {
    private readonly componentService = inject(ComponentService);

    readonly tags$ = this.select((s) => s.tags);
    readonly loading$ = this.select((s) => s.loading);
    readonly error$ = this.select((s) => s.error);

    constructor() {
        super(initialServicesState);
    }

    // Updaters
    private readonly setTags = this.updater((state, tags: ComponentTagsDescription) => ({
        ...state, tags,
    }));

    private readonly setLoading = this.updater((state, loading: boolean) => ({
        ...state, loading,
    }));

    private readonly setError = this.updater((state, error: string | null) => ({
        ...state, error,
    }));

    // Effect
    readonly loadServicesTags = this.effect<string>((id$) =>
        id$.pipe(
            tap(() => {
                this.setLoading(true);
                this.setError(null);
            }),
            switchMap((id) =>
                this.componentService.getTagsByComponentId(id).pipe(
                    tap((response: any) => {
                        const tags = response?.items ? response : { items: response };
                        console.log('Services tags normalizados:', tags);
                        this.setTags(tags);
                        this.setLoading(false);
                    }),
                    catchError(() => {
                        this.setError('Error al cargar los tags');
                        this.setLoading(false);
                        return EMPTY;
                    })
                )
            )
        )
    );
}