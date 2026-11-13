import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, untracked } from "@angular/core";
import { orderBlocksRecursively } from "../../../core/utils/order-blocks.utils";
import { ComponentAppStore } from "../../../store/component/component.store";
import { LanguageStore } from "../../../store/language/language.store";

@Component({
    selector: "privacity",
    standalone: true,
    imports: [CommonModule],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './privacity.component.html',
    styleUrls: ['./privacity.component.scss']
})
export class PrivacityComponent {
    private readonly componentStore = inject(ComponentAppStore);
    private readonly languageStore = inject(LanguageStore);

    private readonly privacityPageSections = this.componentStore.getSectionsBySlug('page-privated');

    constructor() {
        effect(() => {
            const lang = this.languageStore.$selectedCodeLang();
            if (!lang) return;
            untracked(() => {
                this.componentStore.loadPageBySlug({ slug: 'page-privated', lang });
            });
        });
    }

    readonly content = computed(() => {
        const sections = this.privacityPageSections();
        if (sections.length === 0) return [];

        const blocks = orderBlocksRecursively(sections[0].blocks);

        const mappedContent = blocks.map(block => ({
            tagHtml: block.properties?.['sourceHtmlTag'] ?? block.htmlTag,
            text: block.content
        }));

        return mappedContent;
    });
}