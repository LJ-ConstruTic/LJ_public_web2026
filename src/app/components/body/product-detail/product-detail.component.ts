import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, ViewEncapsulation } from "@angular/core";
import { LanguageStore } from "../../../store/language/language.store";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { ComponentAppStore } from "../../../store/component/component.store";
import { map } from "rxjs";
import { findBlockById } from "../../../core/utils/order-blocks.utils";

@Component({
    selector: "products",
    standalone: true,
    imports: [CommonModule],
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

    private readonly productPageSections = this.componentStore.getSectionsBySlug('page-product');

    private readonly productIdFromRoute = toSignal(
        this.route.params.pipe(
            map(params => params['id'] as string)
        )
    );

    readonly productBlock = computed(() => {
        const sections = this.productPageSections();
        const productId = this.productIdFromRoute();

        if (sections.length === 0 || !productId) return null;

        for (const section of sections) {
            const found = findBlockById(section.blocks, productId);
            if (found) {
                console.log('[ProductDetailComponent] bloque completo:', JSON.stringify(found, null, 2));
                return found;
            }
        }

        return null;
    });

    goBack(): void {
        this.router.navigate(['/']);
    }
}