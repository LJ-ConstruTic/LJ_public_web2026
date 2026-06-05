import { inject, Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { ComponentService } from "../../core/services/component.service";
import { initialWeAreState, WeAreState } from "./we-are.state";
import { catchError, EMPTY, map, switchMap, tap } from "rxjs";
import { ComponentTagsDescription } from "../../core/model/component-dto";

@Injectable()
export class WeAreStore extends ComponentStore<WeAreState> {
    private readonly componentService = inject(ComponentService);

    constructor() {
        super(initialWeAreState);
    }

    readonly tags$ = this.select((s) => s.tags);
    readonly error$ = this.select((s) => s.error);

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
    readonly loadWeAreTags = this.effect<string>((id$) =>
        id$.pipe(
            tap(() => {
                this.setLoading(true);
                this.setError(null);
            }),
            switchMap((id) =>
                this.componentService.getTagsByComponentId(id).pipe(
                    tap((tags) => {
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