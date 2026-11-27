import { ComponentStore } from "@ngrx/component-store";
import { ComponentState, initialComponentState } from "./component.state";
import { computed, inject, Injectable } from "@angular/core";
import { ComponentService } from "../../core/services/component.service";
import { catchError, EMPTY, filter, finalize, groupBy, mergeMap, switchMap, tap } from "rxjs";
import { Router } from "@angular/router";


@Injectable()
export class ComponentAppStore extends ComponentStore<ComponentState> {
    private readonly componentService = inject(ComponentService);
    private readonly router = inject(Router);
    private readonly pendingLanguages = new Map<string, string>();

    readonly $globalSections = this.selectSignal(state => state.globalSections);
    readonly $pageSectionsBySlug = this.selectSignal(state => state.pageSectionsBySlug);
    readonly $loading = this.selectSignal(state => state.loading);
    readonly $error = this.selectSignal(state => state.error);

    constructor() {
        super(initialComponentState);
    }

    // --- Updaters ---
    readonly loadPageBySlug = this.effect<{ slug: string; lang: string }>(requests =>
        requests.pipe(
            groupBy(request => request.slug),
            mergeMap(group => group.pipe(
                filter(({ slug, lang }) => this.pendingLanguages.get(slug) !== lang),
                switchMap(({ slug, lang }) => {
                    this.pendingLanguages.set(slug, lang);
                    this.patchState({ loading: true, error: null });
                    return this.componentService.getPageBySlug(slug, lang).pipe(
                        tap(response => this.patchState(state => ({
                            pageSectionsBySlug: { ...state.pageSectionsBySlug, [slug]: response.page.sections },
                        }))),
                        catchError(error => {
                            this.patchState({ error: error?.message ?? 'Error loading page by slug' });
                            return EMPTY;
                        }),
                        finalize(() => {
                            this.pendingLanguages.delete(slug);
                            this.patchState({ loading: this.pendingLanguages.size > 0 });
                        }),
                    );
                }),
            )),
        ),
    );

    getSectionsBySlug(slug: string) {
        return computed(() => this.$pageSectionsBySlug()[slug] ?? []);
    }

    scrollTo(key: string): void {
        const scrollToSection = () => {
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            document.getElementById(key)?.scrollIntoView({
                behavior: reducedMotion ? 'instant' : 'smooth',
            });
        };

        if (this.router.url !== '/') {
            this.router.navigate(['/']).then(navigated => {
                if (navigated) {
                    setTimeout(scrollToSection, 300);
                }
            });
        } else {
            scrollToSection();
        }
    }
}
