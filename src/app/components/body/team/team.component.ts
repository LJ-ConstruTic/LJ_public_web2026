import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, Injector } from "@angular/core";
import { LanguageStore } from "../../../store/language/language.store";
import { ComponentAppStore } from "../../../store/component/component.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { toSignal } from "@angular/core/rxjs-interop";
import { GetComponentTagsStore } from "../../../store/body/tagsByComponent.store";

@Component({
    selector: "team",
    standalone: true,
    imports: [CommonModule],
    providers: [GetComponentTagsStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.scss']
})
export class TeamComponent {
    readonly languageStore = inject(LanguageStore);
    readonly teamStore = inject(GetComponentTagsStore);
    readonly componentStore = inject(ComponentAppStore);
    private readonly injector = inject(Injector);

    private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);
    private readonly items = toSignal(this.teamStore.tags$, { initialValue: null });

    readonly members = computed(() => {
        const lang = this.lang();
        return [...(this.items()?.items ?? [])]
            .sort((a, b) => a.order - b.order)
            .map(i => ({
                name: i.tag[lang] ?? '',
                img: i.imgUrl[0] ?? null,
            }));
    });

    constructor() {
        effect(() => {
            const items = this.componentStore.$items();
            if (items.length === 0) return;
            const team = items.find((c) => c.idx === 20);
            if (team) this.teamStore.loadComponentTags(team.id);
        }, { injector: this.injector });
    }
}
