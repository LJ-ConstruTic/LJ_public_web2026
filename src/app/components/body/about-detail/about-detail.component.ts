import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LanguageStore } from "../../../store/language/language.store";
import { Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { JoinInComponent } from "../join-in/join.component";
import { ComponentAppStore } from "../../../store/component/component.store";
import { orderBlocksRecursively } from "../../../core/utils/order-blocks.utils";
import { BoldPipe } from "../../../../utils/pipes/bold.pipe";
import { TeamComponent } from "../team/team.component";
import { Block } from "../../../core/model/component-dto";

@Component({
  selector: "about-detail",
  standalone: true,
  imports: [CommonModule, JoinInComponent, BoldPipe, TeamComponent],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './about-detail.component.html',
  styleUrl: './about-detail.component.scss'
})
export class AboutDetailComponent {
  private readonly router = inject(Router);
  private readonly componentStore = inject(ComponentAppStore);
  private readonly languageStore = inject(LanguageStore);

  private readonly historyPageSections = this.componentStore.getSectionsBySlug('page-history');
  private readonly teamPageSections = this.componentStore.getSectionsBySlug('page-team');
  private readonly joinPageSections = this.componentStore.getSectionsBySlug('page-join');

  constructor() {
    effect(() => {
      const lang = this.languageStore.$selectedCodeLang();
      if (!lang) return;

      untracked(() => {
        this.componentStore.loadPageBySlug({ slug: 'page-history', lang });
        this.componentStore.loadPageBySlug({ slug: 'page-team', lang });
        this.componentStore.loadPageBySlug({ slug: 'page-join', lang });
      });
    });
  }

  readonly historyBlocks = computed(() => {
    const sections = this.historyPageSections();
    if (sections.length === 0) return [];
    const blocks = orderBlocksRecursively(sections[0].blocks);
    return blocks;
  });

  readonly teamBlocks = computed(() => {
    const sections = this.teamPageSections();
    if (sections.length === 0) return [];
    const blocks = orderBlocksRecursively(sections[0].blocks);
    return blocks;
  });

  readonly joinBlocks = computed(() => {
    const sections = this.joinPageSections();
    if (sections.length === 0) return [];
    const blocks = orderBlocksRecursively(sections[0].blocks);
    return blocks;
  });

  readonly historySections = computed(() => {
    const blocks = this.historyBlocks();
    if (blocks.length === 0) return [];

    const excludedSourceKeys = new Set([
        'ourTeans', 'workAsContext', 'weJobUx', 'weJobContac', 'weJobBestTic'
    ]);

    const isExcluded = (block: Block): boolean => {
        const sourceKey = block.properties['sourceKey'] as string ?? '';
        return excludedSourceKeys.has(sourceKey) || sourceKey.startsWith('WeAreName') || sourceKey.startsWith('WeAreJob');
    };

    const sections: { title: string; image: string | null; paragraphs: string[] }[] = [];
    let currentSection: { title: string; image: string | null; paragraphs: string[] } | null = null;

    for (const block of blocks) {
        if (isExcluded(block)) continue;

        if (block.type === 'heading') {
            if (currentSection) sections.push(currentSection);
            currentSection = { title: block.content ?? '', image: null, paragraphs: [] };
        } else if (block.type === 'image' && block.media.length > 0) {
            if (currentSection) {
                currentSection.image = block.media[0].url;
            }
        } else if (block.type === 'text') {
            if (currentSection) {
                currentSection.paragraphs.push(block.content ?? '');
            }
        }
    }

    if (currentSection) sections.push(currentSection);

    return sections;
  });

  readonly teamMembers = computed(() => {
    const blocks = this.teamBlocks();
    const members = blocks.map(block => ({
      name: block.content ?? '',
      image: block.media.length > 0 ? block.media[0].url : null,
    }));
    return members;
  });

  readonly returnButtonText = computed(() => {
    const sections = this.historyPageSections();
    for (const section of sections) {
        const buttonBlock = section.blocks.find(block => block.key === 'button-return');
        if (buttonBlock) {
            return buttonBlock.content ?? '';
        }
    }
    return '';
  });

  goBack(): void {
    this.router.navigate(['/']);
  }

}