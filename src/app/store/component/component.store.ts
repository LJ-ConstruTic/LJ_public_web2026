import { ComponentStore } from "@ngrx/component-store";
import { ComponentState, initialComponentState } from "./component.state";
import { computed, inject, Injectable } from "@angular/core";
import { ComponentService } from "../../core/services/component.service";
import { mergeMap, switchMap, tap } from "rxjs";
import { Router } from "@angular/router";


@Injectable()
export class ComponentAppStore extends ComponentStore<ComponentState> {
    private readonly componentService = inject(ComponentService);
    private readonly router = inject(Router);

    readonly $globalSections = this.selectSignal(state => state.globalSections);
    readonly $pageSectionsBySlug = this.selectSignal(state => state.pageSectionsBySlug);
    readonly $loading = this.selectSignal(state => state.loading);
    readonly $error = this.selectSignal(state => state.error);

    constructor() {
        super(initialComponentState);
    }

    // --- Updaters ---
    private readonly setLoading = this.updater<boolean>((state, loading) => ({
        ...state, loading
    }));
    private readonly setError = this.updater<string | null>((state, error) => ({
        ...state, error
    }));

    // --- Effects ---
    readonly loadPageBySlug = this.effect<{ slug: string; lang: string }>((parametrosDeCarga$) =>
        parametrosDeCarga$.pipe(
            tap(({ slug, lang }) => {
                this.setLoading(true);
                this.setError(null);
            }),
            mergeMap(({ slug, lang }) =>   // lanza peticiones en paralelo sin cancelar la anterior
                this.componentService.getPageBySlug(slug, lang).pipe(
                    tap({
                        next: (response) => {
                            console.log('loadPageBySlug', response);
                            const seccionesExistentes = this.get().pageSectionsBySlug;

                            this.patchState({
                                pageSectionsBySlug: {
                                    ...seccionesExistentes,
                                    [slug]: response.page.sections,
                                },
                                loading: false,
                            });

                        },
                        error: (error) => {
                            console.error('[Store] loadPageBySlug ERROR — slug:', slug, error);
                            this.setError(error?.message ?? 'Error loading page by slug');
                            this.setLoading(false);
                        },
                    })
                )
            )
        )
    );

    getSectionsBySlug(slug: string) {
        return computed(() => {
            const todasLasSeccionesPorSlug = this.$pageSectionsBySlug();
            console.log('todasLasSeccionesPorSlug:', todasLasSeccionesPorSlug);
            const seccionesDeEsteSlug = todasLasSeccionesPorSlug[slug] ?? [];
            return seccionesDeEsteSlug;
        });
    }

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
}