import { ComponentStore } from "@ngrx/component-store";
import { ComponentState, initialComponentState } from "./component.state";
import { computed, inject, Injectable } from "@angular/core";
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

    // Transformar $menuItems (ComponentMenuItem[]) a MenuItem[] que es lo que pide primeng
    readonly $menuConverted = computed(() =>
        this.$menuItems().map(item => ({
            label: item.tag,
            id: item.id,
            items: item.tagsParent.length ?
                item.tagsParent.map(child => 
                ({
                    label: child.tag,
                    id: child.id,
                }))
                : undefined,
        }))
    );

    readonly $activeComponents = computed(() => 
        this.$items().filter(c => c.isActive).sort((a, b) => a.idx - b.idx)
    );

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
                            console.log('Component TODOS LSO COMPONENTES:', response);
                            const filtered = (response.items ?? []).filter(item => item.name !== 'Menu');
                            this.setItems(filtered);
                            this.setLoading(false);
                        },
                        error: (error) => {
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