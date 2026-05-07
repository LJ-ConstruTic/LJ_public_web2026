import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from "@angular/core";
import { TagStore } from "../../../store/tag/tag.store";
import { CommonModule } from "@angular/common";
import { TagKey, TAGS_DICTIONARY, TEAM_CONFIG } from "../../../core/dictionary/tags-dictionary";
import { LanguageStore } from "../../../store/language/language.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { TeamMemberConfig } from "../../../core/model/tags-dto";
import { Router } from "@angular/router";

@Component({
  selector: "about-detail",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './about-detail.component.html',
  styleUrl: './about-detail.component.scss'
})
export class AboutDetailComponent {
  readonly tagStore = inject(TagStore);
  private readonly router = inject(Router);
  private readonly languageStore = inject(LanguageStore);

  private readonly lang = computed(
    () => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel
  );

  readonly about_detail = computed(() => {
    const lang = this.lang();
    const tags = this.tagStore.$tags();

    const text = (key: TagKey) =>
      tags.find((tag) => tag.isActive && tag.internationalization.keyLabel === key)?.internationalization.tag[lang] ?? '';

    const img = (key: TagKey, i = 0) =>
      tags.find((tag) => tag.isActive && tag.internationalization.keyLabel === key)?.internationalization.imgUrl[i] ?? null;

    return {
      // History
      historyTitle: text(TAGS_DICTIONARY.WE_HISTORY),
      historyCtx2: text(TAGS_DICTIONARY.WE_HISTORY_CTX_2),
      historyCtx3: text(TAGS_DICTIONARY.WE_HISTORY_CTX_3),
      // Vision
      visionTitle: text(TAGS_DICTIONARY.WE_VISION),
      visionCtx: text(TAGS_DICTIONARY.WE_VISION_CTX),
      visionImg: img(TAGS_DICTIONARY.WE_VISION),
      // Misión
      missionTitle: text(TAGS_DICTIONARY.WE_MISSION),
      missionCtx: text(TAGS_DICTIONARY.WE_MISSION_CTX),
      missionCtx2: text(TAGS_DICTIONARY.WE_MISSION_CTX_2),
      // Team
      teamTitle: text(TAGS_DICTIONARY.WE_JOB_WE),
      team: TEAM_CONFIG.map((person: TeamMemberConfig) => ({
        key:  person.nameKey,
        name: text(person.nameKey),
        job: person.jobKey ? text(person.jobKey) : '',
        img: img(person.nameKey),
      })),
    };
  });

  goBack(): void {
    this.router.navigate(['/']);
  }
}