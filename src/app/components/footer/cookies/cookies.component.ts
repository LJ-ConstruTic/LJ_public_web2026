import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, untracked } from "@angular/core";
import { ComponentAppStore } from "../../../store/component/component.store";
import { LanguageStore } from "../../../store/language/language.store";
import { orderBlocksRecursively } from "../../../core/utils/order-blocks.utils";

@Component({
    selector: "cookies",
    standalone: true,
    imports: [CommonModule],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './cookies.component.html',
    styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent {
    private readonly componentStore = inject(ComponentAppStore);
    private readonly languageStore = inject(LanguageStore);

    private readonly cookiesPageSections = this.componentStore.getSectionsBySlug('page-cookies');

    constructor() {
        effect(() => {
            const lang = this.languageStore.$selectedCodeLang();
            if (!lang) return;

            untracked(() => {
                this.componentStore.loadPageBySlug({ slug: 'page-cookies', lang });
            });
        });
    }

    readonly content = computed(() => {
        const sections = this.cookiesPageSections();
        if (sections.length === 0) return [];

        const blocks = orderBlocksRecursively(sections[0].blocks);

        const mappedContent = blocks.map(block => ({
            tagHtml: block.htmlTag,
            text: block.content
        }));

        return mappedContent;
    });
}