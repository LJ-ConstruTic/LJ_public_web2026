import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from "@angular/core";
import { ServicesStore } from "../../../store/body/services.store";
import { LanguageStore } from "../../../store/language/language.store";
import { TagStore } from "../../../store/tag/tag.store";
import { ComponentAppStore } from "../../../store/component/component.store";
import { toSignal } from "@angular/core/rxjs-interop";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";

@Component({
    selector: "services",
    standalone: true,
    imports: [CommonModule],
    providers: [ServicesStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './services.component.html',
    styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
    readonly tagStore = inject(TagStore);
    readonly languageStore = inject(LanguageStore);
    readonly servicesStore = inject(ServicesStore);
    readonly componentStore = inject(ComponentAppStore);

    private readonly items = toSignal(this.servicesStore.tags$, { initialValue: null });
    private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);

    readonly services = computed(() => {
        const lang = this.lang();
        const rawItems = this.items()?.items ?? [];
        const byOrder = (order: number) => rawItems.find((i) => i.order === order);

        const cards = [
            { title: byOrder(1)?.tag[lang] ?? '', desc: byOrder(2)?.tag[lang] ?? '', img: byOrder(1)?.imgUrl[0] ?? null },
            { title: byOrder(3)?.tag[lang] ?? '', desc: byOrder(4)?.tag[lang] ?? '', img: byOrder(3)?.imgUrl[0] ?? null },
            { title: byOrder(5)?.tag[lang] ?? '', desc: byOrder(6)?.tag[lang] ?? '', img: byOrder(5)?.imgUrl[0] ?? null },
            { title: byOrder(7)?.tag[lang] ?? '', desc: byOrder(8)?.tag[lang] ?? '', img: byOrder(7)?.imgUrl[0] ?? null },
        ];

        return { cards };
    });

    ngOnInit(): void {
        const servicesTags = this.componentStore.$items().find((component) => component.idx === 5);
        if (servicesTags) {
            this.servicesStore.loadServicesTags(servicesTags.id);
        }
    }

}