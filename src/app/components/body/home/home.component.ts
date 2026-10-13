import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentAppStore } from '../../../store/component/component.store';
import { extractSectionFromBlock, orderBlocksRecursively } from '../../../core/utils/order-blocks.utils';
import { BlockWithComponent } from '../../../core/model/component-dto';
import { HOME_SECTION_DICTIONARY } from '../../../core/dictionary/component-dictionary';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {
    private readonly componentStore = inject(ComponentAppStore);

    readonly orderedBlocksHome = computed((): BlockWithComponent[] => {
    const sections = this.componentStore.getSectionsBySlug('page-home')();
    if (sections.length === 0) return [];

    const firstSection = sections[0];
    const sortedBlocks = orderBlocksRecursively(firstSection.blocks);

    const blocksWithComponents = sortedBlocks.map(block => {
      const sectionKey = extractSectionFromBlock(block);
      const component = sectionKey ? (HOME_SECTION_DICTIONARY[sectionKey] ?? null) : null;

      return { block, component, sectionKey };
    });

    return blocksWithComponents;
});
}