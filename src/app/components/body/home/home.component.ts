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

    readonly completedWorks = [
        { name: 'Vila do Cedro', work: 'Reabilitação de fachada', image: 'fachada.jpg' },
        { name: 'Vale da Fonte', work: 'Renovação do centro comunitário', image: 'centro-comunitario.jpg' },
        { name: 'Bairro das Acácias', work: 'Requalificação da praça', image: 'praca.jpg' },
        { name: 'Alto da Ribeira', work: 'Renovação do campo desportivo', image: 'campo-desportivo.jpg' },
    ];

    readonly reviewStars = [1, 2, 3, 4, 5];
    readonly customerReviews = [
        { name: 'Inês M.', rating: 5, comment: 'A equipa explicou cada etapa da obra e deixou tudo impecável.' },
        { name: 'Rui C.', rating: 4, comment: 'Gostámos do resultado e da disponibilidade da equipa para esclarecer dúvidas.' },
        { name: 'Marta F.', rating: 5, comment: 'O espaço ficou mais funcional e os acabamentos ficaram como tínhamos pedido.' },
    ];

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
