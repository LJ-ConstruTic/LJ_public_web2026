import { ChangeDetectionStrategy, Component, computed, effect, inject, Injector, OnInit, signal } from "@angular/core";
import { TagService } from "../../../core/services/tags.service";
import { CarouselModule } from "primeng/carousel";
import { TranslatedSlide } from "../../../core/model/slide-dto";
import { LanguageStore } from "../../../store/language/language.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { TagStore } from "../../../store/tag/tag.store";
import { TagKey, TAGS_DICTIONARY } from "../../../core/dictionary/tags-dictionary";
import { ComponentAppStore } from "../../../store/component/component.store";
import { toSignal } from "@angular/core/rxjs-interop";
import { GetComponentTagsStore } from "../../../store/body/tagsByComponent.store";


@Component({
  selector: "presentation",
  standalone: true,
  imports: [CarouselModule],
  providers: [GetComponentTagsStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent implements OnInit{
  readonly tagStore = inject(TagStore);
  readonly weAreStore = inject(GetComponentTagsStore);
  readonly languageStore = inject(LanguageStore);
  private readonly componentStore = inject(ComponentAppStore);
  private readonly injector = inject(Injector);

  private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);

  private readonly items = toSignal(this.weAreStore.tags$, { initialValue: null });

  activeIndex = signal<number>(0);

  // Faltará coger los datos a partir del componente

  readonly slides = computed<TranslatedSlide[]>(() => {
    const lang = this.lang();
    const tags = this.tagStore.$tags();

    const text = (key: TagKey): string => {
      const tag = tags.find((item) => item.isActive && item.internationalization.keyLabel === key)?.internationalization.tag;
      return tag ? (tag[lang] || tag['en']) : '';
    };

    const img = (key: TagKey, i = 0): string =>
      tags.find((t) => t.isActive && t.internationalization.keyLabel === key)?.internationalization.imgUrl[i] ?? '';

    return [
      { title: text(TAGS_DICTIONARY.SLI_PROJECTBUILD_TITLE), context: text(TAGS_DICTIONARY.SLI_PROJECTBUILD_CTX), imgUrl: img(TAGS_DICTIONARY.SLI_PROJECTBUILD_TITLE) },
      { title: text(TAGS_DICTIONARY.SLI_APP_TITLE), context: text(TAGS_DICTIONARY.SLI_APP_CTX), imgUrl: img(TAGS_DICTIONARY.SLI_APP_TITLE) },
      { title: text(TAGS_DICTIONARY.SLI_REFORM_TITLE), context: text(TAGS_DICTIONARY.SLI_REFORM_CTX), imgUrl: img(TAGS_DICTIONARY.SLI_REFORM_TITLE) },
      { title: text(TAGS_DICTIONARY.SLI_MANTEN_TITLE), context: text(TAGS_DICTIONARY.SLI_MANTEN_CTX), imgUrl: img(TAGS_DICTIONARY.SLI_MANTEN_TITLE) },
      { title: text(TAGS_DICTIONARY.SLI_REFORM2_TITLE), context: text(TAGS_DICTIONARY.SLI_REFORM2_CTX), imgUrl: img(TAGS_DICTIONARY.SLI_REFORM2_TITLE) },
    ];
  });

    ngOnInit(): void {
      effect(() => {
        const items = this.componentStore.$items();
        if (items.length === 0) return;

        const weAre = items.find((c) => c.idx === 3);
        if (weAre) {
          this.weAreStore.loadComponentTags(weAre.id);
        }
      }, { injector: this.injector });
    }

  goTo(index: number): void {
    this.activeIndex.set(index);
  }

}