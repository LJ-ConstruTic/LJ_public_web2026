import { computed, effect, inject, Injectable, untracked } from "@angular/core";
import { initialLanguageState, LanguageState, LOCALSTORAGE_KEY } from "./language.state";
import { ComponentStore } from "@ngrx/component-store";
import { catchError, EMPTY, switchMap, tap } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { getBrowserLang } from "../../../assets/i18n/lang";
import { ComponentService } from "../../core/services/component.service";
import { LanguageItem } from "../../core/model/language-dto";

@Injectable()
export class LanguageStore extends ComponentStore<LanguageState> {
    private readonly componentService = inject(ComponentService);
    private readonly translate = inject(TranslateService);

    readonly $items = this.selectSignal(state => state.langs);
    readonly $loading = this.selectSignal(state => state.loading);
    readonly $error = this.selectSignal(state => state.error);
    readonly $selectedCodeLang = this.selectSignal(state => state.selectedCode);

    readonly $langOptions = computed(() =>
        this.$items().map(x => ({
            code: x.code,
            name: x.name,
            nativeName: x.nativeName,
        }))
    );

    readonly $selectedLanguage = computed(() =>
        this.$langOptions().find(item => item.code === this.$selectedCodeLang()) ?? null
    );

    constructor() {
        super(initialLanguageState);
        this.syncSelectedLanguage();
    }

    // --- Updaters ---
    private readonly setLoading = this.updater<boolean>((state, loading) => ({ ...state, loading }));
    private readonly setError = this.updater<string | null>((state, error) => ({ ...state, error }));
    private readonly setArrayLangs = this.updater<LanguageItem[]>((state, items) => ({ ...state, items }));
    private readonly setCodeLang = this.updater<string | null>((state, selectedCode) => ({ ...state, selectedCode }));

    readonly setSelectedCode = (code: string | null) => this.setCodeLang(code);

    // --- Effects ---
    readonly loadAllLanguages = this.effect<void>((trigger$) =>
        trigger$.pipe(
            tap(() => {
                this.setLoading(true);
                this.setError(null);
            }),
            switchMap(() =>
                this.componentService.getLanguages().pipe(
                    tap(res => {
                        const langs = res?.items;
                        this.setArrayLangs(langs);
                        this.setLoading(false);

                        const resolved = this.getInitialLanguage(langs);
                        this.setCodeLang(resolved); // update language
                    }),
                    catchError(err => {
                        this.setLoading(false);
                        this.setError(err?.message ?? 'Error loading languages');
                        console.error('[LanguageStore] error:', err);
                        return EMPTY;
                    })
                )
            )
        )
    );

    private getInitialLanguage(langs: LanguageItem[]): string | null {
        if (!langs?.length) return null;

        // 1 — localStorage
        if (typeof window !== 'undefined') {
            const langStored = localStorage.getItem(LOCALSTORAGE_KEY);
            if (langStored && langs.some(i => i.code === langStored)){
                return langStored;
            }
        }

        // 2 — idioma del navegador
        const browserTag = getBrowserLang(this.translate);

        const byBrowser = langs.find(i => i.code === browserTag);
        if (byBrowser) return byBrowser.code;

        // 3 — default inglés si no existen idiomas coincidentes
        return langs.find(i => i.code === 'en')?.code ?? langs[0].code;
    }

    private syncSelectedLanguage(): void { // reacciona cada vez que el idioma seleccionado cambia.
        effect(() => {
            const selected = this.$selectedLanguage();
            if (!selected) return;

            untracked(() => {
                this.translate.use(selected.code);
                if (typeof window !== 'undefined') {
                    localStorage.setItem(LOCALSTORAGE_KEY, selected.code);
                }
            });
        });
    }
}