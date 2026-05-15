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

    const offers = tags
      .filter((t) => t.isActive && t.internationalization.keyLabel.startsWith('JoinTitle'))
      .map((t) => {
        const idx = t.internationalization.keyLabel.replace('JoinTitle', '');
        const descKey = `JoinDesc0${idx}` as TagKey;
        return {
          title: t.internationalization.tag[lang] ?? '',
          desc: tags.find((d) => d.isActive && d.internationalization.keyLabel === descKey)?.internationalization.tag[lang] ?? '',
        };
      })
      .filter((o) => o.title);

    return {
      title:     text(TAGS_DICTIONARY.WE_JOB_WE),
      subtitle:  text(TAGS_DICTIONARY.WE_JOB_BEST_TIC),
      positions: text(TAGS_DICTIONARY.WE_JOB_UX),
      cta:       text(TAGS_DICTIONARY.WE_JOB_CONTACT),
      offers,
    };
  });
}