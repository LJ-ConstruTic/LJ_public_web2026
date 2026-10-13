import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from "@angular/core";
import { LanguageStore } from "../../../store/language/language.store";
import { ComponentAppStore } from "../../../store/component/component.store";
import { toSignal } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { Block } from "../../../core/model/component-dto";

@Component({
    selector: "products",
    standalone: true,
    imports: [CommonModule],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss'
})
export class ProductsComponent {
    readonly block = input.required<Block>();

    readonly router = inject(Router);
    readonly componentStore = inject(ComponentAppStore);
    readonly languageStore = inject(LanguageStore);

    readonly productsTitle = computed(() => {
        const title = this.block().content ?? '';
        console.log('[ProductsComponent] título:', title);
        return title;
    });

    readonly productTextBlocks = computed(() => {
        const textChildren = this.block().children.filter(
            child => child.type === 'text'
        );
        return textChildren;
    });

    readonly productCards = computed(() => {
        const cards = this.block().children.filter(
            child => child.properties['productId'] != null
        );
        return cards;
    });

    navigateToProduct(productBlock: Block): void {
        const productId = productBlock.properties['productId'];
        const pageSlag = productBlock.properties['page'];
        const lang = this.languageStore.$selectedCodeLang();

        console.log('[ProductsComponent] click en producto:', productBlock.content, '→ id:', productId, '→ page:', pageSlag);

        if (typeof productId === 'string' && typeof pageSlag === 'string' && lang) {
            this.componentStore.loadPageBySlug({ slug: pageSlag, lang });
            this.router.navigate(['/product-detail', productId]);
        }
    }

}