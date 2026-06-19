import { CommonModule } from "@angular/common";
import { TagKey, TAGS_DICTIONARY } from "../../../core/dictionary/tags-dictionary";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, ViewEncapsulation } from "@angular/core";
import { LanguageStore } from "../../../store/language/language.store";
import { TagStore } from "../../../store/tag/tag.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { GetComponentTagsStore } from "../../../store/body/tagsByComponent.store";
import { ComponentAppStore } from "../../../store/component/component.store";

@Component({
  selector: "strategy",
  standalone: true,
  imports: [CommonModule],
  providers: [GetComponentTagsStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './strategy.component.html',
  styleUrl: './strategy.component.scss'
})
export class StrategyComponent implements OnInit {
  readonly tagStore = inject(TagStore);
  readonly productsStore = inject(GetComponentTagsStore);
  private readonly languageStore = inject(LanguageStore);
  readonly componentStore = inject(ComponentAppStore);

  private readonly lang = computed(
    () => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel
  );

  readonly strategy = computed(() => {
    const lang = this.lang();
    const tags = this.tagStore.$tags();

    const text = (key: TagKey) =>
      tags.find((tag) => tag.isActive && tag.internationalization.keyLabel === key)?.internationalization.tag[lang] ?? '';

    const img = (key: TagKey, i = 0) =>
      tags.find((tag) => tag.isActive && tag.internationalization.keyLabel === key)?.internationalization.imgUrl[i] ?? null;

    return {
      title: text(TAGS_DICTIONARY.HOM_ESTRATEGIES_TITLE),
      ctx1:  text(TAGS_DICTIONARY.HOM_ESTRATEGIES_CTX),
      ctx2:  text(TAGS_DICTIONARY.HOM_ESTRATEGIES_CTX2),
      img:   img(TAGS_DICTIONARY.HOM_ESTRATEGIES_TITLE, 0),
    };
  });

  ngOnInit(): void {
        const productsTags = this.componentStore.$items().find((component) => component.idx === 13);
        if (productsTags) {
            this.productsStore.loadComponentTags(productsTags.id);
        }
    }

}