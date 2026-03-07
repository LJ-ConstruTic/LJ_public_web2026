import { computed, effect, inject, Injectable, untracked } from "@angular/core";
import { initialLanguageState, LanguageState } from "./language.state";
import { ComponentStore } from "@ngrx/component-store";
import { LanguageService } from "../../core/services/language.service";
import { catchError, EMPTY, switchMap, tap } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { LanguageDataModel } from "../../core/model/language-dto";

@Injectable()
export class LanguageStore extends ComponentStore<LanguageState> {
    private readonly languageService = inject(LanguageService);
    private readonly translate = inject(TranslateService);

    readonly $items = this.selectSignal(state => state.items);
    readonly $loading = this.selectSignal(state => state.loading);
    readonly $error = this.selectSignal(state => state.error);
    readonly $selectedCode = this.selectSignal(state => state.selectedCode);

    readonly $langOptions = computed(() =>
        this.$items().map(x => ({ // actualiza el desplegable
            name: x.language,
            code: x.code,
            tag: x.tag,
            tagRegion: x.tagRegion,
        }))
    );

    readonly $selectedLanguage = computed(() =>
        this.$langOptions().find((item) =>
            item.code === this.$selectedCode()) ?? null
    );

    constructor() {
        super(initialLanguageState);

        this.syncSelectedLanguage();
    }

    // UPDATERS
    private readonly setLoading = this.updater<boolean>((state, loading) => ({ ...state, loading }));
    private readonly setError = this.updater<string | null>((state, error) => ({ ...state, error }));
    private readonly setItems = this.updater<LanguageDataModel[]>((state, items) => ({ ...state, items }));
    readonly setSelectedCode = this.updater<number | null>((state, code) => ({ ...state, selectedCode: code }));

    // EFFECTS
    readonly loadAll = this.effect<void>((trigger$) =>
        trigger$.pipe(
            tap(() => { this.setLoading(true); this.setError(null); }),
            switchMap(() =>
                this.languageService.getAllLanguages().pipe(
                    tap(res => {
                        this.setItems(res.items ?? []);
                        this.setLoading(false);

                        // inicialización del idioma
                        const stored = localStorage.getItem('ui-lang-code');
                        const storedCode = stored != null ? Number(stored) : null;

                        const defaultCode = storedCode ?? res.items[0]?.code ?? null;
                        this.setSelectedCode(defaultCode);
                    }),
                    catchError(err => {
                        this.setLoading(false);
                        this.setError(err?.error?.message ?? err?.message ?? 'Unexpected error');
                        return EMPTY;
                    })
                )
            )
        )
    );

    private syncSelectedLanguage(): void { // cuando cambia selectedCode → aplicar idioma y persiste en el localStorage
        effect(() => {
            const selected = this.$selectedLanguage();
            if (!selected) return;

            untracked(() => {
                this.translate.use(selected.tag);
                localStorage.setItem('ui-lang-code', String(selected.code));
            });
        });
    }

}