import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from "@angular/core";
import { TagStore } from "../../../store/tag/tag.store";
import { LanguageStore } from "../../../store/language/language.store";
import { ProductsStore } from "../../../store/body/products.store";
import { ComponentAppStore } from "../../../store/component/component.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
    selector: "products",
    standalone: true,
    imports: [CommonModule],
    providers: [ProductsStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
    readonly tagStore = inject(TagStore);
    readonly languageStore = inject(LanguageStore);
    readonly productsStore = inject(ProductsStore);
    readonly componentStore = inject(ComponentAppStore);

    private readonly items = toSignal(this.productsStore.tags$, { initialValue: null });

    private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);

    readonly products = computed(() => {
        const lang = this.lang();
        const rawItems = this.items()?.items ?? [];

        const byOrder = (order: number) => rawItems.find((i) => i.order === order);

        const products = rawItems
            .filter((i) => i.order >= 3 && i.imgUrl.length > 0)
            .sort((a, b) => a.order - b.order)
            .map((i) => ({
                title: i.tag[lang] ?? '',
                img: i.imgUrl[0],
            }));

        return {
            title: byOrder(1)?.tag[lang] ?? '',
            subtitle: byOrder(2)?.tag[lang] ?? '',
            subtitle2: byOrder(6)?.tag[lang] ?? '',
            products,
        };
    });

    ngOnInit(): void {
        const productsTags = this.componentStore.$items().find((component) => component.idx === 6);
        if (productsTags) {
            this.productsStore.loadProductsTags(productsTags.id);
        }
    }

}