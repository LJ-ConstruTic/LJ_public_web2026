import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { SelectModule } from 'primeng/select';
import { FormsModule } from "@angular/forms";
import { ThemeStore } from "../../store/theme/theme.store";
import { CommonModule } from "@angular/common";
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { MENU_ITEMS, MenuKeyItem } from "./mock-menu";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import { LanguageStore } from "../../store/language/language.store";
import { ComponentAppStore } from "../../store/component/component.store";


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [ButtonModule, TranslateModule, SelectModule, FormsModule, CommonModule, MenubarModule, RouterLink],
    providers: [ComponentAppStore]
})

export class HeaderComponent implements OnInit {
    private readonly languageStore = inject(LanguageStore);
    readonly themeStore = inject(ThemeStore);
    readonly componentStore = inject(ComponentAppStore);

    readonly isDark$ = this.themeStore.isDark$;
    readonly langOptions = this.languageStore.$langOptions;
    readonly selectedCode = this.languageStore.$selectedCode;

    menu: MenuItem[] = MENU_ITEMS; // X
    private readonly translate = inject(TranslateService); // X
    private readonly destroyRef = inject(DestroyRef); // X

    constructor() {
        
    }

    ngOnInit() { // Los datos reales vendrán de la Store cuando haya backend. Cuando eso ocurra, eliminar todo lo que esté comentado con una X
        this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.buildMenu()); //X
        this.buildMenu(); // X

        this.componentStore.loadAllComponents(); // Esto puede que no vaya aquí
       
    
        this.componentStore.loadMenu(1); // Prueba para ver lo que devuelve la llamada

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

    onLangChange(code: number) {
        this.languageStore.setSelectedCode(code);
    }

    toggleTheme(): void {
        this.themeStore.toggle();
    }

}