import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from "@angular/core";
import { LanguageStore } from "../../../store/language/language.store";
import { TagStore } from "../../../store/tag/tag.store";
import { ComponentAppStore } from "../../../store/component/component.store";
import { toSignal } from "@angular/core/rxjs-interop";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { GetComponentTagsStore } from "../../../store/body/tagsByComponent.store";

@Component({
    selector: "services",
    standalone: true,
    imports: [CommonModule],
    providers: [GetComponentTagsStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './services.component.html',
    styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
    readonly tagStore = inject(TagStore);
    readonly languageStore = inject(LanguageStore);
    readonly servicesStore = inject(GetComponentTagsStore);
    readonly componentStore = inject(ComponentAppStore);

    private readonly items = toSignal(this.servicesStore.tags$, { initialValue: null });
    private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);

    readonly services = computed(() => {
        const lang = this.lang();
        const rawItems = [...(this.items()?.items ?? [])].sort((a, b) => a.order - b.order);

        const cards = [];
        for (let i = 0; i < rawItems.length; i += 2) {
            const title = rawItems[i];
            const desc = rawItems[i + 1];
            if (!title) continue;
            cards.push({
                title: title.tag[lang] ?? '',
                desc: desc?.tag[lang] ?? '',
                img: title.imgUrl?.[0] ?? null,
            });
        }

        return { cards };
    });

    ngOnInit(): void {
        const servicesTags = this.componentStore.$items().find((component) => component.idx === 5);
        if (servicesTags) {
            this.servicesStore.loadComponentTags(servicesTags.id);
        }
    }

}