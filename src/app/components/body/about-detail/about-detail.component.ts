import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from "@angular/core";
import { TagStore } from "../../../store/tag/tag.store";
import { CommonModule } from "@angular/common";
import { TAGS_DICTIONARY } from "../../../core/dictionary/tags-dictionary";
import { IMG_DICTIONARY } from "../../../core/dictionary/imag-dictionary";
import { LanguageStore } from "../../../store/language/language.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";

@Component({
  selector: "about-detail",
  standalone: true,
  imports: [ CommonModule ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './about-detail.component.html',
  styleUrl: './about-detail.component.scss'
})
export class AboutDetailComponent {
  readonly tagStore = inject(TagStore);
  private readonly languageStore = inject(LanguageStore);

  readonly teamMembers = computed(() => [
    {
      key: IMG_DICTIONARY.WE_ARE_NAME_2,
      name: 'Jose Cabral',
      role: 'Software Architect & Data Engineer',
      img: this.tagStore.$imgByKey(IMG_DICTIONARY.WE_ARE_NAME_2)()?.internationalization.imgUrl[0] ?? null
    },
    {
      key: IMG_DICTIONARY.WE_ARE_NAME_3,
      name: 'Pedro Muteca',
      role: 'Programmer Front-End',
      img: this.tagStore.$imgByKey(IMG_DICTIONARY.WE_ARE_NAME_3)()?.internationalization.imgUrl[0] ?? null
    },
  ]);

  private readonly lang = computed(
    () => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel
  );

  readonly vision = computed(() =>
    this.tagStore.$imgByKey(IMG_DICTIONARY.WE_VISION)()?.internationalization.imgUrl[0] ?? null);

  readonly historyCtx2 = this.tagStore.$translate(TAGS_DICTIONARY.WE_HISTORY_CTX_2, this.lang);
  readonly historyCtx3 = this.tagStore.$translate(TAGS_DICTIONARY.WE_HISTORY_CTX_3, this.lang);
}