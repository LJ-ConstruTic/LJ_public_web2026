import { inject, Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { ComponentTagState, initialComponentTagState } from "./tagsByComponent.state";
import { ComponentService } from "../../core/services/component.service";
import { ComponentTagsDescription } from "../../core/model/component-dto";
import { catchError, EMPTY, switchMap, tap } from "rxjs";

@Injectable()
export class GetComponentTagsStore extends ComponentStore<ComponentTagState> {
    private readonly componentService = inject(ComponentService);

    constructor() {
        super(initialComponentTagState);
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
    readonly loadComponentTags = this.effect<string>((id$) =>
        id$.pipe(
            tap(() => {
                this.setLoading(true);
                this.setError(null);
            }),
            switchMap((id) =>
                this.componentService.getTagsByComponentId(id).pipe(
                    tap((response: any) => {
                        const tags = response?.items ? response : { items: response };
                        console.log('Component tags', tags);
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