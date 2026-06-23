import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from "@angular/core";
import { TagStore } from "../../../store/tag/tag.store";
import { LanguageStore } from "../../../store/language/language.store";
import { GetComponentTagsStore } from "../../../store/body/tagsByComponent.store";
import { ComponentAppStore } from "../../../store/component/component.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { toSignal } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";

@Component({
    selector: "products",
    standalone: true,
    imports: [CommonModule],
    providers: [GetComponentTagsStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
    readonly tagStore = inject(TagStore);
    readonly router = inject(Router);
    readonly languageStore = inject(LanguageStore);
    readonly productsStore = inject(GetComponentTagsStore);
    readonly componentStore = inject(ComponentAppStore);

    private readonly items = toSignal(this.productsStore.tags$, { initialValue: null });

    private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);

    readonly products = computed(() => {
        const lang = this.lang();
        const parents = this.componentStore.$menuItems().find(i => i.key === 'headProduct')?.tagsParent ?? [];
        const rawItems = [...(this.items()?.items ?? [])].sort((a, b) => a.order - b.order);

        const text = (i: typeof rawItems[0]) => i?.tag[lang] ?? '';

        const productItems = rawItems.filter((i) => i.imgUrl.length > 0);
        const textItems = rawItems.filter((i) => i.imgUrl.length === 0);

        return {
            title: text(textItems[0]),
            subtitle: text(textItems[1]),
            subtitle2: text(textItems[textItems.length - 1]),
            products: productItems.map((i) => ({
                keys: i.keys,
                title: text(i),
                img: i.imgUrl[0],
            })),
        };
    });

    ngOnInit(): void {
        const productsTags = this.componentStore.$items().find((component) => component.idx === 6);
        if (productsTags) {
            this.productsStore.loadComponentTags(productsTags.id);
        }
    }

    navigateTo(keys: string): void {
        const parents = this.componentStore.$menuItems().find(i => i.key === 'headProduct')?.tagsParent ?? [];
        const match = parents.find(p => p.key === keys);
        if (match) this.router.navigate(['/product-detail', match.tagId]);
    }

}