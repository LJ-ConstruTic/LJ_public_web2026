import { ComponentStore } from "@ngrx/component-store";
import { ComponentState, initialComponentState } from "./component.state";
import { inject, Injectable } from "@angular/core";
import { ComponentService } from "../../core/services/component.service";
import { ComponentDataModel, ComponentMenuItem } from "../../core/model/component-dto";
import { switchMap, tap } from "rxjs";


@Injectable()
export class ComponentAppStore extends ComponentStore<ComponentState> {
    readonly componentService = inject(ComponentService);

    readonly $items = this.selectSignal(state => state.items)
    readonly $menuItems = this.selectSignal(state => state.menuItems)
    readonly $loading = this.selectSignal(state => state.loading)
    readonly $error = this.selectSignal(state => state.error)

    constructor() {
        super(initialComponentState);
    }

    // Updaters:
    readonly setLoading = this.updater<boolean>((state, loading) => ({
        ...state,
        loading
    }));

    readonly setError = this.updater<string | null>((state, error) => ({
        ...state,
        error
    }));

    readonly setItems = this.updater<ComponentDataModel[]>((state, items) => ({
        ...state,
        items
    }));

    readonly setMenuItems = this.updater<ComponentMenuItem[]>((state, menuItems) => ({
        ...state,
        menuItems
    }));

    // Effects:
    readonly loadAllComponents = this.effect<void>((trigger$) =>
        trigger$.pipe(
            tap(() => {
                this.setLoading(true);
                this.setError(null);
            }),
            switchMap(() =>
                this.componentService.getAllComponents().pipe(
                    tap({
                        next: (response) => {
                            console.log('Component response:', response);
                            this.setItems(response.items ?? []);
                            this.setLoading(false);
                        },
                        error: (error) => {
                            console.error('Error loading components:', error);
                            this.setError('Error loading components');
                            this.setLoading(false);
                        },
                    })
                )
            )
        )
    );

    readonly loadMenu = this.effect<number>((trigger$) => 
        trigger$.pipe(
            tap(() => {
                this.setLoading(true);
                this.setError(null);
            }),
            switchMap((codeLanguage) => 
            this.componentService.getComponentMenu(codeLanguage).pipe(
                tap({
                next: (response) => {
                    console.log('Component response:', response);
                    this.setMenuItems(response.items ?? []);
                    this.setLoading(false);
                },
                error: (error) => {
                    console.error('Error loading components:', error);
                    this.setError('Error loading components');
                    this.setLoading(false);
                },
        })
      )
    )
  )
);

}