import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { SelectModule } from 'primeng/select';
import { FormsModule } from "@angular/forms";
import { ThemeStore } from "../../store/theme.store";
import { CommonModule } from "@angular/common";
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { MENU_ITEMS, MenuKeyItem } from "./mock-menu";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";

type LangCode = 'es' | 'en' | 'pt-AO' | 'umb'; // X

type LangOption = { name: string; code: LangCode }; // X

const LANG_KEY = 'ui-lang'; // X

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [ButtonModule, TranslateModule, SelectModule, FormsModule, CommonModule, MenubarModule, RouterLink],
})

export class HeaderComponent implements OnInit {

    menu: MenuItem[] = MENU_ITEMS; // X
    private readonly translate = inject(TranslateService); // X
    private readonly destroyRef = inject(DestroyRef); // X

    readonly themeStore = inject(ThemeStore);

    readonly isDark$ = this.themeStore.isDark$;

    langOptions: LangOption[] = [ // X
        { name: 'Português', code: 'pt-AO' },
        { name: 'Umbundu', code: 'umb' },
        { name: 'Español', code: 'es' },
        { name: 'English', code: 'en' },
    ];

    selectedLangCode!: LangCode;

    ngOnInit() { // Los datos reales vendrán de la Store cuando haya backend. Cuando eso ocurra, eliminar todo lo que esté comentado con una X
        const saved = this.storage?.getItem(LANG_KEY) as LangCode | null; // X
        this.selectedLangCode = saved ?? this.pickBrowserLang(); // X
        this.translate.use(this.selectedLangCode); // X
        this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.buildMenu()); //X
        this.buildMenu(); // X
    }

    private buildMenu(): void { // X
        this.menu = this.toMenuItems(MENU_ITEMS);
    }

    private toMenuItems(items: MenuKeyItem[]): MenuItem[] { // X
        return items.map(i => ({
            label: this.translate.instant(i.labelKey), // <- aquí se traduce
            id: i.id,
            items: i.items ? this.toMenuItems(i.items) : undefined,
            command: i.id ? () => this.onMenuClick(i.id!) : undefined,
        }));
    }

    private onMenuClick(id: string): void { // X
        // por ahora: scroll a sección (one-page)
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    private pickBrowserLang(): LangCode { // X
        const nav: any = (globalThis as any).navigator;
        const list: string[] = (nav?.languages?.length ? nav.languages : [nav?.language])
            .filter(Boolean)
            .map((l: string) => l.toLowerCase());
        // exacto
        if (list.includes('pt-ao')) return 'pt-AO';

        // base
        if (list.some(l => l.startsWith('es'))) return 'es';
        if (list.some(l => l.startsWith('pt'))) return 'pt-AO';
        if (list.some(l => l.startsWith('en'))) return 'en';

        return 'en';
    }

    private get storage(): Storage | null { // X
        const ls: any = (globalThis as any).localStorage;
        return (ls && typeof ls.getItem === 'function' && typeof ls.setItem === 'function') ? (ls as Storage) : null;
    }

    onLangChange(code: LangCode) { // X
        this.selectedLangCode = code;
        this.translate.use(code);
        localStorage.setItem(LANG_KEY, code);
        }

    toggleTheme(): void {
        this.themeStore.toggle();
    }

}