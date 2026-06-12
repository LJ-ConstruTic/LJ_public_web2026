import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from "@angular/core";
import { TagStore } from "../../../store/tag/tag.store";
import { LanguageStore } from "../../../store/language/language.store";
import { ComponentAppStore } from "../../../store/component/component.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { toSignal } from "@angular/core/rxjs-interop";
import { FooterStore } from "../../../store/main/footer.store";

@Component({
    selector: "products",
    standalone: true,
    imports: [CommonModule],
    providers: [FooterStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './conditions.component.html',
    styleUrl: './conditions.component.scss'
})
export class ConditionsComponent implements OnInit {
    readonly tagStore = inject(TagStore);
    readonly languageStore = inject(LanguageStore);
    readonly footerStore = inject(FooterStore);
    readonly componentStore = inject(ComponentAppStore);

    private readonly items = toSignal(this.footerStore.tags$, { initialValue: null });

    private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);

    readonly products = computed(() => {
        const lang = this.lang();
    const rawItems = [...(this.items()?.items ?? [])].sort((a, b) => a.order - b.order);

    const text = (i: typeof rawItems[0]) => i?.tag[lang] ?? '';

    const productItems = rawItems.filter((i) => i.imgUrl.length > 0);
    const textItems = rawItems.filter((i) => i.imgUrl.length === 0);

    return {
        title: text(textItems[0]),
        subtitle: text(textItems[1]),
        subtitle2: text(textItems[textItems.length - 1]),
        products: productItems.map((i) => ({
            title: text(i),
            img: i.imgUrl[0],
        })),
    };
    });

    ngOnInit(): void {
        const productsTags = this.componentStore.$items().find((component) => component.idx === 19);
        if (productsTags) {
            this.footerStore.loadFooterTags(productsTags.id);
        }
    }

}