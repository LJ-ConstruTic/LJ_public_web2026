import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from "@angular/core";
import { TagStore } from "../../../store/tag/tag.store";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { TagKey, TAGS_DICTIONARY } from "../../../core/dictionary/tags-dictionary";
import { LanguageStore } from "../../../store/language/language.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { BoldPipe } from "../../../../utils/pipes/bold.pipe";

@Component({
  selector: "about",
  standalone: true,
  imports: [CommonModule, BoldPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  readonly tagStore = inject(TagStore);
  private readonly languageStore = inject(LanguageStore);
  private readonly router = inject(Router);

  readonly weAreImgUrl = this.tagStore.$img(TAGS_DICTIONARY.HEAD_WE_ARE);

  private readonly lang = computed(
    () => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel
  );

  readonly about = computed(() => {
    const lang = this.lang();
    const tags = this.tagStore.$tags();

    const text = (key: TagKey) =>
      tags.find((t) => t.isActive && t.internationalization.keyLabel === key)?.internationalization.tag[lang] ?? '';

    return {
      title:        text(TAGS_DICTIONARY.HOM_TITLE),
      history:      text(TAGS_DICTIONARY.WE_HISTORY_CTX),
      title2:       text(TAGS_DICTIONARY.HOM_TITLE_2),
    };
  });

  goToAboutDetail(): void {
    this.router.navigate(['about/about-detail']);
  }
}