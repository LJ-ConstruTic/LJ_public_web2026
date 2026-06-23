import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from "@angular/core";
import { LanguageStore } from "../../../store/language/language.store";
import { TagStore } from "../../../store/tag/tag.store";
import { ComponentAppStore } from "../../../store/component/component.store";
import { toSignal } from "@angular/core/rxjs-interop";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { GetComponentTagsStore } from "../../../store/body/tagsByComponent.store";
import { Router } from "@angular/router";

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
    readonly router = inject(Router);
    readonly languageStore = inject(LanguageStore);
    readonly servicesStore = inject(GetComponentTagsStore);
    readonly componentStore = inject(ComponentAppStore);

    private readonly items = toSignal(this.servicesStore.tags$, { initialValue: null });
    private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);

    private readonly serviceParents = computed(() =>
        this.componentStore.$menuItems().find(i => i.key === 'headServices')?.tagsParent ?? []
    );

    readonly services = computed(() => {
        const lang = this.lang();
        const parents = this.serviceParents(); // ← señal reactiva separada
        const rawItems = [...(this.items()?.items ?? [])].sort((a, b) => a.order - b.order);

        const sectionTitle = rawItems.find((i) => i.order === 1)?.tag[lang] ?? '';
        const cardItems = rawItems.filter((i) => i.order > 1);

        const cards = [];
        for (let i = 0; i < cardItems.length; i += 2) {
            const title = cardItems[i];
            const desc = cardItems[i + 1];
            if (!title) continue;
            const parent = parents.find(p => p.key === title.keys);
            console.log('title.keys:', title.keys, '| parents keys:', parents.map(p => p.key), '| match:', parent);
            cards.push({
                keys: title.keys,
                title: title.tag[lang] ?? '',
                desc: desc?.tag[lang] ?? '',
                img: title.imgUrl?.[0] ?? null,
            });
        }

        return { sectionTitle, cards };
    });

    ngOnInit(): void {
        console.log('menuItems after load:', this.componentStore.$menuItems());
        const servicesTags = this.componentStore.$items().find((component) => component.idx === 5);
        if (servicesTags) {
            this.servicesStore.loadComponentTags(servicesTags.id);
        }
    }

navigateTo(keys: string): void {
    console.log('navigateTo called:', keys);
    const parents = this.componentStore.$menuItems().find(i => i.key === 'headServices')?.tagsParent ?? [];
    console.log('parents:', parents);
    const match = parents.find(p => p.key === keys);
    console.log('match:', match);
    if (match) this.router.navigate(['/service-detail', match.tagId]);
}

}