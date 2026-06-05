import { ChangeDetectionStrategy, Component, computed, inject, OnInit, ViewEncapsulation } from "@angular/core";
import { TagStore } from "../../../store/tag/tag.store";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { TagKey, TAGS_DICTIONARY } from "../../../core/dictionary/tags-dictionary";
import { LanguageStore } from "../../../store/language/language.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { BoldPipe } from "../../../../utils/pipes/bold.pipe";
import { WeAreStore } from "../../../store/body/we-are.store";
import { ComponentAppStore } from "../../../store/component/component.store";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "about",
  standalone: true,
  imports: [CommonModule, BoldPipe],
  providers: [WeAreStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  readonly tagStore = inject(TagStore);
  readonly languageStore = inject(LanguageStore);
  readonly router = inject(Router);
  readonly weAreStore = inject(WeAreStore);
  readonly componentStore = inject(ComponentAppStore);

  private readonly items = toSignal(this.weAreStore.tags$, { initialValue: null });

  private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);

  readonly about = computed(() => {
    const lang = this.lang();
    const rawItems = this.items()?.items ?? [];
    const byOrder = (order: number) => rawItems.find((i) => i.order === order);
    const item0 = byOrder(1);
    return {
      history: item0?.tag[lang] ?? '',
      weAreImg: item0?.imgUrl[0] ?? null,
    };
  });

  ngOnInit(): void {
    const weAre = this.componentStore.$items().find((component) => component.idx === 3);
    if (weAre) {
      this.weAreStore.loadWeAreTags(weAre.id);
    }
  }

  goToAboutDetail(): void {
    this.router.navigate(['about/about-detail']);
  }
}