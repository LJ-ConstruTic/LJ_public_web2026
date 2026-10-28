import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, untracked, ViewEncapsulation } from "@angular/core";
import { LanguageStore } from "../../../store/language/language.store";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { ComponentAppStore } from "../../../store/component/component.store";
import { map } from "rxjs";
import { findBlockById } from "../../../core/utils/order-blocks.utils";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "products",
    standalone: true,
    imports: [CommonModule, TranslateModule],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './product-detail.component.html',
    styleUrl: './product-detail.component.scss'
})

export class ProductDetailComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly componentStore = inject(ComponentAppStore);
    private readonly languageStore = inject(LanguageStore);

    private readonly productPageSections = this.componentStore.getSectionsBySlug('page-product');

    private readonly productIdFromRoute = toSignal(
        this.route.params.pipe(
            map(params => params['id'] as string)
        )
    );

     constructor() {
        effect(() => {
            const lang = this.languageStore.$selectedCodeLang();
            if (!lang) return;

            untracked(() => {
                this.componentStore.loadPageBySlug({ slug: 'page-product', lang });
            });
        });
    }

    readonly productBlock = computed(() => {
        const sections = this.productPageSections();
        const productId = this.productIdFromRoute();

        if (sections.length === 0 || !productId) return null;

        for (const section of sections) {
            const found = findBlockById(section.blocks, productId);
            if (found) {
                return found;
            }
        }

        return null;
    });

    readonly returnButtonText = computed(() => {
        const sections = this.productPageSections();
        if (sections.length === 0) return '';

        for (const section of sections) {
            const buttonBlock = section.blocks.find(block => block.key === 'button-return');
            if (buttonBlock) {
                return buttonBlock.content ?? '';
            }
        }
        return '';
    });

    goBack(): void {
        this.router.navigate(['/']);
    }
}