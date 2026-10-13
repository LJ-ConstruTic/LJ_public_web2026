import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from "@angular/core";
import { Block } from "../../../core/model/component-dto";
import { Router } from "@angular/router";
import { ComponentAppStore } from "../../../store/component/component.store";
import { LanguageStore } from "../../../store/language/language.store";

@Component({
    selector: "services",
    standalone: true,
    imports: [CommonModule],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './services.component.html',
    styleUrl: './services.component.scss'
})
export class ServicesComponent {
    readonly block = input.required<Block>();

    private readonly router = inject(Router);
    readonly componentStore = inject(ComponentAppStore);
    readonly languageStore = inject(LanguageStore);

    
    readonly servicesTitle = computed(() => {
        const title = this.block().content ?? '';
        console.log('[ServicesComponent] título:', title);
        return title;
    });

    readonly serviceCardsWithDescription = computed(() => {
        const cards = this.block().children
            .filter(child => child.properties['productId'] != null)
            .map(card => {
                const description = card.children.find(child => child.type === 'text')?.content ?? '';
                console.log('[ServicesComponent] card:', card.content, '→ desc:', description.substring(0, 40) + '...');
                return { card, description };
            });

        console.log('[ServicesComponent] tarjetas:', cards.length);
        return cards;
    });

    navigateToService(serviceBlock: Block): void {
        const productId = serviceBlock.properties['productId'];
        const pageSlug = serviceBlock.properties['page'];
        const lang = this.languageStore.$selectedCodeLang();

        console.log('[ServicesComponent] click en servicio:', serviceBlock.content, '→ id:', productId, '→ page:', pageSlug);

        if (typeof productId === 'string' && typeof pageSlug === 'string' && lang) {
            this.componentStore.loadPageBySlug({ slug: pageSlug, lang });
            this.router.navigate(['/service-detail', productId]);
        }
    }
}