import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { TagService } from "../../../core/services/tags.service";
import { CarouselModule } from "primeng/carousel";
import { Slide, TranslatedSlide } from "../../../core/model/slide-dto";
import { TagDataModel } from "../../../core/model/tags-dto";
import { SLIDE_IMAGES, SLIDE_KEYS } from "../../../core/dictionary/slide-dictionary";
import { LanguageStore } from "../../../store/language/language.store";
import { CommonModelResponse, InternationalizationDataModel } from "../../../core/model/common-response-dto";


@Component({
  selector: "presentation",
  standalone: true,
  imports: [CarouselModule],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './presentation.component.html'
})
export class PresentationComponent {
  private tagService = inject(TagService);
  private readonly languageStore = inject(LanguageStore);

  private readonly lang = computed(
    () => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel // current lang
  );
  readonly translatedSlides = computed<TranslatedSlide[]>(() => // Vista derivada: se recalcula sola cuando cambia lang()
    this.slides().map((slide) => ({
      title: slide.title[this.lang()] || slide.title['en'],
      context: slide.context[this.lang()] || slide.context['en'],
      imgUrl: slide.imgUrl,
    }))
  );

  activeIndex = signal<number>(0);

  private readonly slides = signal<Slide[]>([]); // Datos crudos con todos los idiomas


  // configuración del carrusel
  readonly carouselConfig = {
    indicators: {
      style: {
        'gap': '0.5rem',
        'padding': '0.75rem 0',
      }
    },
    indicator: {
      style: { 'display': 'flex' }
    },
    indicatorButton: {
      style: {
        'width': '10px',
        'height': '10px',
        'border-radius': '50%',
        'border': 'none',
        'padding': '0',
        'min-width': '0',
        'background': '#bbb',
        'cursor': 'pointer',
        'transition': 'background 0.3s ease, transform 0.3s ease',
      }
    }
  };


  ngOnInit(): void {
    this.testGetAllTags();

    this.tagService.getAllTags().subscribe({
      next: ({ items }: CommonModelResponse<TagDataModel>) => {
        const mapped: Slide[] = SLIDE_KEYS.map((prefix, i) => { // const mapped: Slide[] = SLIDE_KEYS.map((prefix) => {
          const titleTag = items.find((t) => t.internationalization.keyLabel === `${prefix}Title`);
          const contextTag = items.find((t) => t.internationalization.keyLabel === `${prefix}Context`);

          return {
            title: (titleTag?.internationalization.tag ?? '') as InternationalizationDataModel,
            context: (contextTag?.internationalization.tag ?? '') as InternationalizationDataModel,
            imgUrl: SLIDE_IMAGES[i], // imgUrl:  SLIDE_IMAGES[prefix],
          };
        });

        this.slides.set(mapped);
      },
      error: (err) => console.error(err),
    });
  }

  ////////////////////////////////////////////////////////////////////////////////

  testGetAllTags(): void {
    this.tagService.getAllTags().subscribe({
      next: (response) => console.log('✅ getAllTags:', response),
      error: (err) => console.error('❌ Error getAllTags:', err),
    });
  }

  testGetTagById(id: number): void {
    this.tagService.getTagById(id).subscribe({
      next: (tag) => console.log(`✅ getTagById(${id}):`, tag),
      error: (err) => console.error(`❌ Error getTagById(${id}):`, err),
    });
  }

}