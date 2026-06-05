import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FooterStore } from "../../store/main/footer.store";
import { TagStore } from "../../store/tag/tag.store";
import { LanguageStore } from "../../store/language/language.store";
import { ComponentAppStore } from "../../store/component/component.store";
import { InternationalizationDataModel } from "../../core/model/common-response-dto";
import { toSignal } from "@angular/core/rxjs-interop";


@Component({
    selector: 'footer',
    templateUrl: './footer.component.html',
    standalone: true,
    imports: [CommonModule],
    providers: [FooterStore], 
    encapsulation: ViewEncapsulation.None,
})

export class FooterComponent implements OnInit{
    readonly tagStore = inject(TagStore);
    readonly languageStore = inject(LanguageStore);
    readonly footerStore = inject(FooterStore);
    readonly componentStore = inject(ComponentAppStore);

    readonly currentYear = new Date().getFullYear();
    private readonly items = toSignal(this.footerStore.tags$, { initialValue: null });
    private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);
 
    constructor() {
        effect(() => {
        const items = this.componentStore.$items();
        if (items.length === 0) return;
        const footer = items.find((c) => c.idx === 10);
        if (footer) this.footerStore.loadFooterTags(footer.id);
        });
    }

    readonly footer = computed(() => {
        const lang = this.lang();
        const rawItems = this.items()?.items ?? [];
        const byOrder = (order: number) => rawItems.find((i) => i.order === order);

        return {
            logo:      byOrder(1)?.imgUrl[0] ?? null,
            copyright: byOrder(2)?.tag[lang] ?? '',
            phone:     byOrder(3)?.tag[lang] ?? '',
            email:     byOrder(4)?.tag[lang] ?? '',
            company:   byOrder(5)?.tag[lang] ?? '',
            address:   byOrder(6)?.tag[lang] ?? '',
            instagram: byOrder(7)?.imgUrl[0] ?? null,
            facebook:  byOrder(8)?.imgUrl[0] ?? null,
            linkedin:  byOrder(9)?.imgUrl[0] ?? null,
        };
    });

    ngOnInit(): void {
        const servicesTags = this.componentStore.$items().find((component) => component.idx === 10);
        if (servicesTags) {
            this.footerStore.loadFooterTags(servicesTags.id);
        }
    }
}  