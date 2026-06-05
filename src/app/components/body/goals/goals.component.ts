import { CommonModule, NgStyle } from "@angular/common";
import { TagKey, TAGS_DICTIONARY } from "../../../core/dictionary/tags-dictionary";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, ViewEncapsulation } from "@angular/core";
import { LanguageStore } from "../../../store/language/language.store";
import { TagStore } from "../../../store/tag/tag.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { ComponentAppStore } from "../../../store/component/component.store";
import { toSignal } from "@angular/core/rxjs-interop";
import { GoalsStore } from "../../../store/body/goals.store";

@Component({
    selector: "goals",
    standalone: true,
    imports: [CommonModule],
    providers: [GoalsStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './goals.component.html',
    styleUrl: './goals.component.scss'
})
export class GoalsComponent implements OnInit {
    readonly tagStore = inject(TagStore);
    readonly languageStore = inject(LanguageStore);
    readonly goalsStore = inject(GoalsStore);
    readonly componentStore = inject(ComponentAppStore);

    private readonly items = toSignal(this.goalsStore.tags$, { initialValue: null });
    private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);

    readonly goals = computed(() => {
        const lang = this.lang();
        const rawItems = this.items()?.items ?? [];

        // const text = (key: TagKey) =>
        //     tags.find((tag) => tag.isActive && tag.internationalization.keyLabel === key)?.internationalization.tag[lang] ?? '';

        // return {
        //     title: text(TAGS_DICTIONARY.HOM_GOALS_TITLE),
        //     description: text(TAGS_DICTIONARY.HOM_GOALS_CTX),
        //     steps: [
        //         { num: 1, title: text(TAGS_DICTIONARY.GOAL_NAM_0), desc: text(TAGS_DICTIONARY.GOAL_DESC_0) },
        //         { num: 2, title: text(TAGS_DICTIONARY.HOM_GOAL_ITEM_TITLE_2), desc: text(TAGS_DICTIONARY.HOM_GOAL_ITEM_CTX_2) },
        //         { num: 3, title: text(TAGS_DICTIONARY.HOM_GOAL_ITEM_TITLE_3), desc: text(TAGS_DICTIONARY.HOM_GOAL_ITEM_CTX_3) },
        //         { num: 4, title: text(TAGS_DICTIONARY.HOM_GOAL_ITEM_TITLE_4), desc: text(TAGS_DICTIONARY.HOM_GOAL_ITEM_CTX_4) },
        //         { num: 5, title: text(TAGS_DICTIONARY.HOM_GOAL_ITEM_TITLE_5), desc: text(TAGS_DICTIONARY.HOM_GOAL_ITEM_CTX_5) },
        //         { num: 6, title: text(TAGS_DICTIONARY.HOM_GOAL_ITEM_TITLE_6), desc: text(TAGS_DICTIONARY.HOM_GOAL_ITEM_CTX_6) },
        //         { num: 7, title: text(TAGS_DICTIONARY.HOM_GOAL_ITEM_TITLE_7), desc: text(TAGS_DICTIONARY.HOM_GOAL_ITEM_CTX_7) },
        //     ],
        // };
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
            this.goalsStore.loadGoalsTags(goalsTags.id);
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