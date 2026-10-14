import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, ViewEncapsulation } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ComponentAppStore } from "../../store/component/component.store";
import { Block } from "../../core/model/component-dto";

@Component({
    selector: 'footer',
    templateUrl: './footer.component.html',
    standalone: true,
    imports: [CommonModule, RouterLink],
    providers: [],
    encapsulation: ViewEncapsulation.None,
})

export class FooterComponent {
    readonly componentStore = inject(ComponentAppStore);

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

        const links = [...block.children]
            .sort((childA, childB) => childA.order - childB.order)
            .map(child => ({
                label: child.content ?? '',
                url: child.properties['url'] as string ?? '#',
            }));

        return links;
    });

    readonly copyrightText = computed(() => {
        const block = this.footerBlocks().find(
            block => block.type === 'text' && block.properties['name'] == null
        );
        const text = block?.content ?? '';
        return text;
    });

    readonly currentYear = new Date().getFullYear();
}