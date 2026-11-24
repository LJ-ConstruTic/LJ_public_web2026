import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, ViewEncapsulation } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ComponentAppStore } from "../../store/component/component.store";
import { Block } from "../../core/model/component-dto";
import { LanguageStore } from "../../store/language/language.store";
import { CookiePreferencesService } from '../../core/services/cookie-preferences.service';

@Component({
    selector: 'footer',
    templateUrl: './footer.component.html',
    standalone: true,
    imports: [CommonModule, RouterLink],
    providers: [],
    encapsulation: ViewEncapsulation.None,
})

export class FooterComponent {
    protected readonly cookiePreferences = inject(CookiePreferencesService);
    readonly componentStore = inject(ComponentAppStore);
    private readonly languageStore = inject(LanguageStore);
    private readonly router = inject(Router);

    private readonly footerPageSections = this.componentStore.getSectionsBySlug('page-footer');

    private readonly footerBlocks = computed(() => {
        const sections = this.footerPageSections();
        if (sections.length === 0) return [];
        return sections[0].blocks;
    });

    private findBlockByName(name: string): Block | null {
        const block = this.footerBlocks().find(block => block.properties['name'] === name) ?? null;
        return block;
    }

    readonly logoSection = computed(() => {
        const block = this.findBlockByName('logo');
        if (!block || block.children.length === 0) return null;

        const companyChild = block.children[0];
        const logoUrl = companyChild.media.length > 0 ? companyChild.media[0].url : null;

        return {
            companyName: companyChild.content ?? '',
            logoUrl,
        };
    });

    readonly socialLinks = computed(() => {
        const block = this.findBlockByName('social');
        if (!block) return [];

        const links = [...block.children]
            .sort((childA, childB) => childA.order - childB.order)
            .map(child => ({
                name: child.content ?? '',
                url: child.properties['url'] as string ?? '#',
                iconUrl: child.media.length > 0 ? child.media[0].url : null,
            }));
        return links;
    });

    readonly contactItems = computed(() => {
        const block = this.findBlockByName('info');
        if (!block) return [];

        const items = [...block.children]
            .sort((childA, childB) => childA.order - childB.order)
            .map(child => ({
                content: child.content ?? '',
                sourceKey: child.properties['sourceKey'] as string ?? '',
            }));
        return items;
    });

    readonly legalLinks = computed(() => {
        const block = this.findBlockByName('politics');
        if (!block) return [];

        return [...block.children]
            .sort((childA, childB) => childA.order - childB.order)
            .map(child => ({
                label: child.content ?? '',
                url: child.properties['url'] as string ?? '#',
                slug: child.properties['slug'] as string ?? '',
            }));
    });

    readonly copyrightText = computed(() => {
        const block = this.footerBlocks().find(
            block => block.type === 'text' && block.properties['name'] == null
        );
        const text = block?.content ?? '';
        return text;
    });

    readonly currentYear = new Date().getFullYear();

    navigateToLegalPage(link: { label: string; url: string; slug: string }): void {
        const lang = this.languageStore.$selectedCodeLang();
        if (!lang || !link.slug) return;

        console.log('[FooterComponent] cargando:', link.slug, '→ navegando a:', link.url);
        this.componentStore.loadPageBySlug({ slug: link.slug, lang });
        this.router.navigate([link.url]);
    }
}
