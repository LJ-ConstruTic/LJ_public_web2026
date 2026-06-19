import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from "@angular/core";
import { LanguageStore } from "../../../store/language/language.store";
import { ComponentAppStore } from "../../../store/component/component.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { toSignal } from "@angular/core/rxjs-interop";
import { GetComponentTagsStore } from "../../../store/body/tagsByComponent.store";

@Component({
    selector: "services-detail",
    standalone: true,
    imports: [CommonModule],
    providers: [GetComponentTagsStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './services-detail.component.html',
    styleUrls: ['./services-detail.component.scss']
})
export class ServicesDetailComponent implements OnInit {
    readonly languageStore = inject(LanguageStore);
    readonly conditionsStore = inject(GetComponentTagsStore);
    readonly componentStore = inject(ComponentAppStore);

    private readonly items = toSignal(this.conditionsStore.tags$, { initialValue: null });
    private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);

    readonly content = computed(() => {
        const lang = this.lang();
        return [...(this.items()?.items ?? [])]
            .sort((a, b) => a.order - b.order)
            .map(i => ({
                title: i.tag[lang] ?? '',
                img: i.imgUrl[0] ?? null,
            }));
    });

    ngOnInit(): void {
        const tags = this.componentStore.$items().find((c) => c.idx === 11);
        if (tags) this.conditionsStore.loadComponentTags(tags.id);
    }

}