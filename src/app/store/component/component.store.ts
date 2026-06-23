import { ComponentStore } from "@ngrx/component-store";
import { ComponentState, initialComponentState } from "./component.state";
import { computed, inject, Injectable } from "@angular/core";
import { ComponentService } from "../../core/services/component.service";
import { ComponentDataModel, ComponentMenuItem } from "../../core/model/component-dto";
import { switchMap, tap } from "rxjs";
import { COMPONENT_DICTIONARY } from "../../core/dictionary/component-dictionary";
import { Router } from "@angular/router";


@Injectable()
export class ComponentAppStore extends ComponentStore<ComponentState> {
    readonly componentService = inject(ComponentService);
    private readonly router = inject(Router);

    readonly $items = this.selectSignal(state => state.items)
    readonly $menuItems = this.selectSignal(state => state.menuItems)
    readonly $loading = this.selectSignal(state => state.loading)
    readonly $error = this.selectSignal(state => state.error)

    // Transformar $menuItems (ComponentMenuItem[]) a MenuItem[] que es lo que pide primeng
    readonly $menuConverted = computed(() =>
        this.$menuItems().map(item => {
            const dictEntry = Object.values(COMPONENT_DICTIONARY).find(d => d.key === item.key);
            const command = (event: any) => {
                const target = event?.originalEvent?.target as HTMLElement;
                if (target?.closest('[data-pc-section="submenuicon"]')) return;
                dictEntry?.route
                    ? this.router.navigate([dictEntry.route])
                    : this.scrollTo(item.key);
            };
            return {
                label: item.tag,
                id: item.id,
                command,
                items: item.tagsParent.length
                    ? item.tagsParent.map(child => ({
                        label: child.tag,
                        id: child.id,
                        command: () => dictEntry?.childRoute ?
                            this.router.navigate([dictEntry.childRoute, child.tagId])
                            : this.scrollTo(child.key),
                    }))
                    : undefined,
            };
        })
    );

    // readonly $activeComponents = computed(() => // TODO: Cuando el json sea correcto, descomentar
    //     this.$items().filter(comp => comp.isActive).sort((a, b) => a.idx - b.idx)
    // );

    readonly $activeComponents = computed(() =>
        this.$items()
            .filter(comp => comp.isActive && !!COMPONENT_DICTIONARY[comp.name])
            .sort((a, b) => a.idx - b.idx)
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
                            console.log('Component MENU:', response);
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

    scrollTo(key: string): void {
        if (this.router.url !== '/') {
            this.router.navigate(['/']).then(() => {
                setTimeout(() => {
                    document.getElementById(key)?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            });
        } else {
            document.getElementById(key)?.scrollIntoView({ behavior: 'smooth' });
        }
    }

    navigateTo(route: string): void {
        this.router.navigate([route]);
    }

    getTagIdByKey(key: string): string | null {
        for (const item of this.$menuItems()) {
            const parent = item.tagsParent.find(p => p.key === key);
            if (parent) return parent.tagId;
        }
        return null;
    }

}