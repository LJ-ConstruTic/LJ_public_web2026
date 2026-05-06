import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { TagService } from "../../../core/services/tags.service";
import { CarouselModule } from "primeng/carousel";
import { TranslatedSlide } from "../../../core/model/slide-dto";
import { LanguageStore } from "../../../store/language/language.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { TagStore } from "../../../store/tag/tag.store";
import { TagKey, TAGS_DICTIONARY } from "../../../core/dictionary/tags-dictionary";


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
  private tagService = inject(TagService);
  private readonly tagStore = inject(TagStore);
  private readonly languageStore = inject(LanguageStore);

  activeIndex = signal<number>(0);

  private readonly lang = computed(
    () => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel // current lang
  );

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

  goTo(index: number): void {
    this.activeIndex.set(index);
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