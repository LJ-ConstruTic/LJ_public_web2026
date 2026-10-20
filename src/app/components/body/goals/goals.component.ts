import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, untracked, ViewEncapsulation } from "@angular/core";
import { LanguageStore } from "../../../store/language/language.store";
import { ComponentAppStore } from "../../../store/component/component.store";
import { Block } from "../../../core/model/component-dto";

@Component({
    selector: "goals",
    standalone: true,
    imports: [CommonModule],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './goals.component.html',
    styleUrl: './goals.component.scss'
})
export class GoalsComponent {
    readonly block = input.required<Block>();
    private readonly componentStore = inject(ComponentAppStore);
    private readonly languageStore = inject(LanguageStore);

    private readonly goalsPageSections = this.componentStore.getSectionsBySlug('page-goals');

    constructor() {
        effect(() => {
            const lang = this.languageStore.$selectedCodeLang();
            if (!lang) return;

            untracked(() => {
                this.componentStore.loadPageBySlug({ slug: 'page-goals', lang });
            });
        });
    }

    private readonly goalsParentBlock = computed(() => {
        const sections = this.goalsPageSections();
        if (sections.length === 0) return null;

        const parentBlock = sections[0].blocks[0] ?? null;
        return parentBlock;
    });

    readonly goalsTitle = computed(() => {
        return this.goalsParentBlock()?.content ?? '';
    });

    readonly goalsIntro = computed(() => {
        const parent = this.goalsParentBlock();
        if (!parent) return '';

        const introBlock = parent.children.find(child => child.type === 'text');
        return introBlock?.content ?? '';
    });

    readonly goalsSteps = computed(() => {
        const parent = this.goalsParentBlock();
        if (!parent) return [];

        const steps = parent.children
            .filter(child => child.type === 'heading')
            .sort((stepA, stepB) => stepA.order - stepB.order)
            .map((step, index) => {
                const description = step.children.find(child => child.type === 'text')?.content ?? '';
                return {
                    number: index + 1,
                    title: step.content ?? '',
                    description,
                };
            });
        return steps;
    });

    readonly colors = ['#32CD32', '#2ab82a', '#229422', '#1a701a', '#124c12', '#0a280a', '#050f05'];
    readonly icons = [
        'pi-search', 'pi-chart-bar', 'pi-users', 'pi-bullseye',
        'pi-cog', 'pi-wrench', 'pi-sync', 'pi-trophy',
    ];

    textColor(hex: string): string {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const luminance = (r * 299 + g * 587 + b * 114) / 1000;
        return luminance > 110 ? '#1a1a1a' : '#ffffff';
    }
}