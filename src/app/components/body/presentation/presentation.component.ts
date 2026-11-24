import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { CarouselModule } from "primeng/carousel";
import { Block } from "../../../core/model/component-dto";

interface PresentationSlide {
  content: string;
  imageUrl: string | null;
  imageAlt: string;
  language?: string;
}

const companySlides: readonly PresentationSlide[] = [
  {
    content: 'Construção com rigor em cada etapa.',
    imageUrl: 'img/carrusel/construcao.jpg',
    imageAlt: 'Estrutura de betão e andaimes numa obra em execução',
    language: 'pt',
  },
  {
    content: 'Reabilitação de edifícios e espaços.',
    imageUrl: 'img/carrusel/reabilitacao.jpg',
    imageAlt: 'Edifício renovado com fachada de pedra e vidro',
    language: 'pt',
  },
  {
    content: 'Soluções digitais para gerir projetos.',
    imageUrl: 'img/carrusel/informatica.jpg',
    imageAlt: 'Equipa a analisar um painel de gestão de obras',
    language: 'pt',
  },
];

@Component({
  selector: "presentation",
  standalone: true,
  imports: [CarouselModule],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent {

  readonly block = input.required<Block>();

  readonly carouselSlides = computed<PresentationSlide[]>(() => {
    const block = this.block();
    const existingSlides = [...block.children]
      .sort((first, second) => first.order - second.order)
      .map(slide => ({
        content: slide.content ?? '',
        imageUrl: block.media[0]?.url ?? null,
        imageAlt: block.content ?? '',
      }));
    return [...existingSlides, ...companySlides];
  });

  private readonly prefersReducedMotion =
    typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  readonly autoplayInterval = computed(() =>
    this.carouselSlides().length > 1 && !this.prefersReducedMotion ? 5500 : 0
  );

}
