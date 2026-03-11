import { Component, effect, inject } from "@angular/core";
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

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [ButtonModule, TranslateModule, SelectModule, FormsModule, CommonModule, MenubarModule, RouterLink],
    providers: [ComponentAppStore]
})

export class HeaderComponent {
    private readonly languageStore = inject(LanguageStore);
    readonly themeStore = inject(ThemeStore);
    readonly componentStore = inject(ComponentAppStore);

    readonly isDark$ = this.themeStore.isDark$;
    readonly langOptions = this.languageStore.$langOptions;
    readonly selectedCode = this.languageStore.$selectedCode;
    readonly menu = this.componentStore.$menuConverted;
 

    constructor() {
        effect(() => {
            const code = this.languageStore.$selectedCode();
            if(!code) return;
            this.componentStore.loadMenu(Number(code));
        });
        this.componentStore.loadAllComponents();
    }

    onLangChange(code: number) {
        this.languageStore.setSelectedCode(code);
    }

    toggleTheme(): void {
        this.themeStore.toggle();
    }

}