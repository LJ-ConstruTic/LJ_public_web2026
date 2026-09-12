import { ComponentStore } from "@ngrx/component-store";
import { ComponentState, initialComponentState } from "./component.state";
import { computed, inject, Injectable } from "@angular/core";
import { ComponentService } from "../../core/services/component.service";
import { switchMap, tap } from "rxjs";
import { Router } from "@angular/router";


@Injectable()
export class ComponentAppStore extends ComponentStore<ComponentState> {
    private readonly componentService = inject(ComponentService);
    private readonly router = inject(Router);

    readonly $globalSections = this.selectSignal(state => state.globalSections);
    readonly $pageSections = this.selectSignal(state => state.pageSections);
    readonly $loading = this.selectSignal(state => state.loading);
    readonly $error = this.selectSignal(state => state.error);

    // ----- Secciones -------------------------------------------------
    readonly $headerSection = computed(() =>
        this.$globalSections().find(s => s.type === 'header') ?? null
    );

    readonly $logoBlock = computed(() =>
        this.$headerSection()?.blocks.find(b => b.type === 'image') ?? null
    );

    readonly $menuBlock = computed(() =>
        this.$headerSection()?.blocks.find(b => b.type === 'menu') ?? null
    );
    readonly $menuLinks = computed(() => {
        const menuBlock = this.$menuBlock();
        if (!menuBlock?.children) return [];
        return [...menuBlock.children].sort((a, b) => a.order - b.order);
    });

    readonly $footerSection = computed(() =>
        this.$globalSections().find(s => s.type === 'footer') ?? null
    );
    readonly $footerCompany = computed (() => {
        this.$footerSection()?.blocks.find(b => b.type === 'text')
    });
    readonly $footerContact = computed (() => {
        this.$footerSection()?.blocks.find(b => b.type === 'contact')
    });
    readonly $footerSocial = computed (() => {
        this.$footerSection()?.blocks.find(b => b.type === 'social')
    });

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
    readonly loadComponents = this.effect<string>((lang$) =>
        lang$.pipe(
            tap(() => {
                this.setLoading(true);
                this.setError(null);
            }),
            switchMap((lang) =>
                this.componentService.getBootstrap(lang).pipe(
                    tap({
                        next: (res) => {
                            console.log('loadBootstrap', res);
                            this.patchState({
                                globalSections: res.sections,
                                loading: false,
                            });
                        },
                        error: (err) => {
                            this.setError(err?.message ?? 'Error loading site');
                            this.setLoading(false);
                        },
                    })
                )
            )
        )
    );

    readonly loadPage = this.effect<{ route: string; lang: string }>((params$) =>
        params$.pipe(
            tap(() => {
                this.setLoading(true);
                this.setError(null);
            }),
            switchMap(({ route, lang }) =>
                this.componentService.getPageByRoute(route, lang).pipe(
                    tap({
                        next: (res) => {
                            console.log('loadPage', res);
                            this.patchState({
                                pageSections: res.page.sections,
                                loading: false,
                            });
                        },
                        error: (err) => {
                            this.setError(err?.message ?? 'Error loading page');
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
}