import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { TagKey, TAGS_DICTIONARY } from "../../../core/dictionary/tags-dictionary";
import { TagStore } from "../../../store/tag/tag.store";
import { LanguageStore } from "../../../store/language/language.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";

@Component({
    selector: "join",
    standalone: true,
    imports: [CommonModule ],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './join.component.html',
    styleUrl: './join.component.scss'
})
export class JoinInComponent {
readonly tagStore = inject(TagStore);
  private readonly languageStore = inject(LanguageStore);

  private readonly lang = computed(
    () => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel
  );

  readonly data = computed(() => {
    const lang = this.lang();
    const tags = this.tagStore.$tags();

    const text = (key: TagKey) =>
      tags.find((t) => t.isActive && t.internationalization.keyLabel === key)?.internationalization.tag[lang] ?? '';

    return {
      title:    text(TAGS_DICTIONARY.WE_JOB_WE),
      subtitle: text(TAGS_DICTIONARY.WE_JOB_BEST_TIC),
      positions: text(TAGS_DICTIONARY.WE_JOB_UX),
      cta:       text(TAGS_DICTIONARY.WE_JOB_CONTACT),
      offers: [
        { title: text(TAGS_DICTIONARY.JOIN_TITLE_0), desc: text(TAGS_DICTIONARY.JOIN_DESC_0) },
      ],
    };
  });
}