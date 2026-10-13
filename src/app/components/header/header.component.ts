import { Component, computed, effect, inject, ViewChild } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from "@ngx-translate/core";
import { SelectModule } from 'primeng/select';
import { FormsModule } from "@angular/forms";
import { ThemeStore } from "../../store/theme/theme.store";
import { CommonModule } from "@angular/common";
import { MenubarModule } from 'primeng/menubar';
import { Router, RouterLink } from "@angular/router";
import { LanguageStore } from "../../store/language/language.store";
import { ComponentAppStore } from "../../store/component/component.store";
import { MenuItem } from "primeng/api";
import { MenuLinkAction, parseMenuLinkUrl } from "../../core/utils/order-blocks.utils";
import { Block } from "../../core/model/component-dto";
import { MENU_SCROLL_TARGET } from "../../core/dictionary/component-dictionary";

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
    private readonly router = inject(Router);

    readonly langOptions = this.languageStore.$langOptions;
    readonly selectedCode = this.languageStore.$selectedCodeLang;
    readonly isDark$ = this.themeStore.isDark$;

    readonly menuPageSections = this.componentStore.getSectionsBySlug('page-menu');

    readonly logoBlockFromMenu = computed(() => {
        const sections = this.menuPageSections();
        if (sections.length === 0) return null;

        const blocks = sections[0].blocks;
        const logo = blocks.find(block => block.type === 'image');
        return logo ?? null;
    });

    readonly $menuItems = computed(() => {
        const sections = this.menuPageSections();
        if (sections.length === 0) return [];

        const menuBlocks = [...sections[0].blocks]
            .filter(block => block.type === 'text')
            .sort((blockA, blockB) => blockA.order - blockB.order);

        return menuBlocks.map(block => this.buildMenuItem(block));
    });

    private buildMenuItem(block: Block): MenuItem {
        const url = block.properties['url'] as string ?? '';
        const linkAction = parseMenuLinkUrl(url);

        const menuItem: MenuItem = {
            label: block.content ?? '',
            command: () => this.executeMenuAction(linkAction, block),
        };

        if (block.children.length > 0) {
            const sortedChildren = [...block.children].sort(
                (childA, childB) => childA.order - childB.order
            );

            menuItem.items = sortedChildren.map(child => {
                const childUrl = child.properties['url'] as string ?? '';
                const childAction = parseMenuLinkUrl(childUrl);
                return {
                    label: child.content ?? '',
                    command: () => this.executeMenuAction(childAction, child),
                } as MenuItem;
            });
        }

        return menuItem;
    }

    private executeMenuAction(action: MenuLinkAction, block: Block): void {
        const lang = this.languageStore.$selectedCodeLang();

        switch (action.type) {
            case 'scroll':
                const sourceKey = block.properties['sourceKey'] as string ?? '';
                const scrollTargetId = MENU_SCROLL_TARGET[sourceKey] ?? block.key;
                this.componentStore.scrollTo(scrollTargetId);
                break;

            case 'navigate':
                if (action.slug) {
                    this.router.navigate(['/' + action.slug]);
                }
                break;

            case 'page-route':
                if (action.slug && action.route && lang) {
                    this.componentStore.loadPageBySlug({ slug: action.slug, lang });
                    this.router.navigate(['/' + action.route]);
                }
                break;

            case 'detail':
                if (action.slug && action.productId && lang) {
                    this.componentStore.loadPageBySlug({ slug: action.slug, lang });

                    const routePrefix = action.slug === 'page-product' ? 'product-detail' : 'service-detail';
                    this.router.navigate(['/' + routePrefix, action.productId]);
                }
                break;
        }
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