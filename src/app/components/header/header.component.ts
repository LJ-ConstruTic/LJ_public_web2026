import { Component, computed, effect, inject, ViewChild } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from "@ngx-translate/core";
import { SelectModule } from 'primeng/select';
import { FormsModule } from "@angular/forms";
import { ThemeStore } from "../../store/theme/theme.store";
import { CommonModule } from "@angular/common";
import { MenubarModule } from 'primeng/menubar';
import { RouterLink } from "@angular/router";
import { LanguageStore } from "../../store/language/language.store";
import { ComponentAppStore } from "../../store/component/component.store";
import { MenuItem } from "primeng/api";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [ButtonModule, TranslateModule, SelectModule, FormsModule, CommonModule, MenubarModule, RouterLink],
    providers: []
})

export class HeaderComponent {
    @ViewChild('menubar') menubar: any;

    readonly componentStore = inject(ComponentAppStore);
    private readonly languageStore = inject(LanguageStore);
    readonly themeStore = inject(ThemeStore);

    readonly logoBlock = this.componentStore.$logoBlock;
    readonly menuLinks = this.componentStore.$menuLinks;
    readonly langOptions = this.languageStore.$langOptions;
    readonly selectedCode = this.languageStore.$selectedCodeLang;
    readonly isDark$ = this.themeStore.isDark$;

    readonly $menuItems = computed(() => {
        const links = this.menuLinks();

        return links.map(linkItem => {
            const label = linkItem?.content;
            const href = linkItem.properties?.['href'] as string;

            return {
                label,
                command: () => {
                    if (href) { // Aquí hacer la versión de es un scroll o un componente
                        this.componentStore.scrollTo(linkItem.key); // TODO: key o id
                    }
                }
            } as MenuItem;
        });
    });

    constructor() {
        effect(() => {
            // console.log('logoBlock:', this.logoBlock());
            // console.log('menuLinks:', this.menuLinks());
            // console.log('selectedCode:', this.selectedCode());
            // console.log('langOptions:', this.langOptions());
        });
    }

    onLangChange(code: string) {
        this.languageStore.setSelectedCode(code);
    }

    toggleTheme(): void {
        this.themeStore.toggle();
    }

    closeMenu(): void {
        this.menubar?.hide?.();
    }

}