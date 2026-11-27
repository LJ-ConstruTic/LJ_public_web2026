import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { CarouselModule } from "primeng/carousel";
import { Block } from "../../../core/model/component-dto";

interface PresentationSlide {
  content: string;
  imageUrl: string | null;
  imageAlt: string;
  language?: string;
  srcset?: string;
}

const deployedHero = 'https://ljconstrutic.com/media/web/hero-cms-720.webp';
const companySlides: readonly PresentationSlide[] = [
  {
    content: 'Construção com rigor em cada etapa.',
    imageUrl: '/img/carrusel/construcao-720.webp',
    srcset: '/img/carrusel/construcao-720.webp 720w, /img/carrusel/construcao-1440.webp 1440w',
    imageAlt: 'Estrutura de betão e andaimes numa obra em execução',
    language: 'pt',
  },
  {
    content: 'Reabilitação de edifícios e espaços.',
    imageUrl: 'img/carrusel/hero-cms-720.webp',
    imageAlt: 'Edifício renovado com fachada de pedra e vidro',
    language: 'pt',
  },
  {
    content: 'Soluções digitais para gerir projetos.',
    imageUrl: '/img/carrusel/informatica-720.webp',
    srcset: '/img/carrusel/informatica-720.webp 720w, /img/carrusel/informatica-1440.webp 1440w',
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

  readonly block = input<Block>();

  readonly carouselSlides = computed<PresentationSlide[]>(() => {
    const block = this.block();
    if (!block) {
      return [{
        ...companySlides[0],
        imageUrl: deployedHero,
        srcset: undefined,
        imageAlt: 'Profissional da construção com capacete e colete de segurança',
      }, ...companySlides.slice(1)];
    }
    const existingSlides = [...(block?.children ?? [])]
      .sort((first, second) => first.order - second.order)
      .map(slide => ({
        content: slide.content ?? '',
        imageUrl: block?.media[0]?.url ?? null,
        imageAlt: block?.content ?? '',
      }));
    return [...existingSlides, ...companySlides];
  });

  responsiveSources(url: string): string | null {
    if (url === deployedHero || url === 'https://ljconstrutic.com/media/w2/contrutiction.jpg') {
      return '/img/carrusel/hero-cms-720.webp 720w, /img/carrusel/hero-cms-1000.webp 1000w';
    }
    return null;
  }

  private readonly prefersReducedMotion =
    typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  readonly autoplayInterval = computed(() =>
    this.block() && this.carouselSlides().length > 1 && !this.prefersReducedMotion ? 5500 : 0
  );

}
