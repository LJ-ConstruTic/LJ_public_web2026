import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, untracked } from "@angular/core";
import { ComponentAppStore } from "../../../store/component/component.store";
import { LanguageStore } from "../../../store/language/language.store";
import { orderBlocksRecursively } from "../../../core/utils/order-blocks.utils";

@Component({
    selector: "conditions",
    standalone: true,
    imports: [CommonModule],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './conditions.component.html',
    styleUrl: './conditions.component.scss'
})
export class ConditionsComponent {
    private readonly componentStore = inject(ComponentAppStore);
    private readonly languageStore = inject(LanguageStore);

    private readonly conditionsPageSections = this.componentStore.getSectionsBySlug('page-term-condition');

    constructor() {
        effect(() => {
            const lang = this.languageStore.$selectedCodeLang();
            if (!lang) return;
            untracked(() => {
                this.componentStore.loadPageBySlug({ slug: 'page-term-condition', lang });
            });
        });
    }

    readonly content = computed(() => {
        const sections = this.conditionsPageSections();
        if (sections.length === 0) return [];

        const blocks = orderBlocksRecursively(sections[0].blocks);

        const mappedContent = blocks.map(block => ({
            tagHtml: block.properties?.['sourceHtmlTag'] ?? block.htmlTag,
            text: block.content
        }));

        return mappedContent;
    });
}