import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from "@angular/core";
import { TagStore } from "../../../store/tag/tag.store";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { TAGS_DICTIONARY } from "../../../core/dictionary/tags-dictionary";
import { LanguageStore } from "../../../store/language/language.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { IMG_DICTIONARY } from "../../../core/dictionary/imag-dictionary";

@Component({
  selector: "about",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  readonly tagStore = inject(TagStore);
  private readonly languageStore = inject(LanguageStore);
  private readonly router = inject(Router);

  readonly weAreImgUrl = computed(
    () => this.tagStore.$imgByKey(IMG_DICTIONARY.HEAD_WE_ARE)()?.internationalization.imgUrl[0] ?? null
  );

  private readonly lang = computed(
    () => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel
  );

  readonly history      = this.tagStore.$translate(TAGS_DICTIONARY.WE_HISTORY_CTX,   this.lang);

  goToAboutDetail(): void {
    this.router.navigate(['about/about-detail']);
  }
}