import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, untracked } from "@angular/core";
import { ComponentAppStore } from "../../../store/component/component.store";
import { LanguageStore } from "../../../store/language/language.store";
import { orderBlocksRecursively } from "../../../core/utils/order-blocks.utils";

@Component({
    selector: "data-protection",
    standalone: true,
    imports: [CommonModule],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './data-protection.component.html',
    styleUrl: './data-protection.component.scss'
})
export class DataProtectionComponent {
    private readonly componentStore = inject(ComponentAppStore);
    private readonly languageStore = inject(LanguageStore);

    private readonly dataProtectionPageSections = this.componentStore.getSectionsBySlug('page-date-protect');

    constructor() {
        effect(() => {
            const lang = this.languageStore.$selectedCodeLang();
            if (!lang) return;
            untracked(() => {
                this.componentStore.loadPageBySlug({ slug: 'page-date-protect', lang });
            });
        });
    }

    readonly content = computed(() => {
        const sections = this.dataProtectionPageSections();
        if (sections.length === 0) return [];

        const blocks = orderBlocksRecursively(sections[0].blocks);

        const mappedContent = blocks.map(block => ({
            tagHtml: block.properties?.['sourceHtmlTag'] ?? block.htmlTag,
            text: block.content
        }));

        return mappedContent;
    });
}