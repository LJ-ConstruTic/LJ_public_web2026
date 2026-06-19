import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, ViewEncapsulation } from "@angular/core";
import { LanguageStore } from "../../../store/language/language.store";
import { TagStore } from "../../../store/tag/tag.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { ComponentAppStore } from "../../../store/component/component.store";
import { toSignal } from "@angular/core/rxjs-interop";
import { GetComponentTagsStore } from "../../../store/body/tagsByComponent.store";

@Component({
    selector: "goals",
    standalone: true,
    imports: [CommonModule],
    providers: [GetComponentTagsStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './goals.component.html',
    styleUrl: './goals.component.scss'
})
export class GoalsComponent implements OnInit {
    readonly tagStore = inject(TagStore);
    readonly languageStore = inject(LanguageStore);
    readonly goalsStore = inject(GetComponentTagsStore);
    readonly componentStore = inject(ComponentAppStore);

    private readonly items = toSignal(this.goalsStore.tags$, { initialValue: null });
    private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);

    readonly goals = computed(() => {
        const lang = this.lang();
        const rawItems = [...(this.items()?.items ?? [])].sort((a, b) => a.order - b.order);

        const sectionTitle = rawItems.find((i) => i.order === 1)?.tag[lang] ?? '';
        const intro = rawItems.find((i) => i.order === 2)?.tag[lang] ?? '';

        const cardItems = rawItems.filter((i) => i.order > 2);
        const steps: { num: number; title: string; desc: string }[] = [];

        for (let i = 0; i < cardItems.length; i += 2) {
            const title = cardItems[i];
            const desc = cardItems[i + 1];
            if (!title) continue;
            steps.push({
                num: steps.length + 1,
                title: title.tag[lang] ?? '',
                desc: desc?.tag[lang] ?? '',
            });
        }

        return { sectionTitle, intro, steps };
    });

    readonly colors = ['#32CD32', '#2ab82a', '#229422', '#1a701a', '#124c12', '#0a280a', '#050f05'];
    readonly icons = [
        'pi-search',
        'pi-chart-bar',
        'pi-users',
        'pi-bullseye',
        'pi-cog',
        'pi-wrench',
        'pi-sync',
        'pi-trophy',
    ];

    ngOnInit(): void {
        const goalsTags = this.componentStore.$items().find((component) => component.idx === 4);
        if (goalsTags) {
            this.goalsStore.loadComponentTags(goalsTags.id);
        }
    }

    textColor(hex: string): string {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const luminance = (r * 299 + g * 587 + b * 114) / 1000;

        return luminance > 110 ? '#1a1a1a' : '#ffffff';
    }
}