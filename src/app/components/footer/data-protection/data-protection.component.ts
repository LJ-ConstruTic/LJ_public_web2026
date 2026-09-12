import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from "@angular/core";

@Component({
    selector: "data-protection",
    standalone: true,
    imports: [CommonModule],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './data-protection.component.html',
    styleUrl: './data-protection.component.scss'
})
export class DataProtectionComponent  {
    // readonly languageStore = inject(LanguageStore);
    // readonly conditionsStore = inject(GetComponentTagsStore);
    // readonly componentStore = inject(ComponentAppStore);

    // private readonly items = toSignal(this.conditionsStore.tags$, { initialValue: null });
    // private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);

    // readonly content = computed(() => {
    //     const lang = this.lang();
    //     return [...(this.items()?.items ?? [])]
    //         .sort((a, b) => a.order - b.order)
    //         .map(i => ({
    //             tagHtml: i.tagHtml,
    //             text: i.tag[lang] ?? '',
    //         }));
    // });

    // ngOnInit(): void {
    //     const tags = this.componentStore.$items().find((c) => c.idx === 17);
    //     if (tags) this.conditionsStore.loadComponentTags(tags.id);
    // }

}