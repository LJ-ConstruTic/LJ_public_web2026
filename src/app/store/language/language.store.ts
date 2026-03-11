import { computed, effect, inject, Injectable, untracked } from "@angular/core";
import { initialLanguageState, LanguageState, LS_KEY } from "./language.state";
import { ComponentStore } from "@ngrx/component-store";
import { LanguageService } from "../../core/services/language.service";
import { catchError, EMPTY, switchMap, tap } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { LanguageDataModel } from "../../core/model/language-dto";
import { getBrowserLang } from "../../../assets/i18n/lang";

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
        this.syncSelectedLanguage(); // la persistencia y traducción se hacen de forma reactiva en syncSelectedLanguage().
    }

    // UPDATERS
    private readonly setLoading = this.updater<boolean>((state, loading) => ({ ...state, loading }));
    private readonly setError = this.updater<string | null>((state, error) => ({ ...state, error }));
    private readonly setItems = this.updater<LanguageDataModel[]>((state, items) => ({ ...state, items }));
    // readonly setSelectedCode = this.updater<number | null>((state, code) => ({ ...state, selectedCode: code }));
    private readonly _setCode = this.updater<number | null>((state, selectedCode) => ({ ...state, selectedCode }));

    readonly setSelectedCode = (code: number | null) => this._setCode(code); // es la API pública del store, lo que expone hacia los componentes.

    // EFFECTS
    readonly loadAll = this.effect<void>((trigger$) =>
        trigger$.pipe(
            tap(() => { 
                this.setLoading(true); 
                this.setError(null); }),
            switchMap(() =>
                this.languageService.getAllLanguages().pipe(
                    tap(res => {
                        const items = res.items ?? [];
                        this.setItems(res.items ?? []);
                        this.setLoading(false);

                        this._setCode(this.resolveInitialCode(items));

                        // inicialización del idioma
                        // const stored = localStorage.getItem('ui-lang-code');
                        // const storedCode = stored != null ? Number(stored) : null;

                        // const defaultCode = storedCode ?? res.items[0]?.code ?? null;
                        // this.setSelectedCode(defaultCode);
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

    private resolveInitialCode(items: LanguageDataModel[]): number | null {
        if (!items.length) return null;

        // Recoge el código guardado en localStorage
        const langCodeStored = localStorage.getItem(LS_KEY);

        if (langCodeStored !== null) {
            const storedCodeAsNumber = Number(langCodeStored); // el código de idioma es numérico
            const codeExists = items.some(cod => cod.code === storedCodeAsNumber);

        if (codeExists) return storedCodeAsNumber;
        }

        // 2 — Tomar el idioma del navegador
        const browserTag = getBrowserLang(this.translate); // 'en' | 'es' | 'pt' | 'umb'
        console.log('browserTag', browserTag);
        const byBrowser = items.find(x => x.tag === browserTag || x.tagRegion?.toLowerCase().startsWith(browserTag));
        console.log('byBrowser', byBrowser);
        if (byBrowser) return byBrowser.code;

        // 3 — Default: devuelve inglés
        console.log('3 — Default: devuelve inglés', items);
        return items[4].code;
    }

    private syncSelectedLanguage(): void { // cuando cambia selectedCode → aplicar idioma y persiste en el localStorage
        effect(() => {
            const selected = this.$selectedLanguage();
            if (!selected) return;

            untracked(() => { // untracked() evita que translate.use() / localStorage disparen re-renders en el grafo de signals.
                this.translate.use(selected.tag);
                localStorage.setItem(LS_KEY, String(selected.code));
            });
        });
    }

}